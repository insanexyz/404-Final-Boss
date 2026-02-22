#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
export PATH="$HOME/.local/bin:$PATH"

OLLAMA_BASE_URL="${LOCAL_AI_BASE_URL:-http://127.0.0.1:11434}"
OLLAMA_PID=""
STARTED_OLLAMA=0

cleanup() {
  if [[ "$STARTED_OLLAMA" -eq 1 && -n "$OLLAMA_PID" ]]; then
    kill "$OLLAMA_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM

if ! command -v ollama >/dev/null 2>&1; then
  echo "Error: ollama not found in PATH."
  echo "Run ./install.sh first."
  exit 1
fi

if ! curl -fsS "${OLLAMA_BASE_URL}/api/tags" >/dev/null 2>&1; then
  echo "Starting Ollama..."
  ollama serve >/tmp/ollama-serve.log 2>&1 &
  OLLAMA_PID=$!
  STARTED_OLLAMA=1
fi

for _ in {1..30}; do
  if curl -fsS "${OLLAMA_BASE_URL}/api/tags" >/dev/null 2>&1; then
    echo "Ollama API reachable at ${OLLAMA_BASE_URL}"
    break
  fi
  sleep 1
done

if ! curl -fsS "${OLLAMA_BASE_URL}/api/tags" >/dev/null 2>&1; then
  echo "Error: Ollama API not reachable at ${OLLAMA_BASE_URL}"
  echo "Check logs: /tmp/ollama-serve.log"
  exit 1
fi

echo "Starting Discord bot..."
node src/index.js
