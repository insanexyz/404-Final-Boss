
module.exports = async (client, guildID) => {
  let applicationCommands;

  if (guildID) {
    const guild = await client.guilds.fetch(guildID);
  }
}