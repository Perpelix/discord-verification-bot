# Verification Bot Website - Dark Theme Professional Edition

Plain HTML/CSS/JS website with Express.js API - Now with professional dark theme and Font Awesome icons!

## 🎨 New Features

- ✅ **Full Dark Theme** - Professional black (#0a0a0a) background
- ✅ **Font Awesome Icons** - Modern icon set instead of emojis
- ✅ **Root Index** - bot.icyfrvst.com directly opens homepage
- ✅ **Secure Environment** - All credentials via environment variables
- ✅ **Professional Design** - Gradient accents, smooth animations

## 📦 Structure

```
Site/
├── server.js              # Express.js server
├── index.html             # Home page (ROOT - served at /)
├── package.json           # Dependencies
├── create-admin.js        # Admin creation script
├── .env.example          # Environment template
├── public/               # Other HTML pages
│   ├── verify.html       # Verification page
│   ├── dashboard.html    # Admin dashboard
│   └── google.html       # User search
├── api/                  # 7 API routes
└── lib/                  # MongoDB & utilities
```

## 🚀 Quick Start

1. **Install**:
```bash
cd Site
npm install
```

2. **Configure**:
```bash
cp .env.example .env
# Edit .env with your values
```

3. **Create Admin**:
```bash
node create-admin.js
```

4. **Run**:
```bash
npm start
```

5. **Open**: http://localhost:3000

## 🌐 Pages

- `/` - Home page (dark theme, Font Awesome icons)
- `/verify` - Verification page
- `/dashboard` - Admin dashboard
- `/google` - Alt account search

All pages feature:
- Professional dark theme (#0a0a0a background)
- Font Awesome 6.4.0 icons
- Smooth animations and transitions
- Gradient purple/blue accents (#667eea → #764ba2)

## 🔐 Environment Variables (Vercel)

Set these in **Vercel Dashboard → Settings → Environment Variables**:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret for JWT tokens | Random 32+ char string |
| `DISCORD_CLIENT_ID` | Discord app client ID | From Discord Developer Portal |
| `DISCORD_CLIENT_SECRET` | Discord app secret | From Discord Developer Portal |
| `DISCORD_BOT_TOKEN` | Bot token | From Discord Developer Portal |
| `API_SECRET_KEY` | Bot-to-site secret | Random 32+ char string |

**IMPORTANT**: Never commit actual values to Git! Always use environment variables.

## 📡 API Endpoints

**Public**:
- `POST /api/verify` - User verification

**Admin (JWT Required)**:
- `POST /api/auth/login` - Login
- `GET /api/stats` - Statistics
- `GET /api/guilds/list` - All guilds
- `GET /api/guilds/:id` - Guild details
- `POST /api/google` - Search users

**Bot (Secret Key Required)**:
- `POST /api/bot/webhook` - Bot webhook

## 🎨 Design System

### Colors
- **Background**: `#0a0a0a` (Pure black)
- **Cards**: `#1a1a1a` (Dark gray)
- **Borders**: `#2a2a2a` (Lighter gray)
- **Text**: `#e0e0e0` (Light gray)
- **Accent**: Linear gradient `#667eea` → `#764ba2`
- **Success**: `#10b981`
- **Error**: `#ef4444`

### Typography
- **Font**: Inter, system fonts
- **Headings**: 700 weight
- **Body**: 400 weight
- **Icons**: Font Awesome 6.4.0

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Dark theme update"
git push
```

2. **Deploy on Vercel**:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Root Directory: `Site`
   - Framework: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

3. **Add Environment Variables**:
   - Go to Settings → Environment Variables
   - Add all variables from `.env.example`
   - Click "Save"

4. **Deploy**!

### Other Hosts

Works on any Node.js host:
```bash
npm install
npm start
```

## 📱 Responsive Design

All pages are fully responsive:
- Desktop: Full layout with sidebar
- Tablet: Adjusted grid
- Mobile: Single column, touch-friendly

## 🔧 Customization

### Change Colors

Edit the CSS in any HTML file:
```css
/* Background */
body {
    background: #0a0a0a; /* Change this */
}

/* Accent gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Change Icons

Replace Font Awesome classes:
```html
<i class="fas fa-shield-alt"></i>
<!-- Change to any FA icon -->
```

### Add Pages

1. Create `public/newpage.html`
2. Add route in `server.js`:
```javascript
app.get('/newpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'newpage.html'));
});
```

## 🔒 Security

- ✅ All credentials in environment variables
- ✅ JWT authentication
- ✅ bcrypt password hashing
- ✅ CORS enabled
- ✅ Input validation
- ✅ No secrets in code

## 📊 Features

- Dark professional theme
- Font Awesome icons
- Smooth animations
- Gradient accents
- Responsive design
- Fast loading
- No build process
- Easy to customize

## 🆘 Troubleshooting

**Server won't start**:
- Check MongoDB connection
- Verify `.env` file exists
- Check port 3000 is free

**Dark theme not showing**:
- Clear browser cache
- Hard refresh (Ctrl+F5)
- Check CSS loaded

**Icons not showing**:
- Check Font Awesome CDN
- Check internet connection
- Verify link in `<head>`

## 📝 Notes

- **Root serves index.html**: `bot.icyfrvst.com` → `index.html`
- **All CSS/JS inline**: Each HTML file is self-contained
- **Font Awesome CDN**: Loaded from cloudflare
- **Environment variables**: Never commit `.env` file

---

For full documentation, see root `README.md`
