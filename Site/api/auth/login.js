const { generateToken } = require('../../lib/utils');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Check against environment variables
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;

    if (!adminUser || !adminPass) {
      return res.status(500).json({ error: 'Admin credentials not configured' });
    }

    // Direct comparison (no bcrypt needed for env vars)
    if (username !== adminUser || password !== adminPass) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      id: 'admin-env',
      username: adminUser
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        username: adminUser,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
