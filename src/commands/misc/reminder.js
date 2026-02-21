const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "set-reminder",
  description: "Lol its fake, doesnt do shit",
  options: [
    {
      name: "user",
      description: "Enter user",
      type: ApplicationCommandOptionType.String,
    },

    {
      name: "time",
      description: "After how much time to remind them",
      type: ApplicationCommandOptionType.String,
    },

    {
      name: "message",
      description: "Reminder message",
      type: ApplicationCommandOptionType.String,
    }
  ],

  callback: (client, interaction) => {
    interaction.reply("Bro, I am not your slave wtf??!!??");
  }
}