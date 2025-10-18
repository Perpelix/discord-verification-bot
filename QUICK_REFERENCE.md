# Quick Reference Guide

## Essential Commands

### Discord Bot Commands

**Setup**
```
/verifypanel - Setup verification system (creates roles, channel, embed)
```

**Moderation**
```
/warn @user <reason> - Warn a user (3 = ban)
/warnings [@user] - Check warnings
/clearwarns @user - Clear all warnings
/kick @user [reason] - Kick member
/ban @user [reason] - Ban member
/unban <user_id> - Unban by ID
```

**Verification**
```
/manverify @user - Manually verify (bypass IP check)
```

## Website URLs

```
/                - Home page
/verify          - Verification page (auto-redirect from Discord)
/dashboard       - Admin dashboard (login required)
/google          - Alt account search (login required)
```

## API Endpoints

**Public**
```
POST /api/verify - User verification
```

**Admin (JWT Required)**
```
POST /api/auth/login - Login
GET  /api/stats - Statistics
GET  /api/guilds/list - All guilds
GET  /api/guilds/:id - Guild details
POST /api/google - Search users
```

**Bot (Secret Key Required)**
```
POST /api/bot/webhook - Bot webhook
```

## Environment Variables

### Bot (.env)
```env
DISCORD_TOKEN=your_bot_token
MONGODB_URL=mongodb://...
WEBSITE_URL=https://bot.icyfrvst.com
API_SECRET_KEY=random_secret
```

### Website (.env.local)
```env
MONGODB_URL=mongodb://...
JWT_SECRET=random_secret
DISCORD_CLIENT_ID=your_id
DISCORD_CLIENT_SECRET=your_secret
DISCORD_BOT_TOKEN=your_token
NEXT_PUBLIC_SITE_URL=https://...
```

## Installation

### Bot
```bash
cd Bot
pip install -r requirements.txt
cp .env.example .env
# Edit .env
python main.py
```

### Website
```bash
cd Site
npm install
cp .env.example .env.local
# Edit .env.local
npm run dev        # Development
npm run build      # Production build
npm start          # Production server
```

## Create Admin Account

```bash
cd Site
node scripts/create-admin.js
```

Follow prompts to create admin credentials.

## MongoDB Collections

```
guilds          - Server configs and warns
verifications   - User verification data + IPs
users           - Global user data
alt_accounts    - Detected alts
admins          - Dashboard admins
```

## Common Issues & Fixes

### Bot not responding
```
✓ Check bot is online (console shows "connected")
✓ Verify DISCORD_TOKEN is correct
✓ Check bot has proper intents enabled
✓ Ensure commands are synced (check console)
```

### Verification not working
```
✓ Check WEBSITE_URL in bot .env
✓ Verify MongoDB connection
✓ Check website is deployed/running
✓ Look at browser console for errors
```

### Dashboard won't login
```
✓ Create admin account first
✓ Check JWT_SECRET in .env.local
✓ Verify MongoDB connection
✓ Check browser console
```

### Alt detection not working
```
✓ Check MongoDB 'verifications' collection exists
✓ Verify IP is being captured (check collection)
✓ Ensure same guild_id format
```

## File Structure Overview

```
Leader/
├── Bot/
│   ├── main.py
│   ├── config.py
│   ├── cogs/
│   │   ├── moderation.py
│   │   └── verification.py
│   └── utils/
│       ├── __init__.py
│       └── database.py
│
├── Site/
│   ├── pages/
│   │   ├── api/ (7 files)
│   │   ├── index.js
│   │   ├── verify.js
│   │   ├── dashboard.js
│   │   └── google.js
│   ├── lib/
│   │   ├── mongodb.js
│   │   └── utils.js
│   └── scripts/
│       └── create-admin.js
│
└── [Documentation files]
```

## Permissions Required

### Bot Permissions
- Manage Roles
- Manage Channels
- Kick Members
- Ban Members
- Send Messages
- Embed Links
- Manage Messages
- Read Message History

### Bot Intents
- Presence Intent
- Server Members Intent
- Message Content Intent

## Database Indexes (Recommended)

```javascript
// MongoDB indexes for performance
db.verifications.createIndex({ "guild_id": 1, "user_id": 1 })
db.verifications.createIndex({ "guild_id": 1, "client_info.ip": 1 })
db.users.createIndex({ "user_id": 1 })
db.guilds.createIndex({ "guild_id": 1 })
```

## Deployment Checklist

**Before Deployment:**
- [ ] MongoDB Atlas set up
- [ ] Discord bot created and token obtained
- [ ] All intents enabled
- [ ] Environment variables prepared
- [ ] Admin account creation planned

**Bot Deployment:**
- [ ] Code on server/VPS
- [ ] Dependencies installed
- [ ] .env file configured
- [ ] Bot running (PM2 or similar)
- [ ] Bot invited to test server
- [ ] Commands working

**Website Deployment:**
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set in Vercel
- [ ] Deployment successful
- [ ] URLs updated in bot config
- [ ] Admin account created
- [ ] Dashboard accessible

**Testing:**
- [ ] Verification flow works
- [ ] Alt detection works
- [ ] Warns and bans work
- [ ] Dashboard loads
- [ ] User search works

## Useful Commands

### Check Bot Status
```bash
# Check if Python process running
ps aux | grep python

# View bot logs
tail -f bot.log
```

### MongoDB Operations
```bash
# Connect to MongoDB
mongo your_connection_string

# View collections
show collections

# Count documents
db.verifications.count()

# Find recent verifications
db.verifications.find().sort({verified_at: -1}).limit(5)
```

### Vercel Commands
```bash
# Login to Vercel
vercel login

# Deploy
vercel deploy

# View logs
vercel logs
```

## Testing Locally

1. Start MongoDB locally or use Atlas
2. Start bot: `python Bot/main.py`
3. Start website: `cd Site && npm run dev`
4. Invite bot to test server
5. Run `/verifypanel`
6. Test verification flow
7. Test moderation commands
8. Access dashboard at localhost:3000

## Production Tips

- Use PM2 for bot process management
- Enable MongoDB Atlas backups
- Set up monitoring (UptimeRobot)
- Use custom domain for website
- Regular database backups
- Monitor Vercel usage limits
- Keep dependencies updated
- Review logs regularly

## Support Resources

- [Discord.py Docs](https://discordpy.readthedocs.io/)
- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Vercel Docs](https://vercel.com/docs)

## Security Best Practices

✓ Never commit .env files
✓ Use strong admin passwords
✓ Rotate tokens periodically
✓ Keep dependencies updated
✓ Use HTTPS for website
✓ Enable MongoDB authentication
✓ Restrict MongoDB IP access
✓ Use environment variables only
✓ Regular security audits

## Customization Tips

**Change Max Warns:**
- Edit `config.py` → `MAX_WARNS_BEFORE_BAN`

**Change Role Names:**
- Edit `config.py` → `VERIFIED_ROLE_NAME`, `UNVERIFIED_ROLE_NAME`

**Change Colors:**
- Edit `config.py` → `EMBED_COLOR_*` values

**Customize Website:**
- Edit `pages/*.js` → `styles` object

**Add Commands:**
- Create new command in appropriate cog
- Use `@app_commands.command()` decorator

## Backup & Recovery

**Backup MongoDB:**
```bash
mongodump --uri="mongodb://..." --out=/backup/
```

**Restore MongoDB:**
```bash
mongorestore --uri="mongodb://..." /backup/
```

**Backup Code:**
```bash
git push origin main
```

## Update Procedure

**Bot Updates:**
```bash
cd Bot
git pull
pip install -r requirements.txt --upgrade
# Restart bot
```

**Website Updates:**
```bash
cd Site
git pull
npm install
# Vercel auto-deploys on push
```

---

For detailed information, see full documentation files in the project root.
