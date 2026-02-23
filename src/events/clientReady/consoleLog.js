const { ActivityType } = require("discord.js");
const { getRandomInt } = require("../../utils/getRandomInt");

module.exports = (client, arg) => {
  let status = [
    {
      name: "404 Server",
      type: ActivityType.Streaming,
      url: "https://discord.gg/gVEuRuJdYN"
    },
    {
      name: "If you're always worried about crushing the ants beneath you... you won't be able to walk",
      type: ActivityType.Listening
    }
  ]


  // The arg passed here is also client
  console.log(`${client.user.tag} is ready and online 🟢 !!`);

  setInterval(() => {
    let random = getRandomInt(0, status.length - 1);
    client.user.setActivity(status[random]);
  }, 50000)
}

