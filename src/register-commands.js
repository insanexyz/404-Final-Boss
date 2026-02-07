require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
  {
    name: "hey",
    description: "Says hey!",
  },

  {
    name: "ping",
    description: "Shows latency of the bot",
  },

  {
    name: "owner",
    description: "The creator of the bot. You should only reach to him if facing any errors or any issues.",
  },

  {
    name: "uwu",
    description: "UwU funny text",
  },

  {
    name: "whoami",
    description: "Who am I?",
  },

  {
    name: "serverinfo",
    description: "Gives server info",
  },

  {
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
    ]
  },

  {
    name: "question",
    description: "Ask any question and get a funny random answer",
    options: [
      {
        name: "query",
        description: "Your question",
        type: ApplicationCommandOptionType.String,
        required: true,
      }
    ]
  },

  {
    name: "8ball",
    description: "(Will implement sometime in future lol)",
    options: [
      {
        name: "enter",
        description: "Enter anything you wish",
        type: ApplicationCommandOptionType.String,
        required: true,
      }
    ]
  },

  {
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
    ]
  },

  {
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
    ]
  },

  {
    name: "test",
    description: "For testing purposes only",
    options: [
      {
        name: "option-one",
        description: "Test option 1",
        type: ApplicationCommandOptionType.String,
      },

      {
        name: "option-two",
        description: "Test option 2",
        type: ApplicationCommandOptionType.String,
      },
    ]
  },

  {
    name: "set-reminder",
    description: "Lol its fake, doesnt do shit",
    options: [
      {
        name: "user",
        description: "Enter user",
        type: ApplicationCommandOptionType.String,
      },

      {
        name: "time",
        description: "After how much time to remind them",
        type: ApplicationCommandOptionType.String,
      },

      {
        name: "message",
        description: "Reminder message",
        type: ApplicationCommandOptionType.String,
      }
    ]
  }

]

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {


    console.log("Registering slash commands....");

    // Register to multiple specific servers (immediate updates)
    // await rest.put(
    //   Routes.applicationGuildCommands(process.env.CLIENT_ID, "some other id"),
    //   { body: commands }
    // )
    
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    )

    // Global commands (takes up to 1 hour to propagate)
    // await rest.put(
    //   Routes.applicationCommands(process.env.CLIENT_ID),
    //   {
    //     body: commands
    //   }
    // )

    console.log("Slash commands were registered successfully ❣️ ");
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();