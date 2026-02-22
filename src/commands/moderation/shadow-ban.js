const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports = {
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
  botPermissions: [PermissionFlagsBits.Administrator],
  minAllowedRole: "1465936476134179008",

  callback: async (client, interaction) => {
    const shadowBanRole = interaction.guild.roles.cache.get("1474735965703766228")
    if (!shadowBanRole) {
      console.log("Role not found");
      return;
    }


    const targetUser = interaction.options.getMember("user");

    await interaction.deferReply();

    if (!targetUser) {
      await interaction.editReply({
        content: `${targetUser} doesn't exist in the server!`
      })
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply({
        // content: `Server owner can't be banned.`
        content: `Can't shadow the owner.`
      })
      return;
    }

    if (targetUser.id === interaction.guild.members.me.id) {
      interaction.editReply("Cannot shadow bot 404 Final boss himself");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      interaction.editReply({
        content: `You cant't shadow ban ${targetUser.displayName} as they have same or higher role than you`
      })
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      interaction.editReply({
        content: `I cant't shadow ban ${targetUser.displayName} as they have same or higher role than me`
      })
      return;
    }

    if (targetUser.roles.cache.has(shadowBanRole.id)) {
      interaction.reply({
        content: `<@${targetMember.id}> is already shadow banned!`
      })

      return;
    }

    await targetUser.roles.add(shadowBanRole);
    interaction.reply({
      content: `<@${targetMember.id}> shadow banned!`,
      // ephemeral: true
    })
  }
}