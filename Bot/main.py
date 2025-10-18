import discord
from discord.ext import commands
import os
from dotenv import load_dotenv
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

class VerificationBot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.all()
        super().__init__(command_prefix="!", intents=intents)
        self.db = None

    async def setup_hook(self):
        # Connect to MongoDB
        mongodb_url = os.getenv('MONGODB_URL')
        self.mongo_client = AsyncIOMotorClient(mongodb_url)
        self.db = self.mongo_client['verification_bot']

        # Load cogs
        await self.load_extension('cogs.moderation')
        await self.load_extension('cogs.verification')

        # Sync commands
        await self.tree.sync()
        print("Commands synced!")

    async def on_ready(self):
        print(f'{self.user} has connected to Discord!')
        print(f'Bot is in {len(self.guilds)} guilds')

async def main():
    bot = VerificationBot()
    async with bot:
        await bot.start(os.getenv('DISCORD_TOKEN'))

if __name__ == "__main__":
    asyncio.run(main())
