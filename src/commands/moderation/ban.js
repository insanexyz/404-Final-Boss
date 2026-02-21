const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports =  {
  name: "ban",
  description: "bans a member",
  // devsOnly: boolean,
  // testOnly: boolean,
  options: [
    {
      name: "user",
      description: "sends user to oblivion",
      required: true,
      type: ApplicationCommandOptionType.Mentionable
    },

    {
      name: "reason",
      description: "Reason for the ban",
      type: ApplicationCommandOptionType.String
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions : [PermissionFlagsBits.Administrator],

  callback: (client, interaction) => {
    interaction.reply("Banned lmao scary, doesnt work yet bro!!");
  }
}