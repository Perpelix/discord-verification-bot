# Deployment Checklist

Use this checklist to deploy your Discord verification bot system.

## Pre-Deployment Setup

### MongoDB Setup
- [ ] Create MongoDB Atlas account OR install MongoDB locally
- [ ] Create database named `verification_bot`
- [ ] Get MongoDB connection string
- [ ] Test connection string
- [ ] Create indexes (optional but recommended):
  ```javascript
  db.verifications.createIndex({ "guild_id": 1, "user_id": 1 })
  db.verifications.createIndex({ "guild_id": 1, "client_info.ip": 1 })
  db.users.createIndex({ "user_id": 1 })
  db.guilds.createIndex({ "guild_id": 1 })
  ```

### Discord Bot Setup
- [ ] Go to https://discord.com/developers/applications
- [ ] Create new application
- [ ] Go to Bot tab
- [ ] Click "Add Bot"
- [ ] Copy bot token (save securely)
- [ ] Enable these intents:
  - [ ] Presence Intent
  - [ ] Server Members Intent
  - [ ] Message Content Intent
- [ ] Go to OAuth2 → URL Generator
- [ ] Select scopes: `bot`, `applications.commands`
- [ ] Select permissions:
  - [ ] Manage Roles
  - [ ] Manage Channels
  - [ ] Kick Members
  - [ ] Ban Members
  - [ ] Send Messages
  - [ ] Embed Links
  - [ ] Manage Messages
  - [ ] Read Message History
- [ ] Copy OAuth2 URL (for inviting bot)

## Bot Deployment

### Local/VPS Setup
- [ ] Install Python 3.8+ on server
- [ ] Clone/upload code to server
- [ ] Navigate to Bot directory: `cd Bot`
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Create `.env` file: `cp .env.example .env`
- [ ] Fill in `.env` file:
  ```env
  DISCORD_TOKEN=your_bot_token_here
  MONGODB_URL=mongodb+srv://...
  WEBSITE_URL=https://bot.icyfrvst.com
  API_SECRET_KEY=random_secret_key_here
  ```
- [ ] Test run: `python main.py`
- [ ] Verify bot connects (check console output)
- [ ] Stop test run (Ctrl+C)

### Production Bot Setup (PM2)
- [ ] Install PM2: `npm install -g pm2`
- [ ] Start bot: `pm2 start main.py --name verification-bot --interpreter python3`
- [ ] Check status: `pm2 status`
- [ ] View logs: `pm2 logs verification-bot`
- [ ] Save PM2 config: `pm2 save`
- [ ] Setup auto-start: `pm2 startup`
- [ ] Test restart: `pm2 restart verification-bot`

### Invite Bot to Server
- [ ] Open OAuth2 URL from Discord setup
- [ ] Select your test server
- [ ] Authorize bot
- [ ] Verify bot appears in server
- [ ] Check bot has proper permissions

### Test Bot Commands
- [ ] Run `/verifypanel` in test server
- [ ] Verify roles are created (Verified, Unverified)
- [ ] Verify channel is created (#verify)
- [ ] Verify embed appears with button
- [ ] Test `/warn` command
- [ ] Test `/warnings` command
- [ ] Test other moderation commands

## Website Deployment

### Vercel Preparation
- [ ] Create GitHub account (if needed)
- [ ] Install Git on local machine
- [ ] Initialize Git repo:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  ```
- [ ] Create new GitHub repository
- [ ] Push to GitHub:
  ```bash
  git remote add origin <your-github-url>
  git push -u origin main
  ```

### Vercel Setup
- [ ] Go to https://vercel.com
- [ ] Sign up/login with GitHub
- [ ] Click "Import Project"
- [ ] Select your GitHub repository
- [ ] Configure project:
  - [ ] Framework Preset: Next.js
  - [ ] Root Directory: `Site`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `.next`
- [ ] Add environment variables in Vercel:
  - [ ] `MONGODB_URL` - Your MongoDB connection string
  - [ ] `JWT_SECRET` - Random secret for JWT
  - [ ] `DISCORD_CLIENT_ID` - Discord app client ID
  - [ ] `DISCORD_CLIENT_SECRET` - Discord app client secret
  - [ ] `DISCORD_BOT_TOKEN` - Your bot token
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Copy deployment URL

### Update Bot Configuration
- [ ] Stop bot (if running)
- [ ] Update Bot/.env file:
  ```env
  WEBSITE_URL=https://your-vercel-url.vercel.app
  ```
- [ ] Restart bot: `pm2 restart verification-bot` (or `python main.py`)

### Create Admin Account
Option 1: Local machine
- [ ] Navigate to Site directory
- [ ] Install dependencies: `npm install`
- [ ] Run script: `node scripts/create-admin.js`
- [ ] Enter MongoDB URL when prompted
- [ ] Enter admin username
- [ ] Enter admin password
- [ ] Verify success message

Option 2: MongoDB directly
- [ ] Connect to MongoDB
- [ ] Hash your password using bcrypt
- [ ] Insert admin document:
  ```javascript
  db.admins.insertOne({
    username: "admin",
    password: "$2a$10$hashed_password_here",
    role: "admin",
    created_at: new Date()
  })
  ```

### Test Website
- [ ] Visit your Vercel URL
- [ ] Home page loads correctly
- [ ] Click "Open Dashboard"
- [ ] Login with admin credentials
- [ ] Dashboard loads with stats
- [ ] Navigate to other pages
- [ ] All pages load without errors

## Complete Verification Flow Test

### Setup Test
- [ ] Join your test Discord server
- [ ] Bot should automatically give you Unverified role
- [ ] Verify you can only see #verify channel
- [ ] Verification embed is visible with button

### Verification Test
- [ ] Click "Verify Here" button
- [ ] Redirected to website
- [ ] Website shows "Verifying..." then success
- [ ] Return to Discord
- [ ] Wait a few seconds
- [ ] Check if you have Verified role
- [ ] Check if you can see all channels
- [ ] Unverified role should be removed

### Alt Account Test
- [ ] Create new Discord account (or use another)
- [ ] Join test server with alt account
- [ ] Try to verify alt account
- [ ] Should see "Alt account detected" error
- [ ] Alt should not get verified role
- [ ] Check database for alt_accounts entry

### Manual Verification Test
- [ ] As admin, run `/manverify @user`
- [ ] Verify user gets verified role immediately
- [ ] Check database for manual verification entry

### Moderation Test
- [ ] Run `/warn @user Test warn 1`
- [ ] Verify embed shows warn
- [ ] Run `/warnings @user`
- [ ] Verify warn shows in list
- [ ] Warn user 2 more times
- [ ] Verify user is automatically banned
- [ ] Run `/unban <user_id>` to unban
- [ ] Invite user back and test `/clearwarns`

### Dashboard Test
- [ ] Login to dashboard
- [ ] Verify statistics are correct
- [ ] Check guild list
- [ ] Verify stats match your server
- [ ] Go to `/google` page
- [ ] Search for a username
- [ ] Verify results show correctly

## Production Checklist

### Security
- [ ] All `.env` files are not in Git
- [ ] Strong admin password set
- [ ] JWT_SECRET is random and secure
- [ ] API_SECRET_KEY is random and secure
- [ ] MongoDB has authentication enabled
- [ ] MongoDB has IP whitelist configured

### Performance
- [ ] Database indexes created
- [ ] Bot is running with PM2 or similar
- [ ] Vercel deployment successful
- [ ] Website loads quickly
- [ ] No console errors

### Monitoring
- [ ] Set up UptimeRobot for website monitoring
- [ ] Configure PM2 monitoring for bot
- [ ] MongoDB Atlas monitoring enabled
- [ ] Error logging configured

### Backup
- [ ] MongoDB automatic backups enabled
- [ ] Code backed up to GitHub
- [ ] Environment variables documented securely
- [ ] Backup admin credentials stored safely

### Documentation
- [ ] Team knows how to access dashboard
- [ ] Bot commands documented for moderators
- [ ] Emergency contacts documented
- [ ] Recovery procedures documented

## Optional Enhancements

### Custom Domain
- [ ] Purchase domain name
- [ ] Add domain to Vercel project
- [ ] Configure DNS records
- [ ] Update WEBSITE_URL in bot config
- [ ] Test with custom domain

### Additional Security
- [ ] Enable 2FA on Discord developer account
- [ ] Enable 2FA on MongoDB Atlas
- [ ] Enable 2FA on Vercel
- [ ] Enable 2FA on GitHub
- [ ] Regular security audits

### Scaling Preparation
- [ ] Monitor Vercel usage limits
- [ ] Monitor MongoDB storage usage
- [ ] Plan for multiple bot instances (if needed)
- [ ] Consider CDN for static assets

## Post-Deployment

### First Week
- [ ] Monitor bot logs daily
- [ ] Check for errors
- [ ] Verify verifications working
- [ ] Check alt detection accuracy
- [ ] Monitor database size
- [ ] Review Vercel analytics

### Ongoing Maintenance
- [ ] Weekly backup checks
- [ ] Monthly dependency updates
- [ ] Review security logs
- [ ] Monitor server resources
- [ ] Check for Discord.py updates
- [ ] Review false positive alt detections

## Rollback Plan

If something goes wrong:

1. **Bot Issues**
   - [ ] Stop bot: `pm2 stop verification-bot`
   - [ ] Check logs: `pm2 logs verification-bot`
   - [ ] Revert to previous code version
   - [ ] Restore .env file from backup
   - [ ] Restart: `pm2 restart verification-bot`

2. **Website Issues**
   - [ ] Go to Vercel dashboard
   - [ ] Find previous deployment
   - [ ] Click "Promote to Production"
   - [ ] Or redeploy from working Git commit

3. **Database Issues**
   - [ ] Restore from MongoDB backup
   - [ ] Check connection strings
   - [ ] Verify network access

## Success Criteria

Your deployment is successful when:

- [x] Bot is online and responding to commands
- [x] Verification flow works end-to-end
- [x] Alt account detection is working
- [x] Dashboard is accessible and shows data
- [x] User search returns results
- [x] Moderation commands work correctly
- [x] No errors in logs
- [x] Website loads quickly
- [x] Admin can manage guilds
- [x] Data is being stored correctly in MongoDB

## Support Resources

- Discord.py Docs: https://discordpy.readthedocs.io/
- Next.js Docs: https://nextjs.org/docs
- MongoDB Docs: https://docs.mongodb.com/
- Vercel Docs: https://vercel.com/docs
- PM2 Docs: https://pm2.keymetrics.io/docs/

---

## Notes

- Keep this checklist updated as you deploy
- Document any issues and solutions
- Share with team members who need access
- Update with any custom modifications

Good luck with your deployment! 🚀
