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
   * @param {client} Client 
   * @param {interaction} Interaction 
   */

  callback: async (client, interaction) => {
    const suggestion = interaction.options.get("suggest").value;
    color = "#FFF000";
    const embed = new EmbedBuilder()
      .setTitle(`Suggested by: ${interaction.member.displayName}`)
      .setDescription(suggestion)
      .setColor(color);

    interaction.reply({ embeds: [embed] });

    const message = await interaction.fetchReply();

    // Add reactions
    await message.react("⬆️");
    await message.react("⬇️");
  }
}