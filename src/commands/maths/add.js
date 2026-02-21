module.exports = {
  name: "add",
  description: "Adds two numbers",
  options: [
    {
      name: "first-number",
      description: "Enter first number",
      type: ApplicationCommandOptionType.Number,
      // choices: [
      //   {
      //     name: "one",
      //     value: 1,
      //   },

      // ],
      required: true,
    },

    {
      name: "second-number",
      description: "Enter second number",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  callback: (client, interaction) => {
    const num1 = interaction.options.get("first-number").value;
    const num2 = interaction.options.get("second-number").value;
    interaction.reply(`${num1 + num2}`);
  }
}