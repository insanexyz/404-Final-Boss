const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports =  {
  name: "shadow-ban",
  description: "shadow bans a user",
  // devsOnly: boolean,
  // testOnly: boolean,
  options: [
    {
      name: "user",
      description: "sends user to far away!",
      required: true,
      type: ApplicationCommandOptionType.Mentionable
    },

    {
      name: "reason",
      description: "Reason for shadow ban",
      type: ApplicationCommandOptionType.String
    },
  ],

  // permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions : [PermissionFlagsBits.Administrator],
  minAllowedRole: "1465936476134179008",

  callback: async (client, interaction) => {
    const shadowBanRole = interaction.guild.roles.cache.get("1474735965703766228")
    if (!shadowBanRole) {
      console.log("Role not found");
      return;
    }


    const targetMember = interaction.options.getMember("user");

    if (targetMember.roles.cache.has(shadowBanRole.id)) {
      interaction.reply({
        content: `<@${targetMember.id}> is already shadow banned!`
      })

      return;
    }

    await targetMember.roles.add(shadowBanRole);
    interaction.reply({
      content: `<@${targetMember.id}> shadow banned!`,
      // ephemeral: true
    })
  }
}