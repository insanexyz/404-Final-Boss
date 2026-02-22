#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${PROJECT_ROOT}/.env"
DEFAULT_MODEL="tinyllama:1.1b-chat"
DEFAULT_BASE_URL="http://127.0.0.1:11434"
export PATH="$HOME/.local/bin:$PATH"

say() {
  printf "\n%s\n" "$1"
}

ask_yes_no() {
  local prompt="$1"
  local default="${2:-y}"
  local reply

  if [[ "$default" == "y" ]]; then
    read -r -p "$prompt [Y/n]: " reply
    reply="${reply:-y}"
  else
    read -r -p "$prompt [y/N]: " reply
    reply="${reply:-n}"
  fi

  [[ "$reply" =~ ^[Yy]$ ]]
}

set_env_var() {
  local key="$1"
  local value="$2"

  if [[ ! -f "$ENV_FILE" ]]; then
    touch "$ENV_FILE"
  fi

  if grep -qE "^${key}=" "$ENV_FILE"; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
  else
    printf "%s=%s\n" "$key" "$value" >> "$ENV_FILE"
  fi
}

wait_for_ollama() {
  local retries=20
  local delay=1
  local i
  for ((i = 1; i <= retries; i++)); do
    if curl -fsS "${DEFAULT_BASE_URL}/api/tags" >/dev/null 2>&1; then
      return 0
    fi
    sleep "$delay"
  done
  return 1
}

ollama_is_healthy() {
  if ! command -v ollama >/dev/null 2>&1; then
    return 1
  fi

  local version_output
  if ! version_output="$(ollama --version 2>&1)"; then
    return 1
  fi

  if [[ -z "$version_output" ]]; then
    return 1
  fi

  return 0
}

install_ollama() {
  case "$OS" in
    Linux)
      local arch
      case "$(uname -m)" in
        x86_64) arch="amd64" ;;
        aarch64|arm64) arch="arm64" ;;
        *)
          echo "Unsupported Linux architecture: $(uname -m)"
          exit 1
          ;;
      esac

      local flavor="${OLLAMA_LINUX_FLAVOR:-standard}"
      local asset="ollama-linux-${arch}.tar.zst"
      if [[ "$arch" == "amd64" && "$flavor" == "rocm" ]]; then
        asset="ollama-linux-${arch}-rocm.tar.zst"
      fi

      if ! command -v zstd >/dev/null 2>&1; then
        echo "zstd is required for no-sudo Linux install. Install it first (example: sudo pacman -S zstd)."
        exit 1
      fi

      say "Installing Ollama to ~/.local (no sudo)..."
      say "Using asset: ${asset}"

      local release_json
      release_json="$(curl -fsSL https://api.github.com/repos/ollama/ollama/releases/latest)"
      local download_url
      download_url="$(printf "%s" "$release_json" | rg -o "https://[^\"]*${asset}" | head -n 1)"

      if [[ -z "$download_url" ]]; then
        echo "Could not find release asset URL for ${asset}."
        exit 1
      fi

      local tmp_archive
      tmp_archive="$(mktemp --suffix=.tar.zst)"
      mkdir -p "$HOME/.local"

      curl -fL -o "$tmp_archive" "$download_url"
      zstd -d -c "$tmp_archive" | tar -xf - -C "$HOME/.local"
      rm -f "$tmp_archive"
      ;;
    Darwin)
      if command -v brew >/dev/null 2>&1; then
        say "Installing Ollama via Homebrew..."
        brew install ollama
      else
        echo "Homebrew not found."
        echo "Install manually from https://ollama.com/download/mac and run this script again."
        exit 1
      fi
      ;;
    *)
      echo "Unsupported OS: ${OS}"
      echo "Please install Ollama manually: https://ollama.com/download"
      exit 1
      ;;
  esac
}

say "== Ollama Setup Wizard =="
say "This script installs Ollama, starts it, pulls a small model, and updates .env."

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required but not installed. Please install curl first."
  exit 1
fi

OS="$(uname -s)"
ARCH="$(uname -m)"
say "Detected platform: ${OS} (${ARCH})"

if ollama_is_healthy; then
  say "Ollama is already installed."
else
  if command -v ollama >/dev/null 2>&1; then
    say "Detected an invalid Ollama binary:"
    echo "Path: $(command -v ollama)"
    if ! ask_yes_no "Ollama seems broken. Reinstall now?" "y"; then
      echo "Installation cancelled."
      exit 1
    fi
  else
    if ! ask_yes_no "Ollama is not installed. Install now?" "y"; then
      echo "Installation cancelled."
      exit 1
    fi
  fi
  install_ollama
fi

if ! ollama_is_healthy; then
  echo "Ollama is still not available in PATH. Open a new shell and run this script again."
  exit 1
fi

say "Ollama version:"
ollama --version

if ask_yes_no "Start Ollama service/process now?" "y"; then
  case "$OS" in
    Linux)
      say "Using user-level startup (no sudo, no system service)."
      ;;
    Darwin)
      open -a Ollama >/dev/null 2>&1 || true
      ;;
  esac

  if ! wait_for_ollama; then
    say "Starting Ollama with 'ollama serve' in background..."
    nohup ollama serve >/tmp/ollama-serve.log 2>&1 &
    sleep 2
  fi
fi

if ! wait_for_ollama; then
  echo "Could not reach Ollama API at ${DEFAULT_BASE_URL}."
  echo "Start it manually with: ollama serve"
  exit 1
fi

say "Ollama API is reachable."

read -r -p "Model to pull [${DEFAULT_MODEL}]: " MODEL
MODEL="${MODEL:-$DEFAULT_MODEL}"

say "Pulling model: ${MODEL}"
ollama pull "${MODEL}"

if ask_yes_no "Update ${ENV_FILE} with LOCAL_AI_BASE_URL and LOCAL_AI_MODEL?" "y"; then
  set_env_var "LOCAL_AI_BASE_URL" "${DEFAULT_BASE_URL}"
  set_env_var "LOCAL_AI_MODEL" "${MODEL}"
  say ".env updated."
fi

say "Done."
echo "Next steps:"
echo "1) Ensure TOKEN, CLIENT_ID, and GUILD_ID are set in .env"
echo "2) Start your bot: node src/index.js"
