const { ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const { createCanvas } = require("@napi-rs/canvas");

const SYSTEM_PROMPT = "Always reply in English only.";

const DEFAULT_MODEL = "tinyllama:1.1b-chat";
const DEFAULT_BASE_URL = "http://127.0.0.1:11434";
const REQUEST_TIMEOUT_MS = 60000;

const withTimeout = async (url, options, timeoutMs) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
};

const sanitizeModelOutput = (text) => {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const badStarts = [
    /^dear\b/i,
    /^i(?:'m| am)\s+sorry\b/i,
    /^sure[,!:]?\s*(here|i can|i will|i'd)/i
  ];

  if (badStarts.some((rx) => rx.test(cleaned))) {
    return "Ask in one short sentence and I will answer directly.";
  }

  return cleaned;
};

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const wrapLines = (ctx, text, maxWidth, maxLines) => {
  const words = String(text || "").split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth) {
      if (current) lines.push(current);
      current = word;
      if (lines.length >= maxLines - 1) break;
    } else {
      current = candidate;
    }
  }

  if (lines.length < maxLines && current) lines.push(current);
  if (words.length > 0 && lines.length === maxLines) {
    const idx = maxLines - 1;
    if (ctx.measureText(lines[idx]).width > maxWidth - 12) {
      lines[idx] = `${lines[idx].slice(0, Math.max(0, lines[idx].length - 3))}...`;
    }
  }

  return lines;
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const maxLineWidth = (ctx, lines) => {
  let max = 0;
  for (const line of lines) {
    const width = ctx.measureText(line).width;
    if (width > max) max = width;
  }
  return max;
};

const buildAiCard = (query, response) => {
  const measureCanvas = createCanvas(10, 10);
  const measureCtx = measureCanvas.getContext("2d");

  measureCtx.font = "500 24px Sans";
  const measureQLines = wrapLines(measureCtx, query, 1100, 40);
  const measureALines = wrapLines(measureCtx, response, 1100, 80);
  const contentMaxWidth = Math.max(
    maxLineWidth(measureCtx, measureQLines),
    maxLineWidth(measureCtx, measureALines),
    420
  );

  const contentWidth = clamp(Math.ceil(contentMaxWidth) + 70, 620, 1120);
  const cardX = 66;
  const cardY = 24;
  const blockTitleGap = 34;
  const blockTopPadding = 56;
  const blockBottomPadding = 24;
  const lineHeight = 30;
  const blockGap = 22;

  const qHeight = blockTopPadding + blockBottomPadding + (measureQLines.length * lineHeight);
  const aHeight = blockTopPadding + blockBottomPadding + (measureALines.length * lineHeight);
  const headerY = 96;
  const qY = 130;
  const aY = qY + qHeight + blockGap;
  const footerPadding = 54;

  const width = clamp(cardX * 2 + contentWidth, 760, 1280);
  const height = clamp(aY + aHeight + footerPadding, 420, 1900);
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#1b1330");
  bg.addColorStop(0.5, "#312e81");
  bg.addColorStop(1, "#1e1b4b");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(160, 130, 30, 160, 130, 360);
  glow.addColorStop(0, "rgba(167, 139, 250, 0.42)");
  glow.addColorStop(1, "rgba(167, 139, 250, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  drawRoundedRect(ctx, 24, 24, width - 48, height - 48, 24);
  ctx.fillStyle = "rgba(30, 27, 75, 0.72)";
  ctx.fill();
  ctx.strokeStyle = "rgba(196, 181, 253, 0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.save();
  drawRoundedRect(ctx, 26, 26, width - 52, height - 52, 22);
  ctx.clip();

  ctx.fillStyle = "#ede9fe";
  ctx.font = "700 50px Sans";
  ctx.fillText("404 AI Response", 66, 96);

  drawRoundedRect(ctx, cardX, qY, contentWidth, qHeight, 18);
  ctx.fillStyle = "rgba(49, 46, 129, 0.9)";
  ctx.fill();
  ctx.fillStyle = "#c4b5fd";
  ctx.font = "700 22px Sans";
  ctx.fillText("QUESTION", cardX + 20, qY + blockTitleGap);
  ctx.fillStyle = "#f5f3ff";
  ctx.font = "500 24px Sans";
  const qLines = wrapLines(ctx, query, contentWidth - 40, 40);
  let y = qY + blockTopPadding + 12;
  for (const line of qLines) {
    ctx.fillText(line, cardX + 20, y);
    y += 30;
  }

  drawRoundedRect(ctx, cardX, aY, contentWidth, aHeight, 18);
  ctx.fillStyle = "rgba(49, 46, 129, 0.9)";
  ctx.fill();
  ctx.fillStyle = "#c4b5fd";
  ctx.font = "700 22px Sans";
  ctx.fillText("ANSWER", cardX + 20, aY + blockTitleGap);
  ctx.fillStyle = "#f5f3ff";
  ctx.font = "500 24px Sans";
  const aLines = wrapLines(ctx, response, contentWidth - 40, 80);
  y = aY + blockTopPadding + 12;
  for (const line of aLines) {
    ctx.fillText(line, cardX + 20, y);
    y += 30;
  }

  ctx.restore();
  return canvas.toBuffer("image/png");
};

module.exports = {

  name: "ai",
  description: "Weird ai bot",
  options: [
    {
      name: "query",
      description: "Enter query for the bot",
      type: ApplicationCommandOptionType.String,
      required: true,
    }
  ],

  callback: async (client, interaction) => {
    const query = interaction.options.get("query").value;
    const model = process.env.LOCAL_AI_MODEL || DEFAULT_MODEL;
    const baseUrl = process.env.LOCAL_AI_BASE_URL || DEFAULT_BASE_URL;
    const prompt = `${SYSTEM_PROMPT}\n\nUser question:\n${query}`;

    try {
      await interaction.deferReply();
    } catch (error) {
      console.log("Failed to defer interaction:\n", error);
      return;
    }

    let generatedText = "";
    try {
      const res = await withTimeout(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          keep_alive: "30m",
          options: {
            num_predict: 220,
            temperature: 0.4
          }
        })
      }, REQUEST_TIMEOUT_MS);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Local AI responded with ${res.status}: ${errorText.slice(0, 200)}`);
      }

      const data = await res.json();
      generatedText = (data.response || "").trim();
    } catch (error) {
      console.log("Local AI error:\n", error);
      await interaction.editReply({
        content: "AI timeout/error",
        allowedMentions: { parse: [] }
      });
      return;
    }

    if (!generatedText) {
      await interaction.editReply({
        content: "No response",
        allowedMentions: { parse: [] }
      });
      return;
    }

    const safeReply = sanitizeModelOutput(generatedText);
    const card = buildAiCard(query, safeReply);
    const attachment = new AttachmentBuilder(card, { name: "ai-response-card.png" });

    await interaction.editReply(
      {
        content: "",
        files: [attachment],
        allowedMentions: { parse: [] }
      }
    );
  }
}
