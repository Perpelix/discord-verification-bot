# Site Conversion Summary

## ✅ Converted from Next.js to Plain HTML/CSS/JS

Your website has been successfully converted from Next.js to plain HTML with Express.js!

### What Changed

**Before (Next.js):**
- React components
- Server-side rendering
- Build process required
- Complex file structure
- npm run build needed

**After (Plain HTML/JS):**
- ✅ Simple HTML files with inline CSS/JS
- ✅ No build process needed
- ✅ Express.js API server
- ✅ Just run and go!
- ✅ Easy to understand and modify

### New Structure

```
Site/
├── server.js                    # Express.js server (main file)
├── package.json                 # Dependencies
├── .env.example                # Environment template
├── create-admin.js             # Admin creation script
│
├── public/                      # HTML files (all CSS/JS inline)
│   ├── index.html              # Home page
│   ├── verify.html             # Verification page
│   ├── dashboard.html          # Admin dashboard
│   └── google.html             # User search
│
├── api/                         # API route handlers
│   ├── verify.js               # POST /api/verify
│   ├── google.js               # POST /api/google
│   ├── stats.js                # GET /api/stats
│   ├── auth/
│   │   └── login.js            # POST /api/auth/login
│   ├── guilds/
│   │   ├── list.js             # GET /api/guilds/list
│   │   └── guildById.js        # GET/PUT /api/guilds/:id
│   └── bot/
│       └── webhook.js          # POST /api/bot/webhook
│
└── lib/                         # Helper functions
    ├── mongodb.js              # Database connection
    └── utils.js                # JWT, bcrypt, etc.
```

### Features

✅ **All-in-One HTML Files**
- Each HTML file contains all its CSS and JavaScript
- No external stylesheet or script files
- Easy to customize - just edit the file!

✅ **Express.js Backend**
- Simple server.js file
- Clean API route separation
- Easy to understand and modify

✅ **Same Functionality**
- All features from Next.js version
- Same API endpoints
- Same database structure
- Same authentication

## Quick Start

### 1. Install Dependencies
```bash
cd Site
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Create Admin Account
```bash
node create-admin.js
```

### 4. Run Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 5. Open Browser
```
http://localhost:3000
```

## All HTML Files Explained

### index.html
- **Purpose**: Home page with features
- **CSS**: Inline in `<style>` tag
- **JS**: None needed (just links)
- **Styling**: Gradient background, animated logo, feature cards

### verify.html
- **Purpose**: Verification page
- **CSS**: Inline in `<style>` tag
- **JS**: Inline in `<script>` tag
- **Features**:
  - Auto-verifies on page load
  - Calls `/api/verify` endpoint
  - Shows success/error messages
  - Close window button

### dashboard.html
- **Purpose**: Admin dashboard
- **CSS**: Inline in `<style>` tag
- **JS**: Inline in `<script>` tag
- **Features**:
  - Login form
  - Statistics cards
  - Guild list
  - JWT authentication
  - LocalStorage for token

### google.html
- **Purpose**: Alt account search
- **CSS**: Inline in `<style>` tag
- **JS**: Inline in `<script>` tag
- **Features**:
  - Login form
  - Search functionality
  - Results display
  - Alt account linking

## API Routes

All API routes are separate `.js` files in the `api/` folder:

| Route | File | Purpose |
|-------|------|---------|
| `POST /api/verify` | `api/verify.js` | User verification |
| `POST /api/google` | `api/google.js` | Search users |
| `GET /api/stats` | `api/stats.js` | Statistics |
| `POST /api/auth/login` | `api/auth/login.js` | Admin login |
| `GET /api/guilds/list` | `api/guilds/list.js` | List guilds |
| `GET /api/guilds/:id` | `api/guilds/guildById.js` | Guild details |
| `PUT /api/guilds/:id` | `api/guilds/guildById.js` | Update guild |
| `POST /api/bot/webhook` | `api/bot/webhook.js` | Bot webhook |

## Dependencies

```json
{
  "express": "Server framework",
  "cors": "Cross-origin requests",
  "mongodb": "Database driver",
  "jsonwebtoken": "JWT authentication",
  "bcryptjs": "Password hashing",
  "ua-parser-js": "Browser detection",
  "dotenv": "Environment variables"
}
```

## Deployment Options

### Option 1: Any VPS (DigitalOcean, Linode, AWS)
```bash
# Upload files
git clone your-repo
cd Site
npm install
cp .env.example .env
# Edit .env
npm start
```

### Option 2: Heroku
```bash
# Add Procfile: web: node server.js
heroku create
git push heroku main
heroku config:set MONGODB_URL=...
```

### Option 3: Railway
1. Connect GitHub repo
2. Set root directory to `Site`
3. Add environment variables
4. Deploy!

### Option 4: PM2 Process Manager
```bash
npm install -g pm2
pm2 start server.js --name verification-site
pm2 save
pm2 startup
```

## Customization Guide

### Change Page Styles

Edit the `<style>` section in any HTML file:

```html
<!-- Example: Change gradient colors -->
<style>
  body {
    background: linear-gradient(135deg, #YOUR_COLOR1, #YOUR_COLOR2);
  }
</style>
```

### Change Page Logic

Edit the `<script>` section in any HTML file:

```html
<script>
  // Your custom JavaScript here
</script>
```

### Add New Pages

1. Create `public/newpage.html`
2. Add route in `server.js`:
```javascript
app.get('/newpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'newpage.html'));
});
```

### Add New API Routes

1. Create `api/newroute.js`:
```javascript
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  // Your logic here
  res.json({ success: true });
});

module.exports = router;
```

2. Add to `server.js`:
```javascript
const newRoute = require('./api/newroute');
app.use('/api/newroute', newRoute);
```

## Advantages of This Structure

✅ **Simple**: No build process, no compilation
✅ **Fast**: Instant changes - just refresh!
✅ **Portable**: Works on any Node.js host
✅ **Maintainable**: Easy to understand code
✅ **Flexible**: Easy to customize
✅ **Lightweight**: Fewer dependencies
✅ **Standard**: Just HTML, CSS, JS, and Express

## Backup

Your original Next.js site is backed up at:
```
Site_NextJS_Backup/
```

You can restore it anytime if needed.

## Environment Variables

Required `.env` variables:
```env
MONGODB_URL=mongodb://localhost:27017
JWT_SECRET=random_secret_key
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_BOT_TOKEN=your_bot_token
API_SECRET_KEY=another_random_secret
PORT=3000
```

## Testing Locally

1. Start MongoDB (if running locally)
2. Run server: `npm run dev`
3. Open: `http://localhost:3000`
4. Test pages:
   - Home: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard
   - Search: http://localhost:3000/google
   - Verify: http://localhost:3000/verify?guild=test&user=test

## Common Issues

**Port already in use:**
```bash
# Change PORT in .env file
PORT=3001
```

**MongoDB connection error:**
```bash
# Check MONGODB_URL in .env
# Make sure MongoDB is running
```

**Admin can't login:**
```bash
# Create admin account first
node create-admin.js
```

## Support

- Full documentation: `Site/README.md`
- Quick reference: `QUICK_REFERENCE.md`
- Setup guide: `SETUP.md`

---

## Summary

✅ Converted from Next.js to plain HTML/CSS/JS
✅ Express.js backend with separate API routes
✅ All features working exactly the same
✅ Easier to understand and customize
✅ No build process required
✅ Deploy anywhere Node.js runs

Enjoy your new simplified website structure! 🎉
