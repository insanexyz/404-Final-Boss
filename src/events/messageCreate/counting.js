const { Message } = require("discord.js");
const fs = require("fs");
const path = require("path");

require("../../jsonDB/counting.json")

let countData;
const filePath = path.join(__dirname, "../../jsonDB/counting.json");

try {
  const jsonString = fs.readFileSync(filePath, "utf8");
  countData = JSON.parse(jsonString);
} catch (error) {
  console.log("Error loading counting.json, creating default...");
  countData = { userID: null, lastCount: 0 };
  saveData();
}

function saveData() {
  fs.writeFileSync(filePath, JSON.stringify(countData, null, 2));
}

/**
 * @param {Message} message
 */

module.exports = (client, message) => {

  if (message.author.bot) return;

  if (message.channelId !== "1469044357855449324") return;

  let userEnteredNumber = Number(message.content.trim());
  if (!Number.isInteger(userEnteredNumber)) return;


  if (countData.userID !== null && countData.userID === message.author.id) {
    console.log(countData);
    message.channel.send(`<@${message.author.id}> you can't count twice!`);
    return;
  }

  if (countData.lastCount === 0 && countData.lastCount + 1 !== userEnteredNumber) {
    message.channel.send("Count is set to 0, please type 1 to begin it!");
    return;
  }

  if (countData.lastCount + 1 === userEnteredNumber) {
    message.react("✅");
    countData.lastCount++;
    countData.userID = message.author.id;
  } else {
    message.channel.send(`<@${message.author.id}> ruined the count!!`);
    countData.lastCount = 0;
    countData.userID = null;
  }

  saveData();
}