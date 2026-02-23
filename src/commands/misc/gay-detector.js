const { ApplicationCommandOptionType } = require("discord.js");
const delaySeconds = 2;

module.exports = {
  name: "who-is-gay",
  description: "Gay detector",
  skip: true,
  callback: async (client, interaction) => {
    await interaction.deferReply();
    await interaction.editReply("Searching entire server for gays....")
    await new Promise(r => setTimeout(r, delaySeconds * 1000));
    await interaction.editReply("Thinking hard....")
    await new Promise(r => setTimeout(r, delaySeconds * 1000));
    await interaction.editReply("Hmm wait I think I found him....")
    await new Promise(r => setTimeout(r, delaySeconds * 1000));
    await interaction.editReply(`Its <@1117314465378082946>`);
  }
}