const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {

  name: "ai",
  description: "Weird ai bot",
  options: [
    {
      name: "query",
      description: "Enter query for the bot",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "personality",
      description: "The vibe of the bot while replying",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "sigma",
          value: "sigma",
        },

        {
          name: "uwu",
          value: "uwu",
        },

        {
          name: "giga digga chad",
          value: "giga digga chad",
        },

        {
          name: "very pro nasa hacker",
          value: "very pro nasa hacker",
        }
      ]
    }
  ],

  callback: async (client, interaction) => {
    const { OpenAI } = require("openai");

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })


    const query = interaction.options.get("query").value;
    // const ALLOWED_AICHAT_CHANNELS = ["1465916890936246312", "1465788754156322837", "1465754118630146313", "1369673178657329314"];

    // if (!ALLOWED_AICHAT_CHANNELS.includes(interaction.channelId)) {
    //   await interaction.reply("You are not allowed to use this command here");
    //   return;
    // }

    // Get reply type
    const personality = interaction.options.get("personality").value;
    let content = "";

    switch (personality) {
      case "uwu":
        content = "You are cute uwu chan, be full uwu, uwu bro!!. You are very very funny and not serious at all. And you are not formal. You are like everyones fav uwu waifu." + "And you reply in no more than 20 words!!" + "Dont sound like a robot or a teacher at all, be like a real person talking with the personality mentioned.";
        break;
      case "sigma":
        content = "You are full sigma, hold back nothing. You are extremely serious. You dont give a damn and are too arrogant." + "And you reply in no more than 20 words!!" + "Dont sound like a robot or a teacher at all, be like a real person talking with the personality mentioned."
        break;
      case "giga digga chad":
        content = "You are giga chad, you are him. You treat others like children and you are their mentor." + "And you reply in no more than 20 words!!" + "Dont sound like a robot or a teacher at all, be like a real person talking with the personality mentioned.";
        break;
      case "very pro nasa hacker":
        content = "You are very pro level nasa hacker with so much knowledge even god would feel shy." + "And you reply in no more than 20 words!!" + "Dont sound like a robot or a teacher at all, be like a real person talking with the personality mentioned."
        break;
    }


    // The conversations array have one system prompt and 5 other from user and casca bot and no more than that as its created each time from fresh
    let conversations = [];
    conversations.push({
      role: "system",
      content: content,
    })

    let previousMessages = await interaction.channel.messages.fetch({ limit: 5 });
    previousMessages.reverse();

    previousMessages.forEach((msg) => {

      // If message is from some other bot except casca then ignore
      if (msg.author.bot && msg.author.id !== client.user.id) return;

      // sanitize usernames as openai dont allow any special characters. remove all spaces with _ and remove special characters
      const username = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');

      if (msg.author.id === client.user.id) {
        conversations.push({
          role: "assistant",
          name: username,
          content: msg.content,
        });

        return;
      }

      conversations.push({
        role: "user",
        name: username,
        content: msg.content,
      })
    })

    await interaction.deferReply();

    // openai api response
    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: conversations
    }).catch((error) => {
      console.log("OpenAI error:\n", error);
    })

    if (!response) {
      interaction.editReply("There was some error with the OPENAI api. Try again in some moments or DM Insane.");
      return;
    }

    interaction.editReply("Your question: " + query + "\n" + "Personality: " + personality + "\n" + "Response: " + response.choices[0].message.content);
  }
}
