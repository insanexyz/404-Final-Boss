const { ApplicationCommandOptionType } = require("discord.js");

const PERSONALITY_PROMPTS = {
  uwu: "You are a cute uwu personality. Be playful, funny, informal, human-sounding, and reply in <= 20 words.",
  sigma: "You are ultra-confident and serious. Be direct, arrogant, informal, and reply in <= 20 words.",
  "giga digga chad": "You are a giga chad mentor vibe. Be bold, informal, confident, and reply in <= 20 words.",
  "very pro nasa hacker": "You are an elite hacker genius vibe. Be sharp, informal, confident, and reply in <= 20 words."
};

const DEFAULT_MODEL = "tinyllama:1.1b-chat";
const DEFAULT_BASE_URL = "http://127.0.0.1:11434";
const REQUEST_TIMEOUT_MS = 15000;
const DISCORD_MAX_MESSAGE_LENGTH = 2000;

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

const trimForDiscord = (text) => {
  if (text.length <= DISCORD_MAX_MESSAGE_LENGTH) return text;
  return `${text.slice(0, DISCORD_MAX_MESSAGE_LENGTH - 3)}...`;
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
    },
    {
      name: "personality",
      description: "The vibe of the bot while replying",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "sigma",
          value: "sigma",
        },

        {
          name: "uwu",
          value: "uwu",
        },

        {
          name: "giga digga chad",
          value: "giga digga chad",
        },

        {
          name: "very pro nasa hacker",
          value: "very pro nasa hacker",
        }
      ]
    }
  ],

  callback: async (client, interaction) => {
    const query = interaction.options.get("query").value;
    const personality = interaction.options.get("personality").value;
    const systemPrompt = PERSONALITY_PROMPTS[personality] || PERSONALITY_PROMPTS.sigma;
    const model = process.env.LOCAL_AI_MODEL || DEFAULT_MODEL;
    const baseUrl = process.env.LOCAL_AI_BASE_URL || DEFAULT_BASE_URL;
    const prompt = `${systemPrompt}\n\nUser question:\n${query}`;

    await interaction.deferReply();

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
          keep_alive: "0s",
          options: {
            num_predict: 96,
            temperature: 0.7
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
        content: "Local AI failed. Ensure Ollama is running and the model exists, then try again.",
        allowedMentions: { parse: [] }
      });
      return;
    }

    if (!generatedText) {
      await interaction.editReply({
        content: "Local AI returned an empty response. Try again.",
        allowedMentions: { parse: [] }
      });
      return;
    }

    const safeReply = trimForDiscord(
      "Your question: " + query + "\n" +
      "Personality: " + personality + "\n" +
      "Response: " + generatedText
    );

    await interaction.editReply(
      {
        content: safeReply,
        allowedMentions: { parse: [] }
      }
    );
  }
}
