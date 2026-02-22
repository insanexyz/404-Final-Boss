const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

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


  /**
   * 
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const targetUserID = interaction.options.get("user").value;
    const reason = interaction.options.get("reason")?.value || "No reason provided";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserID);

    if (!targetUser) {
      await interaction.editReply({
        content: `${targetUser} doesn't exist in the server!`
      })
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply({
        // content: `Server owner can't be banned.`
        content: `Why do you wanna ban server owner 🤭. He will cry uwu.`
      })
      return;
    }

    if (targetUser === client.user) {
      interaction.editReply("Cannot bot 404 Final boss himself");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      interaction.editReply({
        content: `You cant't ban ${targetUser.displayName} as they have same or higher role than you`
      })
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      interaction.editReply({
        content: `I cant't ban ${targetUser.displayName} as they have same or higher role than me`
      })
      return;
    }

    // Ban the rarget user
    try {
      await targetUser.ban({ reason });
      interaction.editReply({
        content: `${targetUser.displayName} is banned!\nReason: ${reason}`
      })
    } catch (error) {
      interaction.editReply(`Error banning ${targetUser.displayName}`);
    }

  }
}