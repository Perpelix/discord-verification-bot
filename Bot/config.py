import os
from dotenv import load_dotenv

load_dotenv()

# Discord Configuration
DISCORD_TOKEN = os.getenv('DISCORD_TOKEN')
MONGODB_URL = os.getenv('MONGODB_URL')

# Website Configuration
WEBSITE_URL = os.getenv('WEBSITE_URL', 'https://bot.icyfrvst.com')
VERIFICATION_CALLBACK_URL = f"{WEBSITE_URL}/verify"

# Verification Settings
MAX_WARNS_BEFORE_BAN = 3
VERIFIED_ROLE_NAME = "Verified"
UNVERIFIED_ROLE_NAME = "Unverified"
VERIFY_CHANNEL_NAME = "verify"

# Colors
EMBED_COLOR_SUCCESS = 0x00ff00  # Green
EMBED_COLOR_ERROR = 0xff0000    # Red
EMBED_COLOR_INFO = 0x3498db     # Blue
EMBED_COLOR_WARNING = 0xffa500  # Orange
