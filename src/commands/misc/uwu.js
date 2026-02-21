module.exports = {
  name: "uwu",
  description: "UwU funny text",
  callback: (client, interaction) => {
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
}