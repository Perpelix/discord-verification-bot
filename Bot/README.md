# Verification Bot

A powerful Discord bot with verification system, alt account detection, and moderation tools.

## Features

- **Verification System**: IP-based verification with alt account detection
- **Moderation Tools**: Warn system with automatic ban after 3 warnings
- **Cog-Based Architecture**: Organized and maintainable code structure
- **MongoDB Integration**: All data stored per-server in MongoDB
- **Web Dashboard**: Manage your bot through a web interface

## Commands

### Moderation Commands

- `/warn <user> [reason]` - Warn a user (3 warns = automatic ban)
- `/warnings [user]` - Check warnings for a user
- `/clearwarns <user>` - Clear all warnings for a user
- `/kick <user> [reason]` - Kick a user from the server
- `/ban <user> [reason]` - Ban a user from the server
- `/unban <user_id>` - Unban a user by their ID

### Verification Commands

- `/verifypanel` - Setup the verification panel (creates roles and channel)
- `/manverify <user>` - Manually verify a user (bypasses IP check)

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Fill in your `.env` file:
```env
DISCORD_TOKEN=your_discord_bot_token
MONGODB_URL=mongodb://localhost:27017
WEBSITE_URL=https://bot.icyfrvst.com
API_SECRET_KEY=your_secret_key
```

4. Run the bot:
```bash
python main.py
```

## How Verification Works

1. Admin runs `/verifypanel` which:
   - Creates "Verified" and "Unverified" roles
   - Creates a verification channel
   - Sets up permissions
   - Sends verification embed with button

2. When a user joins:
   - They automatically get the "Unverified" role
   - They can only see the verification channel

3. User clicks verification button:
   - Redirects to website
   - Website collects IP, browser info
   - Checks for existing accounts with same IP
   - If alt detected: verification denied
   - If clean: user gets verified role

4. Admin can use `/manverify` to manually verify users

## Moderation System

- **Warn System**: Each warn is stored per-server in MongoDB
- **3 Warns = Ban**: Automatic ban when user reaches 3 warnings
- **Separate Data**: Each server's data is completely separate

## Directory Structure

```
Bot/
├── main.py              # Main bot file
├── config.py            # Configuration settings
├── requirements.txt     # Python dependencies
├── .env.example        # Environment variables template
└── cogs/               # Bot cogs
    ├── moderation.py   # Moderation commands
    └── verification.py # Verification commands
```

## MongoDB Schema

### Guilds Collection
```json
{
  "guild_id": "123456789",
  "warns": {
    "user_id": [
      {
        "reason": "Spam",
        "moderator_id": "987654321",
        "timestamp": "2024-01-01T00:00:00"
      }
    ]
  },
  "verification": {
    "enabled": true,
    "verified_role_id": "123456789",
    "unverified_role_id": "987654321",
    "verify_channel_id": "456789123"
  }
}
```

### Verifications Collection
```json
{
  "user_id": "123456789",
  "guild_id": "987654321",
  "username": "User",
  "discriminator": "1234",
  "client_info": {
    "ip": "192.168.1.1",
    "userAgent": "...",
    "browser": {...}
  },
  "verified_at": "2024-01-01T00:00:00",
  "manual": false
}
```
