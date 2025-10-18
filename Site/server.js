const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Import API routes
const verifyRoute = require('./api/verify');
const googleRoute = require('./api/google');
const statsRoute = require('./api/stats');
const loginRoute = require('./api/auth/login');
const guildsListRoute = require('./api/guilds/list');
const guildByIdRoute = require('./api/guilds/guildById');
const webhookRoute = require('./api/bot/webhook');

// API Routes
app.use('/api/verify', verifyRoute);
app.use('/api/google', googleRoute);
app.use('/api/stats', statsRoute);
app.use('/api/auth/login', loginRoute);
app.use('/api/guilds/list', guildsListRoute);
app.use('/api/guilds', guildByIdRoute);
app.use('/api/bot/webhook', webhookRoute);

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/verify', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'verify.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/google', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'google.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
