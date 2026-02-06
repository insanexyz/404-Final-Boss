const { Client, IntentsBitField, EmbedBuilder, Embed, messageLink, ActivityType } = require("discord.js");
require("dotenv").config() // gives access to content of env file anywhere in this file
const { OpenAI } = require("openai");
const { getRandomInt } = require("./utils.js");

const TOKEN = process.env.TOKEN;

let lastNumber = 0;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
})

let status = [
  {
    name: "CornHub",
    type: ActivityType.Streaming,
    url: "https://www.youtube.com/watch?v=6UFjzQXpd-Q"
  },
  {
    name: "Blowing Insane",
    tupe: ActivityType.Playing
  },
  {
    name: "Giving head to Insane",
    tupe: ActivityType.Playing
  },
  {
    name: "404 Server",
    type: ActivityType.Watching
  },
  {
    name: "Cute girl screaming",
    type: ActivityType.Listening
  }
]

client.on("clientReady", (cl) => {
  console.log(`${cl.user.tag} is ready and online 🟢 !!`);

  // client.user.setActivity({
    // {

    // }
  // })

  setInterval(() => {
    let random = getRandomInt(0, status.length - 1);
    client.user.setActivity(status[random]);
  }, 10000)
})


// Basic
client.on("messageCreate", (message) => {

  // console.log(typeof message);

  if (message.author.id === "1467947205049450668") {
    return;
  }

  if (message.content == "hello") {
    const x = getRandomInt(0, 1);
    if (x) {
      message.reply("https://nohello.net");
    }
  }

  if (message.content === "+rules") {
    const embed = new EmbedBuilder()
      .setTitle("📘Public Server Rules")
      .setDescription(`
1) 🤝
Be Respectful
• Treat everyone kindly.
• No bullying, hate speech, racism, or discrimination.
• No rude, offensive, or harassing messages.

2) 🌍
Language Rules
• English is the main language.
• You can use other languages, but NOT to insult, hide bad behavior, or break rules.

3) 🙅
No Begging
• Don't ask for roles, permissions, or unfair advantages.

4) 🛠️
Follow Staff Instructions
• Listen to moderators and admins at all times.
• Don't argue or create drama with staff decisions.

5) 💬
No Spamming
• No message spam, emoji spam, or bot command spam.
• Raiding = instant ban.

6) 🎧
No Mic Spam (VC)
• Don't scream, blast music, or disrupt voice chats.
• Use push-to-talk if needed.

7) 🎭
No Impersonation
• Don't pretend to be staff

8) 🧒
Be Mature
• No unnecessary drama, fights, or attention-seeking behavior.
• Act responsibly

9) 🧠
Use Common Sense
• If you think it might break the rules… don't do it.
• Don't look for loopholes or try to bend rules.
  `)
      .setColor("#000000");

    client.channels.cache.get("1465935638477144298").send({ embeds: [embed] });
  }

  // if (message.content.toLocaleLowerCase().includes("insane")) {
  //   client.channels.cache.get("1466130239057821716").send("<@434738865136336896> mentioned!!");
  // }

  // if (message.content.toLocaleLowerCase().includes("ak40")) {
  //   client.channels.cache.get("1466130239057821716").send("<@1383428957486977119> mentioned!!");
  // }

  // if (message.content.toLocaleLowerCase().includes("germ") || message.content.toLocaleLowerCase().includes("GΣЯM")) {
  //   client.channels.cache.get("1466130239057821716").send("<@833593810444746775> mentioned!!");
  // }

  if (message.content.toLocaleLowerCase().includes("hitler")) {
    message.reply("Hitler mentioned. You shall be reported to the police 🚨 🚨 !!")
  }

  if (message.content === "+online") {
    message.reply("kindly fuck off 🖕");
  }

  // if (message.content === "@<1429448834282688654>") {
  //   message.reply("Tf you ping me for??");
  // }

  if (message.mentions.has(client.user)) {
    if (message.author.id === "833593810444746775" || message.author.id === "1383428957486977119") {
      message.reply("Hey!! Whats up");
    } else {
      message.reply("Tf you ping me for??");
    }
  }

    // Command format: +say your message here
  if (message.content.startsWith("!say ")) {

    if (message.author.id !== "434738865136336896") return;

    const text = message.content.slice(5).trim(); // remove "+say " from start

    if (text.length === 0) return message.reply("You need to provide a message.");

    // Delete the admin’s original command message (optional)
    message.delete().catch(() => {});

    // Send the text as the bot
    message.channel.send(text);
  }

  if (message.content === "summon her") {
    message.reply("<@833593810444746775>");
  }
})


// Log all messages
const LOG_CHANNEL_IDS = "1466488701709451428";
client.on('messageCreate', async (message) => {
    // Ignore messages from bots to prevent infinite loops
    if (message.author.bot) return;
    if (message.guildId !== "1465754117879103736") return;

    const logChannel = client.channels.cache.get(LOG_CHANNEL_IDS);
    if (!logChannel) return;

    logChannel.send(`New message from ${message.author.tag} in ${message.channel.name}: ${message.content}`);
});

// Listen to slash commands and do
client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "hey") {
    interaction.reply("Heyyy!!!");
  }

  // if (interaction.commandName === "ping") {
  //   // Vibed
  //   const sent = await interaction.reply({
  //     content: "🏓 Pinging...",
  //     fetchReply: true
  //   });

  //   const timeDiff = sent.createdTimestamp - interaction.createdTimestamp;
  //   const apiLatency = Math.round(client.ws.ping);

  //   await interaction.editReply({
  //     content: `🏓 **Pong!**\n⏱️ Latency: ${timeDiff}ms\n🌐 API Latency: ${apiLatency}ms`
  //   });
  // }

  if (interaction.commandName === "uwu") {

    const uwuResponses = [
      "UwU you're standing kinda close~ 💕",
      "OwO h-hey… don't look at me like that~ ✨",
      "blushes deeply uwu stop teasing~ 🌸",
      "UwU m-my heart just skipped… weird~ 💗",
      "leans in a little owo is this okay~?",
      "UwU you're dangerously charming~ ✨",
      "tail swishes uwu someone's confident~ 🐾",
      "OwO why is it suddenly warm in here~?",
      "soft giggle uwu you're trouble~ 💕",
      "UwU eye contact is illegal… stop~ 🌸",
      "fidgets owo you noticed that~?",
      "UwU flirting detected… engaging blush mode 💗",
      "smirks owo bold today, aren't you~",
      "UwU this feels like an anime moment~ ✨",
      "heart goes doki doki uwu oh no~ 💕"
    ];

    const reply = uwuResponses[Math.floor(Math.random() * uwuResponses.length)];
    interaction.reply(reply);
  }

  if (interaction.commandName === "whoami") {
    interaction.reply("I am Casca bot working for Insane");
  }

  if (interaction.commandName === "owner") {
    interaction.reply("<@434738865136336896>");
  }

  if (interaction.commandName === "add") {
    const num1 = interaction.options.get("first-number").value;
    const num2 = interaction.options.get("second-number").value;
    interaction.reply(`${num1 + num2}`);
  }

  if (interaction.commandName === "embed") {
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

  if (interaction.commandName === "serverinfo") {
    const title = "🏳️ INSANE ASYLUM - SERVER INFO";
    const description = "Welcome to Insane Asylum! 🎮\n\n" +
      "A chill community created by Insane for gamers, developers or actually anyone who is deep into something! 🛠️\n\n" +
      "**What its about?**\n" +
      "-> Its a place mainly for devs to come and talk, discuss about their project, get help, collaborate\n" +
      "-> We also allow hiring and advertisments but only if a staff approves\n" +
      "-> Also not much rules here!\n" +
      "**Future Project:**\n" +
      "🚀 Coming soon: The Busters - A community-driven initiative to expose online scammers and protect users!\n\n" +
      "Thanks for being part of our asylum! 🏆";
    const color = "#8B00FF";
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color)
      .setThumbnail(interaction.guild.iconURL())
      .setFooter({ text: `Created by Insane | Members: ${interaction.guild.memberCount}` });

    interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === "question") {
    const funnyAnswers = [
      "Ask me again when I've had my coffee ☕",
      "The magic 8-ball is currently charging... try again later 🔮",
      "According to my calculations... the answer is 42 🤓",
      "I asked my rubber duck, he said no 🦆",
      "Error 404: Wisdom not found 🤖",
      "Let me check with the council of squirrels... 🐿️",
      "The voices in my head are divided on this one 🗣️",
      "I would tell you, but then I'd have to ban you 🤫",
      "According to the ancient scrolls... maybe? 📜",
      "I consulted the crystal ball, but it's just a paperweight ⚖️",
      "The answer is hidden in a fortune cookie somewhere 🥠",
      "I asked ChatGPT, but we're not on speaking terms 💬",
      "My sources say... look over there! 👀",
      "The hamster running my brain wheel is on break 🐹",
      "I'd answer, but my programming says I should be working 🛠️",
      "According to the algorithm of chaos... absolutely! 🎲",
      "Let me google that... brb 📱",
      "The answer is written in binary, but I forgot how to read it 💻",
      "I asked the universe, but it left me on read 🌌",
      "My psychic powers are currently updating... 📡"
    ];

    const randomAnswer = funnyAnswers[Math.floor(Math.random() * funnyAnswers.length)];
    interaction.reply(randomAnswer);
  }

  if (interaction.commandName === "set-reminder") {
    interaction.reply("Bro, I am not your slave wtf??!!??");
  }

})


client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "test") {
    // console.log(interaction.guild.iconURL());
    let messages = await interaction.channel.messages.fetch({limit : 12});

    messages.forEach(msg => {

      if (msg.author.bot) return;

      console.log(msg.content);
    });
    interaction.reply("Test done");
  }
});


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




const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ai") {
    const query = interaction.options.get("query").value;
    const ALLOWED_AICHAT_CHANNELS = ["1465916890936246312", "1465788754156322837", "1465754118630146313", "1369673178657329314"];

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

    interaction.editReply("Your question: " + query + "\n" + "Personality: " +  personality + "\n" + "Response: " + response.choices[0].message.content);
  }
})


client.login(TOKEN);