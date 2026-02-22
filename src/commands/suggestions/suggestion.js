const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {

  name: "suggestion",
  description: "Suggest a suggestion!",
  options: [
    {
      name: "suggest",
      description: "What do you wanna suggest?",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */

  callback: (client, interaction) => {
    const suggestion = interaction.options.get("title").value;
    color = "#FFF000";
    const embed = new EmbedBuilder()
      .setTitle(`Suggested by: ${interaction.mem}`)
      .setDescription(suggestion)
      .setColor(color);

    interaction.reply({ embeds: [embed] });
  }
}