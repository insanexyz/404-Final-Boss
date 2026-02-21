
module.exports = async (client, guildID) => {
  let applicationCommands;

  if (guildID) {
    // guild based commands
    const guild = await client.guilds.fetch(guildID);
    applicationCommands = guild.commands;
  } else {
    // If no guild then global commands fetch
    applicationCommands = client.application.commands; // empty as of now
  }

  await applicationCommands.fetch();
  return applicationCommands;
  // console.log(applicationCommands);
}