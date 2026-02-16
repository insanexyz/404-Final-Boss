const { Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
require("dotenv").config()

const TOKEN = process.env.TOKEN;

let lastNumber = 0;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});

const role = [
  {
    id: "1467955552557596938",
    label: "hacker"
  },
  {
    id: "1467955670409154630",
    label: "programmer"
  },
  {
    id: "1467955780367028265",
    label: "3d artist"
  },
  {
    id: "1234",
    label: "fake role"
  }
]

client.on("clientReady", async (cl) => {
  try {

    // to send to which channel
    // const channel = await client.channels.cache.get("1467948842283569183"); // Test channel
    const channel = await client.channels.cache.get("1468594117469667490");

    if (!channel) {
      console.log("Channel does not exists !!");
      return;
    }

    const row = new ActionRowBuilder();
    role.forEach((role) => {
      row.components.push(
        new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
      )
    });

    await channel.send({
      content: "Choose your role",
      components: [row]
    });

    process.exit(); // exit this file

  } catch (error) {
    console.log(error);
  }
})



client.login(TOKEN);

