module.exports = (client, message) => {
  const LOG_CHANNEL_IDS = "1466488701709451428";
  const LOG_IGNORE_CHANNELS = ["1466130239057821716", "1471171088154230938"];
  // Ignore messages from bots to prevent infinite loops
  if (message.author.bot) return;
  if (message.guildId !== "1465754117879103736") return;

  const logChannel = client.channels.cache.get(LOG_CHANNEL_IDS);
  if (!logChannel) return;

  // Ignore spam channels
  if (LOG_IGNORE_CHANNELS.includes(message.channelId)) return;

  // logChannel.send(`New message from ${message.author.tag} in ${message.channel.name}: ${message.content}`);
  logChannel.send({
    content: `New message from ${message.author.tag} in ${message.channel.name}: ${message.content}`,
    allowedMentions: { parse: [] } // 🚫 disables all mentions
  });
}