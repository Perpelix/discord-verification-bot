const express = require('express');
const router = express.Router();
const { getDatabase } = require('../../lib/mongodb');
const { comparePassword, generateToken } = require('../../lib/utils');

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const db = await getDatabase();
    const admin = await db.collection('admins').findOne({ username });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await comparePassword(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      id: admin._id.toString(),
      username: admin.username
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        username: admin.username,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
