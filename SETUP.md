# Complete Setup Guide

This guide will help you set up both the Discord bot and website.

## Prerequisites

- Node.js 18+ installed
- Python 3.8+ installed
- MongoDB database (local or Atlas)
- Discord bot token
- Vercel account (for website hosting)

## Part 1: Discord Bot Setup

### 1. Create Discord Application

1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Give it a name and create
4. Go to "Bot" tab
5. Click "Add Bot"
6. Enable these intents:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
7. Copy the bot token

### 2. Install Bot Dependencies

```bash
cd Bot
pip install -r requirements.txt
```

### 3. Configure Bot

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env`:
```env
DISCORD_TOKEN=your_bot_token_here
MONGODB_URL=mongodb://localhost:27017
# or for MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/verification_bot
WEBSITE_URL=https://bot.icyfrvst.com
API_SECRET_KEY=create_a_random_secret_key_here
```

### 4. Run the Bot

```bash
python main.py
```

### 5. Invite Bot to Server

1. Go to Discord Developer Portal
2. OAuth2 → URL Generator
3. Select scopes:
   - `bot`
   - `applications.commands`
4. Select permissions:
   - Manage Roles
   - Manage Channels
   - Kick Members
   - Ban Members
   - Send Messages
   - Manage Messages
   - Embed Links
   - Read Message History
5. Copy the URL and open in browser
6. Select your server and authorize

## Part 2: Website Setup

### 1. Install Website Dependencies

```bash
cd Site
npm install
```

### 2. Configure Website

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local`:
```env
MONGODB_URL=mongodb://localhost:27017
# Use the same MongoDB URL as the bot
JWT_SECRET=create_a_random_jwt_secret
DISCORD_CLIENT_ID=your_discord_app_client_id
DISCORD_CLIENT_SECRET=your_discord_app_client_secret
DISCORD_BOT_TOKEN=your_bot_token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Change to https://bot.icyfrvst.com in production
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Part 3: Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Framework Preset: Next.js
5. Root Directory: `Site`
6. Add environment variables:
   - `MONGODB_URL`
   - `JWT_SECRET`
   - `DISCORD_CLIENT_ID`
   - `DISCORD_CLIENT_SECRET`
   - `DISCORD_BOT_TOKEN`
7. Click Deploy

### 3. Update Bot Configuration

After deployment, update your bot's `.env`:
```env
WEBSITE_URL=https://your-vercel-url.vercel.app
```

Restart the bot.

## Part 4: Create Admin Account

You need to manually create an admin account in MongoDB:

```javascript
// Connect to MongoDB
use verification_bot

// Create admin with hashed password
// Use bcrypt to hash your password first
db.admins.insertOne({
  username: "admin",
  password: "$2a$10$hashed_password_here",
  role: "admin",
  created_at: new Date()
})
```

Or use this Node.js script:

```javascript
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

async function createAdmin() {
  const client = await MongoClient.connect('your_mongodb_url');
  const db = client.db('verification_bot');

  const password = await bcrypt.hash('your_password', 10);

  await db.collection('admins').insertOne({
    username: 'admin',
    password: password,
    role: 'admin',
    created_at: new Date()
  });

  console.log('Admin created!');
  await client.close();
}

createAdmin();
```

## Part 5: Testing

### 1. Test Verification System

1. In Discord, use `/verifypanel` command
2. Bot creates verification channel and roles
3. Click the verification button
4. Should redirect to website
5. Website verifies and gives you the role

### 2. Test Moderation

1. Use `/warn @user reason` to warn someone
2. Warn same user 3 times
3. User should be automatically banned

### 3. Test Dashboard

1. Go to your website URL
2. Click "Dashboard"
3. Login with admin credentials
4. View stats and guilds

### 4. Test User Search

1. Go to `/google` page
2. Login if needed
3. Search for a username
4. View alt accounts

## Part 6: Production Checklist

- [ ] MongoDB Atlas set up with proper security
- [ ] Environment variables set in Vercel
- [ ] Bot running on a VPS or cloud service
- [ ] Custom domain configured (optional)
- [ ] Admin account created
- [ ] All API endpoints tested
- [ ] Verification flow tested
- [ ] Alt account detection tested
- [ ] Dashboard accessible and working
- [ ] User search working

## Troubleshooting

### Bot not responding to commands
- Check if bot is online
- Verify intents are enabled
- Make sure commands are synced (check console)

### Verification not working
- Check WEBSITE_URL in bot config
- Verify MongoDB connection
- Check browser console for errors

### Dashboard not loading
- Check MongoDB connection
- Verify JWT_SECRET is set
- Check API endpoint responses

### Alt detection not working
- Verify verification data is being saved
- Check MongoDB `verifications` collection
- Ensure IP address is being captured

## Support

For issues, check:
- Bot console for error messages
- Browser console for frontend errors
- MongoDB logs for database issues
- Vercel logs for deployment issues

## MongoDB Collections

Your database should have these collections:
- `guilds` - Server configurations and warns
- `verifications` - User verification data
- `users` - Global user data
- `alt_accounts` - Detected alt accounts
- `admins` - Admin accounts for dashboard

## Important Notes

- Keep your tokens and secrets private
- Never commit `.env` files to Git
- Use strong passwords for admin accounts
- Regularly backup your MongoDB database
- Monitor API usage on Vercel
- Bot needs to be always running (use PM2 or similar)
