const { Client, Interaction, ApplicationCommandOptionType } = require("discord.js");
const cooldowns = new Set();

module.exports = {
  name: "repeat",
  description: "Repeat repeat repeat repeat repeat.....",
  options: [
    {
      name: "count",
      description: "Enter count",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "content",
      description: "Enter content to repeat",
      type: ApplicationCommandOptionType.String,
      required: true,
    }
  ],

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   * @returns 
   */

  callback: async (client, interaction) => {
    let num = interaction.options.get("count").value;
    let content = interaction.options.get("content").value;
    let delaySeconds = 5;

    if (content.length > 1999) {
      await interaction.reply("Too long message, exceeds 2000 characters");
      return;
    }
    if (!Number.isInteger(num)) return;

    if (cooldowns.has(interaction.member.id)) {
      interaction.reply("You can use this command once every 5 mins!\nActual time remaining is not shown.");
      return;
    }

    if (num > 100) {
      await interaction.reply(`Attempt to spam ${num} times. Count cannot exceeded 100!`);
    }

    await interaction.reply(`Spamming "${content}" ${num} times...`);

    cooldowns.add(interaction.member.id);
    setTimeout(() => {
      cooldowns.delete(interaction.member.id);
    }, 60000*5);

    for (let i = 0; i < num; i++) {
      await interaction.channel.send(`${content}`);
      await new Promise(r => setTimeout(r, delaySeconds * 1000));
    }
  }
}