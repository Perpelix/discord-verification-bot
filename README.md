# Discord Verification Bot with Alt Account Detection

A comprehensive Discord bot and website system featuring IP-based verification, alt account detection, and powerful moderation tools.

## 📋 Overview

This project consists of two main components:

1. **Discord Bot** (Python) - Handles server verification, moderation, and Discord interactions
2. **Website** (Next.js) - Verification portal, admin dashboard, and user search

## ✨ Key Features

### 🔐 Verification System
- IP-based verification to prevent alt accounts
- Automatic role assignment (Verified/Unverified)
- Beautiful verification UI with instant feedback
- Manual verification override for admins
- Browser fingerprinting and data collection

### ⚠️ Moderation System
- Warning system with automatic ban after 3 warns
- Per-server data storage (completely separate)
- Full moderation suite (kick, ban, unban)
- Warn history tracking
- Moderator attribution for all actions

### 🔍 Alt Account Detection
- Real-time IP matching across guild
- Automatic denial of alt account verifications
- Comprehensive alt account search tool
- Shows shared IPs and common servers
- Detailed linking of related accounts

### 📊 Admin Dashboard
- Global statistics overview
- Guild management interface
- Real-time verification monitoring
- Alt account detection stats
- Secure JWT authentication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB database
- Discord bot token
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo>
cd Leader
```

2. **Setup Discord Bot**
```bash
cd Bot
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
python main.py
```

3. **Setup Website**
```bash
cd Site
npm install
cp .env.example .env.local
# Edit .env.local with your credentials
npm run dev
```

For detailed setup instructions, see [SETUP.md](SETUP.md)

## 📁 Project Structure

```
Leader/
├── Bot/                    # Discord Bot (Python)
│   ├── main.py            # Bot entry point
│   ├── config.py          # Configuration
│   ├── cogs/              # Bot cogs
│   │   ├── moderation.py  # Moderation commands
│   │   └── verification.py # Verification commands
│   └── utils/             # Utility functions
│
├── Site/                  # Website (Next.js)
│   ├── pages/             # Next.js pages
│   │   ├── api/          # API routes (7/11 used)
│   │   ├── index.js      # Home page
│   │   ├── verify.js     # Verification page
│   │   ├── dashboard.js  # Admin dashboard
│   │   └── google.js     # User search
│   ├── lib/              # Utilities
│   └── styles/           # CSS styles
│
└── Documentation files
```

## 🎮 Discord Bot Commands

### Verification Commands
- `/verifypanel` - Setup verification system (Admin only)
- `/manverify @user` - Manually verify a user (Admin only)

### Moderation Commands
- `/warn @user [reason]` - Warn a user
- `/warnings [@user]` - View warnings
- `/clearwarns @user` - Clear all warnings (Admin only)
- `/kick @user [reason]` - Kick a user
- `/ban @user [reason]` - Ban a user
- `/unban <user_id>` - Unban a user

## 🌐 Website Pages

- **`/`** - Home page with features
- **`/verify`** - Verification page (redirected from Discord)
- **`/dashboard`** - Admin dashboard (requires login)
- **`/google`** - Alt account search (requires login)

## 🔌 API Routes (7/11 Vercel Limit)

1. `POST /api/verify` - Handle user verification
2. `POST /api/google` - Search users and alts
3. `POST /api/auth/login` - Admin authentication
4. `GET /api/guilds/[guildId]` - Guild data
5. `GET /api/guilds/list` - List all guilds
6. `GET /api/stats` - Global statistics
7. `POST /api/bot/webhook` - Bot webhook

## 💾 MongoDB Collections

- **guilds** - Server configurations, warns, verification settings
- **verifications** - User verification data with IPs and browser info
- **users** - Global user data with IP history
- **alt_accounts** - Detected alt account relationships
- **admins** - Dashboard admin credentials

## 🔒 Security Features

- JWT authentication for admin endpoints
- bcrypt password hashing
- API secret keys for bot communication
- Environment variable management
- Permission-based access control

## 📚 Documentation

- [SETUP.md](SETUP.md) - Complete setup guide
- [FEATURES.md](FEATURES.md) - Detailed feature documentation
- [Bot/README.md](Bot/README.md) - Bot-specific documentation
- [Site/README.md](Site/README.md) - Website-specific documentation

## 🛠️ Tech Stack

### Discord Bot
- **Language**: Python 3.8+
- **Library**: discord.py 2.3.2
- **Database**: MongoDB with Motor (async)
- **Environment**: python-dotenv

### Website
- **Framework**: Next.js 14
- **Database**: MongoDB
- **Authentication**: JWT with jsonwebtoken
- **Password Hashing**: bcryptjs
- **Deployment**: Vercel (Serverless)

## 📊 How It Works

### Verification Flow
1. Admin runs `/verifypanel` to setup verification
2. New members automatically get "Unverified" role
3. Member clicks verification button in Discord
4. Redirected to website which captures IP and browser info
5. System checks for existing accounts with same IP
6. If alt detected: Verification denied
7. If clean: User gets "Verified" role and full access

### Alt Detection Algorithm
1. Capture user's IP during verification
2. Check database for same IP in same guild
3. If found with different user: Mark as alt and deny
4. If not found: Save data and verify user
5. Track all IPs per user globally (last 10)
6. Enable searching for alts via username/email

### Moderation System
1. Moderator warns user with reason
2. Warn stored with timestamp and moderator info
3. Each warn increments counter
4. At 3 warns: Automatic ban
5. All data per-server, completely isolated

## 🎯 Use Cases

- **Gaming Communities**: Prevent banned users from returning
- **Trading Servers**: Stop scammers with alt accounts
- **Educational Servers**: Prevent ban evasion
- **General Communities**: Maintain server security
- **Any Discord Server**: Comprehensive moderation toolkit

## ⚙️ Configuration

### Bot Configuration (config.py)
- `MAX_WARNS_BEFORE_BAN` - Warns before auto-ban (default: 3)
- `VERIFIED_ROLE_NAME` - Name of verified role
- `UNVERIFIED_ROLE_NAME` - Name of unverified role
- `VERIFY_CHANNEL_NAME` - Name of verify channel
- Embed colors for different message types

### Environment Variables
See `.env.example` files in Bot/ and Site/ directories

## 🚀 Deployment

### Bot Deployment
- Deploy on any VPS (DigitalOcean, Linode, AWS EC2)
- Use PM2 for process management
- Or use managed hosting (Railway, Heroku)

### Website Deployment
1. Push code to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy automatically
5. Custom domain optional

## 🔧 Maintenance

### Creating Admin Accounts
```bash
cd Site
node scripts/create-admin.js
```

### Database Backup
```bash
mongodump --uri="your_mongodb_uri" --out=/backup/path
```

### Monitoring
- Check bot console for errors
- View Vercel logs for website issues
- Monitor MongoDB Atlas for database performance

## ⚠️ Limitations

- **VPN Detection**: VPN users may appear as alts (use manual verification)
- **Shared Networks**: School/work networks may trigger false positives
- **Vercel Limits**: 10 second function timeout on free tier
- **MongoDB Free Tier**: 512MB storage limit

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your needs!

## 📝 License

This project is provided as-is for educational and personal use.

## 🆘 Support

For issues and questions:
1. Check documentation files
2. Review setup guide
3. Check MongoDB connection
4. Verify environment variables
5. Review console/browser logs

## 🎉 Credits

Created as a comprehensive Discord verification and moderation solution.

## 📸 Screenshots

*(Add screenshots of your bot and website here)*

- Verification Panel
- Admin Dashboard
- User Search Results
- Moderation Commands

---

**Note**: Remember to keep your tokens and secrets private! Never commit `.env` files to Git.
