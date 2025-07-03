import os
import discord
import requests
from discord.ext import commands
from dotenv import load_dotenv
from keep_alive import keep_alive

load_dotenv()

TOKEN = os.getenv("DISCORD_TOKEN")
TENOR_API_KEY = os.getenv("TENOR_API_KEY")

intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix="/", intents=intents)

@bot.event
async def on_ready():
    print(f"✅ Logged in as {bot.user}")

@bot.command(name="gif")
async def gif(ctx, *, search_term: str):
    await ctx.trigger_typing()
    try:
        res = requests.get(
            f"https://tenor.googleapis.com/v2/search?q={search_term}&key={TENOR_API_KEY}&limit=1"
        )
        data = res.json()
        gif_url = data["results"][0]["media_formats"]["gif"]["url"]
        await ctx.send(gif_url)
    except:
        await ctx.send("❌ No GIF found or Tenor API failed.")

# Keep Flask alive
keep_alive()

# Run bot
bot.run(TOKEN)
