const getLocalCommands = require("../../utils/getLocalCommands");
const { Client, Interaction, Role } = require("discord.js");



module.exports = async (client, interaction) => {

  /**
   * @param {Client} lient
   * @param {Interaction} interaction
   * @param {Role} role
   * 
   */

  const devs = (process.env.DEVS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const testServer = process.env.TEST_SERVER_ID;



  if (interaction.isChatInputCommand()) {

    const localCommands = getLocalCommands();

    try {


      // Get command object
      const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

      // If for some reason
      if (!commandObject) return;

      if (commandObject.skip) {
        interaction.reply("This command is paused right now.");
        return;
      }

      if (commandObject.devOnly) {
        if (!devs.includes(interaction.member.id)) {
          interaction.reply({
            content: "Only devs can run this command",
            ephemeral: true
          });
          return;
        }
      }

      if (commandObject.testOnly) {
        if (testServer && interaction.guild.id !== testServer) {
          interaction.reply({
            content: "This command cannot run here!",
            ephemeral: true
          });
          return;
        }
      }

      if (commandObject.permissionsRequired?.length) {
        for (const permission of commandObject.permissionsRequired) {
          if (!interaction.member.permissions.has(permission)) {
            interaction.reply({
              content: "Not enough perms",
              ephemeral: true
            });
            return;
          }
        }
      }

      if (commandObject.botPermissions?.length) {
        for (const permission of commandObject.botPermissions) {
          const bot = interaction.guild.members.me;
          if (!bot.permissions.has(permission)) {
            interaction.reply({
              content: "I don't have enough perms",
              ephemeral: true
            });
            return;
          }
        }
      }

      if (commandObject.minAllowedRole) {
        const minAllowedRole = interaction.guild.roles.cache.get(commandObject.minAllowedRole);

        if (!minAllowedRole) {
          interaction.reply("Some problem with min allowed role settings");
          return;
        }

        const minAllowedRolePosition = minAllowedRole.position;
        const requestUserHighestRolePosition = interaction.member.roles.highest.position;


        if (requestUserHighestRolePosition < minAllowedRolePosition) {
          interaction.reply({
            content: "You don't have permission to run this command!",
            ephemeral: true
          });

          return;
        }
      }

      await commandObject.callback(client, interaction);


    } catch (error) {
      console.log("Error running the command: ", { error });
    }
  }
}
