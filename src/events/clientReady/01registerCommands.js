const areCommandsDifferent = require("../../utils/areCommandsDifferent");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client) => {

  try {
    const guildId = process.env.GUILD_ID;
    if (!guildId) {
      console.log("Missing GUILD_ID env var. Skipping command registration.");
      return;
    }

    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(client, guildId);

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => {
          return cmd.name === name;
        }
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`Deleted command ${name}`);
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options
          });

          console.log(`✏️ Edited command ${name}.`);
        }
      } else {
        // This command is not registered but set to deleted, so we will just skip it
        if (localCommand.deleted) {
          console.log(`Skipping the registering of the command ${name} as its set to deleted!`);
          continue;
        }

        // Otherwise if command doesnt exist and not set to deleted, then register it

        await applicationCommands.create({
          name,
          description,
          options
        })

        console.log(`Registered command ${name}`);
      }
    }

  } catch (error) {
    console.log(`Error in registering commands: ${error}`);
  }
}
