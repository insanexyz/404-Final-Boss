const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

const MOJANG_PROFILE_URL = "https://api.mojang.com/users/profiles/minecraft";
const SLOTHPIXEL_PLAYER_URL = "https://api.slothpixel.me/api/players";

const withTimeout = async (url, options = {}, timeoutMs = 10000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
};

const isJsonResponse = (res) => {
  const type = res.headers.get("content-type") || "";
  return type.toLowerCase().includes("application/json");
};

const getPublicHypixelData = async (uuid, username) => {
  const urls = [
    `${SLOTHPIXEL_PLAYER_URL}/${encodeURIComponent(uuid)}`,
    `${SLOTHPIXEL_PLAYER_URL}/${encodeURIComponent(username)}`
  ];

  for (const url of urls) {
    const res = await withTimeout(url);
    if (!res.ok) {
      continue;
    }

    if (!isJsonResponse(res)) {
      continue;
    }

    const payload = await res.json();
    if (payload && !payload.error && (payload.username || payload.rank_displayname)) {
      return payload;
    }
  }

  return null;
};

module.exports = {
  name: "hypixel",
  description: "Get Hypixel player info",
  options: [
    {
      name: "username",
      description: "Minecraft username",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],

  callback: async (client, interaction) => {
    const username = interaction.options.getString("username", true);

    await interaction.deferReply();

    try {
      const profileRes = await withTimeout(`${MOJANG_PROFILE_URL}/${encodeURIComponent(username)}`);
      if (profileRes.status === 204 || profileRes.status === 404) {
        await interaction.editReply(`No Minecraft account found for \`${username}\`.`);
        return;
      }

      if (!profileRes.ok) {
        await interaction.editReply("Could not fetch Minecraft profile.");
        return;
      }

      const profile = await profileRes.json();
      const uuid = profile.id;
      const payload = await getPublicHypixelData(uuid, profile.name || username);

      if (!payload) {
        const unavailableEmbed = new EmbedBuilder()
          .setTitle("Hypixel Player Info")
          .setColor("#ff4fa3")
          .setThumbnail(`https://mc-heads.net/avatar/${encodeURIComponent(profile.name || username)}/256`)
          .addFields(
            { name: "Username", value: profile.name || username, inline: true },
            { name: "Status", value: "Public Hypixel API temporarily unavailable", inline: false },
            { name: "Plancke", value: `https://plancke.io/hypixel/player/stats/${encodeURIComponent(profile.name || username)}`, inline: false },
            { name: "NameMC", value: `https://namemc.com/profile/${encodeURIComponent(profile.name || username)}`, inline: false }
          )
          .setFooter({ text: "Source: Slothpixel (public) + fallback links" });

        await interaction.editReply({ embeds: [unavailableEmbed] });
        return;
      }

      const rank = payload.rank_displayname || payload.rank || "Default";
      const level = payload.level ?? "Unknown";
      const karma = Number(payload.karma || 0);
      const achievementPoints = Number(payload.achievement_points || 0);
      const firstLogin = payload.first_login ? `<t:${Math.floor(payload.first_login / 1000)}:R>` : "Unknown";
      const lastLogin = payload.last_logout
        ? `<t:${Math.floor(payload.last_logout / 1000)}:R>`
        : (payload.last_login ? `<t:${Math.floor(payload.last_login / 1000)}:R>` : "Unknown");
      const online = Boolean(payload.online);
      const guild = payload.guild?.name || "None";

      const embed = new EmbedBuilder()
        .setTitle("Hypixel Player Info")
        .setColor("#ff4fa3")
        .setThumbnail(`https://mc-heads.net/avatar/${encodeURIComponent(profile.name)}/256`)
        .addFields(
          { name: "Username", value: profile.name || username, inline: true },
          { name: "Rank", value: String(rank), inline: true },
          { name: "Level", value: String(level), inline: true },
          { name: "Online", value: online ? "Yes" : "No", inline: true },
          { name: "Karma", value: karma.toLocaleString(), inline: true },
          { name: "Achievement Points", value: achievementPoints.toLocaleString(), inline: true },
          { name: "Guild", value: guild, inline: true },
          { name: "First Login", value: firstLogin, inline: true },
          { name: "Last Login", value: lastLogin, inline: true },
          { name: "Plancke", value: `https://plancke.io/hypixel/player/stats/${encodeURIComponent(profile.name)}`, inline: false }
        )
        .setFooter({ text: "Source: Slothpixel (public Hypixel stats)" });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log("Hypixel command error:", error);
      await interaction.editReply("Error while fetching Hypixel info.");
    }
  }
};
