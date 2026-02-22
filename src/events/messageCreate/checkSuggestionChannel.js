const { Client, Message } = require("discord.js");

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @returns 
 */

module.exports = async (client, message) => {
  if (!message.inGuild()) return;
  if (message.author.bot) return;

  const suggestionChannelId = "1468995140851994853";

  if (message.channel.id !== suggestionChannelId) return;

  const minRequiredRoleToSendMessageID = "1465754769669755141";
  const minRequiredRoleToSendMessage = message.guild.roles.cache.get(minRequiredRoleToSendMessageID);
  if (!minRequiredRoleToSendMessage) {
    console.log("Min role misconfiguration in suggestion channel!");
    return;
  }
  const minRequiredRoleToSendMessagePosition = minRequiredRoleToSendMessage.position;
  const highestRolePositionOfUserSentMessage = message.member.roles.highest.position;

  try {

    if (minRequiredRoleToSendMessagePosition > highestRolePositionOfUserSentMessage) {
      await message.delete().catch(() => {});

      await message.channel.send({
        content: `${message.author}, please use \`/suggest\` to send suggestions.`,
      });
    }
  } catch (err) {
    console.log("Failed to delete message:", err);
  }
}