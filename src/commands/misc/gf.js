const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "gf",
  description: "Relationship bond much?",
  options: [
    {
      name: "user",
      description: "Your gf name",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    }
  ],
  callback: (client, interaction) => {
    const username = interaction.options.get("user").value;
    interaction.reply(`<@${username}> is now your girlfriend`);
  }
}