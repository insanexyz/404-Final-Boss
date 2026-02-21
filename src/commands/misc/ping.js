module.exports = {
  name: "ping",
  description: "Pong! Shows latency of the bot.",
  // devOnly: true,
  // testOnly: boolean,
  // options: Object[],
  // deleted: Boolean,

  callback: (client, interaction) => {
    interaction.reply(`Pong! ${client.ws.ping}ms`);
  }
}