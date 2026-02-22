const { Client, IntentsBitField, EmbedBuilder, Embed, messageLink, ActivityType } = require("discord.js");
require("dotenv").config() // gives access to content of env file anywhere in this file
const { getRandomInt } = require("./utils/getRandomInt.js");
const eventHandler = require("./handlers/eventHandler.js");
const mongoose = require("mongoose");

const TOKEN = process.env.TOKEN;


const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});


(async () => {

  try {
    // { keepAlive: true } -> Its no longer supported
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to mongodb");
    eventHandler(client);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
  client.login(TOKEN);

})();
