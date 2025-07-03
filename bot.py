import os
import discord
import requests
from discord.ext import commands
from keep_alive import keep_alive
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("DISCORD_TOKEN")
TENOR_API_KEY = os.getenv("TENOR_API_KEY")

intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="/", intents=intents)

@bot.event
async def on_ready():
    print(f"Logged in as {bot.user}")

@bot.command()
async def gif(ctx, *, query):
    try:
        response = requests.get(
            f"https://tenor.googleapis.com/v2/search?q={query}&key={TENOR_API_KEY}&limit=1"
        )
        data = response.json()
        gif_url = data['results'][0]['media_formats']['gif']['url']
        await ctx.send(gif_url)
    except:
        await ctx.send("❌ Could not find a GIF!")

# Keep the web server running in background
keep_alive()

# Run the bot
bot.run(TOKEN)
