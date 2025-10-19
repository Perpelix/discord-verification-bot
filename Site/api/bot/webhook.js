const { getDatabase } = require('../../lib/mongodb');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, data, secret } = req.body;

    // Verify secret key
    if (secret !== process.env.API_SECRET_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const db = await getDatabase();

    switch (action) {
      case 'verify_user':
        const { userId, guildId } = data;

        const verification = await db.collection('verifications').findOne({
          user_id: userId,
          guild_id: guildId
        });

        if (verification) {
          return res.status(200).json({
            success: true,
            verified: true,
            data: verification
          });
        }

        return res.status(200).json({
          success: true,
          verified: false
        });

      case 'check_alt':
        const { ip, guild } = data;

        const existingUser = await db.collection('verifications').findOne({
          guild_id: guild,
          'client_info.ip': ip
        });

        if (existingUser) {
          return res.status(200).json({
            success: true,
            is_alt: true,
            main_account: existingUser.user_id
          });
        }

        return res.status(200).json({
          success: true,
          is_alt: false
        });

      case 'get_user_data':
        const user = await db.collection('users').findOne({
          user_id: data.userId
        });

        return res.status(200).json({
          success: true,
          user
        });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
