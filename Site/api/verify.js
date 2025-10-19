const { getDatabase } = require('../lib/mongodb');
const { getClientInfo } = require('../lib/utils');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, guildId, username, discriminator } = req.body;

    if (!userId || !guildId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = await getDatabase();
    const clientInfo = getClientInfo(req);

    // Check for existing verifications with same IP
    const existingVerification = await db.collection('verifications').findOne({
      guild_id: guildId,
      'client_info.ip': clientInfo.ip
    });

    if (existingVerification && existingVerification.user_id !== userId) {
      // Alt account detected
      await db.collection('alt_accounts').insertOne({
        main_account: existingVerification.user_id,
        alt_account: userId,
        guild_id: guildId,
        ip: clientInfo.ip,
        detected_at: new Date().toISOString()
      });

      return res.status(403).json({
        error: 'Alt account detected',
        message: 'This IP address is already associated with another account in this server.'
      });
    }

    // Save verification data
    await db.collection('verifications').insertOne({
      user_id: userId,
      guild_id: guildId,
      username,
      discriminator,
      client_info: clientInfo,
      verified_at: new Date().toISOString(),
      manual: false
    });

    // Update user's global data
    await db.collection('users').updateOne(
      { user_id: userId },
      {
        $set: {
          username,
          discriminator,
          last_seen: new Date().toISOString()
        },
        $push: {
          ips: {
            $each: [clientInfo.ip],
            $slice: -10
          },
          verifications: {
            guild_id: guildId,
            timestamp: new Date().toISOString()
          }
        }
      },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Verification successful!'
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
