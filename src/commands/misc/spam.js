const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "spam",
  description: "Spam with it uhhh wow",
  options: [
    {
      name: "count",
      description: "Enter count",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "content",
      description: "Enter content to spam",
      type: ApplicationCommandOptionType.String,
      required: true,
    }
  ],

  callback: async (client, interaction) => {
    let num = interaction.options.get("count").value;
    let content = interaction.options.get("content").value;

    if (content.length > 1999) {
      await interaction.reply("Too long message, exceeds 2000 characters");
      return;
    }
    if (!Number.isInteger(num)) return;

    if (num > 100) {
      await interaction.reply(`Attempt to spam ${num} times. Count cannot exceeded 100!`);
    }

    await interaction.reply(`Spamming "${content}" ${num} times...`);

    for (let i = 0; i < num; i++) {
      await interaction.channel.send(`${content}`);
    }
  }
}