const { Client, Message, calculateUserDefaultAvatarIndex, MessageActivityType } = require("discord.js");
const Level = require("../../models/Level");
const calculateLevelXP = require("../../utils/calculateLevelXP");
const cooldowns = new Set();


// Give min and max xp you wanna generate and
// this function will give a random number bw that range
function getRandomXP(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (client, message) => {

  // Return if messages are sent in dms or sent by bot
  if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;

  let xpToGive = 0;

  // if (message.member.voice.channel) {
  //   xpToGive = getRandomXP(1, 5);
  //   console.log("member in voice channel");
  // } else {
  //   xpToGive = getRandomXP(5, 15);
  // }

  xpToGive = getRandomXP(5, 15);

  const query = {
    userID: message.author.id,
    guildID: message.guild.id
  };

  try {
    const level = await Level.findOne(query);

    if (level) {
      level.xp += xpToGive;

      if (level.xp > calculateLevelXP(level.level)) {
        level.xp = 0;
        level.level += 1;

        message.channel.send(`${message.member} you have leveled up to **level ${level.level}**.`);
      }

      await level.save().catch((error) => {
        console.log(`Error saving updated level: ${error}`)
      })

      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id)
      }, 30000);

    } else {
      // If not level
      // create new level
      const newLevel = new Level({
        userID: message.author.id,
        guildID: message.guild.id,
        xp: xpToGive,
      });

      await newLevel.save();

      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id)
      }, 30000);
    }

  } catch (error) {
    console.log(`Error giving xp: ${error}`);
  }

}