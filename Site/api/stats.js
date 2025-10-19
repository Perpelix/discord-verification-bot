const { getDatabase } = require('../lib/mongodb');
const { authenticateRequest } = require('../lib/utils');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authenticate admin
  const admin = authenticateRequest(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const db = await getDatabase();

    const [
      totalGuilds,
      totalVerifications,
      totalAltAccounts,
      totalUsers,
      recentVerifications
    ] = await Promise.all([
      db.collection('guilds').countDocuments(),
      db.collection('verifications').countDocuments(),
      db.collection('alt_accounts').countDocuments(),
      db.collection('users').countDocuments(),
      db.collection('verifications').find({})
        .sort({ verified_at: -1 })
        .limit(10)
        .toArray()
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total_guilds: totalGuilds,
        total_verifications: totalVerifications,
        alt_accounts_detected: totalAltAccounts,
        total_users: totalUsers
      },
      recent_verifications: recentVerifications
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
