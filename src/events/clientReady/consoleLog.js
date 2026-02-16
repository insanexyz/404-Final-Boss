const { ActivityType } = require("discord.js");
const { getRandomInt } = require("../../utils/getRandomInt");

module.exports = (client, arg) => {
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


  // The arg passed here is also client
  console.log(`${client.user.tag} is ready and online 🟢 !!`);

  setInterval(() => {
    let random = getRandomInt(0, status.length - 1);
    client.user.setActivity(status[random]);
  }, 10000)
}

