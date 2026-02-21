const config = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {

  if (interaction.isChatInputCommand()) {

    const localCommands = getLocalCommands();

    try {


      // Get command object
      const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

      // If for some reason
      if (!commandObject) return;

      if (commandObject.devOnly) {
        if (!config.devs.includes(interaction.member.id)) {
          interaction.reply({
            content: "Only devs can run this command",
            ephemeral: true
          })
        }
        return;
      }

      if (commandObject.testOnly) {
        if (!(interaction.guild.id === testServer)) {
          interaction.reply({
            content: "This command cannot run here!",
            epemeral: true
          })
        }
        return;
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

      await commandObject.callback(client, interaction);


    } catch (error) {
      console.log("Error running the command: ", { error });
    }
  }
}