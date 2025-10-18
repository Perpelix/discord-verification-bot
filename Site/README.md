# Verification Bot Website

Plain HTML/CSS/JS website with Express.js API for the Discord verification bot.

## Structure

```
Site/
├── server.js              # Express.js server
├── package.json           # Dependencies
├── .env.example          # Environment variables template
├── public/               # Static HTML files
│   ├── index.html        # Home page
│   ├── verify.html       # Verification page
│   ├── dashboard.html    # Admin dashboard
│   └── google.html       # User search page
├── api/                  # API route handlers
│   ├── verify.js         # User verification
│   ├── google.js         # User search
│   ├── stats.js          # Statistics
│   ├── auth/
│   │   └── login.js      # Admin login
│   ├── guilds/
│   │   ├── list.js       # List guilds
│   │   └── guildById.js  # Guild details
│   └── bot/
│       └── webhook.js    # Bot webhook
└── lib/                  # Utilities
    ├── mongodb.js        # Database connection
    └── utils.js          # Helper functions
```

## Features

- **Plain HTML/CSS/JS**: No build process needed
- **All-in-One Files**: Each HTML file contains its own CSS and JavaScript
- **Express.js API**: Separate API routes for backend logic
- **MongoDB Integration**: All data stored in MongoDB
- **JWT Authentication**: Secure admin authentication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Edit `.env` with your credentials:
```env
MONGODB_URL=mongodb://localhost:27017
JWT_SECRET=random_secret_here
DISCORD_CLIENT_ID=your_id
DISCORD_CLIENT_SECRET=your_secret
DISCORD_BOT_TOKEN=your_token
API_SECRET_KEY=random_secret
PORT=3000
```

4. Run the server:
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

5. Open in browser:
```
http://localhost:3000
```

## Pages

- `/` - Home page with features
- `/verify` - Verification page (auto-redirected from Discord)
- `/dashboard` - Admin dashboard (requires login)
- `/google` - Alt account search (requires login)

## API Endpoints

**Public:**
- `POST /api/verify` - User verification

**Admin (JWT Required):**
- `POST /api/auth/login` - Admin login
- `GET /api/stats` - Global statistics
- `GET /api/guilds/list` - List all guilds
- `GET /api/guilds/:id` - Guild details
- `PUT /api/guilds/:id` - Update guild
- `POST /api/google` - Search users

**Bot (Secret Key Required):**
- `POST /api/bot/webhook` - Bot webhook

## Deployment

### Deploy to Any Node.js Host

1. **Upload files** to your server
2. **Install dependencies**: `npm install`
3. **Set environment variables**
4. **Start server**: `npm start`

### Use PM2 for Process Management

```bash
npm install -g pm2
pm2 start server.js --name verification-site
pm2 save
pm2 startup
```

### Deploy to Heroku

1. Create `Procfile`:
```
web: node server.js
```

2. Deploy:
```bash
heroku create
git push heroku main
heroku config:set MONGODB_URL=your_url
heroku config:set JWT_SECRET=your_secret
# ... set other env vars
```

### Deploy to Railway

1. Create account at railway.app
2. New project → Deploy from GitHub
3. Add environment variables
4. Deploy!

### Use with Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name bot.icyfrvst.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Create Admin Account

Run this script after setting up MongoDB:

```javascript
// create-admin.js
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function createAdmin() {
  const client = await MongoClient.connect(process.env.MONGODB_URL);
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

Then run:
```bash
node create-admin.js
```

## How It Works

### Verification Flow

1. User clicks verification button in Discord
2. Redirected to `/verify?guild=XXX&user=YYY`
3. HTML page loads and JavaScript auto-executes
4. Calls `POST /api/verify` with user data
5. Server collects IP, checks for alt accounts
6. Returns success or error
7. User sees result and can close window

### Authentication Flow

1. User opens `/dashboard` or `/google`
2. Login form appears if not authenticated
3. Submit username/password to `POST /api/auth/login`
4. Server validates credentials with bcrypt
5. Returns JWT token
6. Token stored in localStorage
7. Token sent with all API requests

### Alt Detection

1. On verification, capture user's IP address
2. Query database for same IP in same guild
3. If found with different user ID → alt detected
4. If not found → save data and verify

## MongoDB Collections

- `guilds` - Server configs, warns, settings
- `verifications` - User verification data with IPs
- `users` - Global user data
- `alt_accounts` - Detected alt relationships
- `admins` - Dashboard admin accounts

## Security

- ✅ Environment variables for secrets
- ✅ JWT authentication
- ✅ bcrypt password hashing
- ✅ API secret keys
- ✅ CORS enabled
- ✅ Input validation

## Customization

### Change Styles

Edit the `<style>` tags in any HTML file in `public/` folder.

### Change API Logic

Edit the route files in `api/` folder.

### Add New Pages

1. Create new HTML file in `public/`
2. Add route in `server.js`:
```javascript
app.get('/newpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'newpage.html'));
});
```

### Add New API Endpoints

1. Create new file in `api/`
2. Import in `server.js`
3. Add route:
```javascript
const newRoute = require('./api/newroute');
app.use('/api/newroute', newRoute);
```

## Troubleshooting

**Server won't start:**
- Check MongoDB connection
- Verify .env file exists
- Check port not in use

**API errors:**
- Check MongoDB is running
- Verify environment variables
- Check console logs

**Login not working:**
- Create admin account first
- Check JWT_SECRET is set
- Verify password is correct

## Production Tips

- Use PM2 for process management
- Set up Nginx reverse proxy
- Enable HTTPS with Let's Encrypt
- Regular MongoDB backups
- Monitor server logs
- Set NODE_ENV=production

---

For full project documentation, see the root README.md
