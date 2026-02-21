const { EmbedBuilder } = require("discord.js");

module.exports = {

  name: "embed",
  description: "Sends an embed",
  options: [
    {
      name: "title",
      description: "Title of the embed",
      type: ApplicationCommandOptionType.String,
      required: true,
    },

    {
      name: "description",
      description: "Description of the embed (use /n for new line)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },

    {
      name: "color",
      description: "Color for the embed (use hex value like #FFF000)",
      type: ApplicationCommandOptionType.String,
    },
  ],

  callback: (client, interaction) => {
    const title = interaction.options.get("title").value;
    const description = interaction.options.get("description").value;
    let color = interaction.options.get("color").value;
    if (color === null) {
      color = "#FFF000";
    }
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color);

    interaction.reply({ embeds: [embed] });
  }
}