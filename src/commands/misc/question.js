const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {

  name: "question",
  description: "Ask any question and get a funny random answer",
  options: [
    {
      name: "query",
      description: "Your question",
      type: ApplicationCommandOptionType.String,
      required: true,
    }
  ],

  callback: (client, interaction) => {
    const funnyAnswers = [
      "Ask me again when I've had my coffee ☕",
      "The magic 8-ball is currently charging... try again later 🔮",
      "According to my calculations... the answer is 42 🤓",
      "I asked my rubber duck, he said no 🦆",
      "Error 404: Wisdom not found 🤖",
      "Let me check with the council of squirrels... 🐿️",
      "The voices in my head are divided on this one 🗣️",
      "I would tell you, but then I'd have to ban you 🤫",
      "According to the ancient scrolls... maybe? 📜",
      "I consulted the crystal ball, but it's just a paperweight ⚖️",
      "The answer is hidden in a fortune cookie somewhere 🥠",
      "I asked ChatGPT, but we're not on speaking terms 💬",
      "My sources say... look over there! 👀",
      "The hamster running my brain wheel is on break 🐹",
      "I'd answer, but my programming says I should be working 🛠️",
      "According to the algorithm of chaos... absolutely! 🎲",
      "Let me google that... brb 📱",
      "The answer is written in binary, but I forgot how to read it 💻",
      "I asked the universe, but it left me on read 🌌",
      "My psychic powers are currently updating... 📡"
    ];

    const randomAnswer = funnyAnswers[Math.floor(Math.random() * funnyAnswers.length)];
    interaction.reply(randomAnswer);
  }
}