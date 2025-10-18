# Verification Bot Website

Next.js website for the Discord verification bot with dashboard and user search.

## Features

- **Verification Page**: Collects user data and checks for alt accounts
- **Dashboard**: View stats and manage all servers
- **User Search**: Search for users and find their alt accounts
- **Admin Authentication**: Secure login system
- **Vercel Optimized**: Designed for Vercel serverless deployment

## API Routes (10 files - under Vercel limit)

1. `/api/verify` - Handle user verification
2. `/api/google` - Search users and alt accounts
3. `/api/auth/login` - Admin login
4. `/api/guilds/[guildId]` - Get/update guild data
5. `/api/guilds/list` - List all guilds
6. `/api/stats` - Get global statistics
7. `/api/bot/webhook` - Bot webhook endpoint

## Pages

- `/` - Home page with features
- `/verify` - Verification page (redirected from Discord)
- `/dashboard` - Admin dashboard
- `/google` - User search page

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
MONGODB_URL=mongodb://localhost:27017
JWT_SECRET=your_jwt_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_BOT_TOKEN=your_discord_bot_token
NEXT_PUBLIC_SITE_URL=https://bot.icyfrvst.com
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Environment Variables in Vercel

Set these in your Vercel project settings:

- `MONGODB_URL` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `DISCORD_CLIENT_ID` - Your Discord application client ID
- `DISCORD_CLIENT_SECRET` - Your Discord application client secret
- `DISCORD_BOT_TOKEN` - Your Discord bot token

## How It Works

### Verification Flow

1. User clicks verification button in Discord
2. Redirected to `/verify?guild=XXX&user=YYY`
3. Website collects:
   - IP address
   - Browser info
   - User agent
   - Device type
4. Checks if IP exists in database for this guild
5. If exists: Deny (alt account detected)
6. If new: Save data and verify user

### Alt Account Detection

- Each verification saves user's IP address
- When new user verifies, checks for existing IPs
- Links accounts with shared IPs
- Stores in `alt_accounts` collection

### Dashboard

- Login with admin credentials
- View global statistics
- See all guilds and their stats
- Manage guilds remotely

### User Search

- Search by username or email
- Returns all matching users
- Shows all alt accounts
- Displays shared IPs
- Shows common servers

## MongoDB Schema

### Users Collection
```json
{
  "user_id": "123456789",
  "username": "User",
  "discriminator": "1234",
  "ips": ["192.168.1.1", "..."],
  "verifications": [
    {
      "guild_id": "987654321",
      "timestamp": "2024-01-01T00:00:00"
    }
  ]
}
```

### Alt Accounts Collection
```json
{
  "main_account": "123456789",
  "alt_account": "987654321",
  "guild_id": "111222333",
  "ip": "192.168.1.1",
  "detected_at": "2024-01-01T00:00:00"
}
```

## API Endpoints

### POST /api/verify
Verify a user
```json
{
  "userId": "123456789",
  "guildId": "987654321",
  "username": "User",
  "discriminator": "1234"
}
```

### POST /api/google
Search for users (requires authentication)
```json
{
  "query": "username or email"
}
```

### POST /api/auth/login
Admin login
```json
{
  "username": "admin",
  "password": "password"
}
```

### GET /api/guilds/list
Get all guilds (requires authentication)

### GET /api/guilds/[guildId]
Get specific guild data (requires authentication)

### POST /api/bot/webhook
Bot webhook (requires secret key)
```json
{
  "action": "verify_user|check_alt|get_user_data",
  "data": {...},
  "secret": "your_secret_key"
}
```

## Security

- JWT authentication for admin endpoints
- Secret key validation for bot webhooks
- Environment variables for sensitive data
- No passwords stored in plain text (bcrypt hashing)

## Directory Structure

```
Site/
├── pages/
│   ├── api/              # API routes (10 files)
│   │   ├── auth/
│   │   │   └── login.js
│   │   ├── bot/
│   │   │   └── webhook.js
│   │   ├── guilds/
│   │   │   ├── [guildId].js
│   │   │   └── list.js
│   │   ├── verify.js
│   │   ├── google.js
│   │   └── stats.js
│   ├── index.js         # Home page
│   ├── verify.js        # Verification page
│   ├── dashboard.js     # Admin dashboard
│   ├── google.js        # User search
│   └── _app.js
├── lib/
│   ├── mongodb.js       # MongoDB connection
│   └── utils.js         # Utility functions
├── styles/
│   └── globals.css
├── package.json
├── vercel.json
└── next.config.js
```
