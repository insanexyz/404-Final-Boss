module.exports = (client, message) => {
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

  // if (message.mentions.has(client.user)) {
  //   // if (message.author.id === "833593810444746775" || message.author.id === "1383428957486977119") {
  //   //   message.reply("Hey!! Whats up");
  //   // } else {
  //   //   message.reply("Tf you ping me for??");
  //   // }
  //   message.delete();
  // }

  // Command format: +say your message here
  if (message.content.startsWith("!say ")) {

    if (message.author.id === "434738865136336896" || message.author.id === "1383428957486977119") {
      const text = message.content.slice(5).trim(); // remove "+say " from start

      if (text.length === 0) return message.reply("You need to provide a message.");

      // Delete the admin’s original command message (optional)
      message.delete().catch(() => { });

      // Send the text as the bot
      message.channel.send(text);
    }
  }

  if (message.content === "summon her") {
    message.reply("<@833593810444746775>");
  }
}