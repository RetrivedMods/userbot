require("dotenv").config();
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder } = require("discord.js");
const axios = require("axios");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const BOT_ID = "YOUR_BOT_CLIENT_ID"; // found in Developer Portal
const GUILD_ID = "YOUR_DISCORD_SERVER_ID"; // right-click server > Copy ID (enable Developer Mode)

const registerSlashCommand = async () => {
  const commands = [
    new SlashCommandBuilder()
      .setName("gif")
      .setDescription("Send a GIF from Tenor")
      .addStringOption((option) =>
        option.setName("query").setDescription("GIF search term").setRequired(true)
      ),
  ].map((command) => command.toJSON());

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  try {
    await rest.put(Routes.applicationGuildCommands(BOT_ID, GUILD_ID), {
      body: commands,
    });
    console.log("Slash command registered ✅");
  } catch (error) {
    console.error(error);
  }
};

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  registerSlashCommand();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "gif") {
    const query = interaction.options.getString("query");
    try {
      const res = await axios.get(
        `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${process.env.TENOR_API_KEY}&limit=1`
      );
      const gifUrl = res.data.results?.[0]?.media_formats?.gif?.url;
      if (gifUrl) {
        const embed = new EmbedBuilder()
          .setTitle(`🎬 Here's a GIF for: ${query}`)
          .setImage(gifUrl)
          .setColor(0x5865F2);
        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.reply("No GIF found 😢");
      }
    } catch {
      await interaction.reply("Failed to fetch GIF. Try again.");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
