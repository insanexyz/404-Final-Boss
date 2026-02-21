const { Client, IntentsBitField, EmbedBuilder, Embed, messageLink, ActivityType } = require("discord.js");
require("dotenv").config() // gives access to content of env file anywhere in this file
const { getRandomInt } = require("./utils/getRandomInt.js");
const eventHandler = require("./handlers/eventHandler.js");

const TOKEN = process.env.TOKEN;


const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
})

eventHandler(client);



// Interaction listener for buttons
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  await interaction.deferReply({ ephemeral: true });

  // Fetch the role from the customID of the button which is equa; to the role ID
  const role = interaction.guild.roles.cache.get(interaction.customId);

  if (!role) {
    interaction.editReply({
      content: "Couldnt find the role!",
    });
    return;
  }

  const hasRole = interaction.member.roles.cache.has(role.id);

  if (hasRole) {
    await interaction.member.roles.remove(role);
    await interaction.editReply(`The ${role} has been removed.`);
  } else {
    await interaction.member.roles.add(role);
    await interaction.editReply(`The ${role} has been added.`);
  }

})


client.login(TOKEN);