const express = require('express');
const router = express.Router();
const { getDatabase } = require('../../lib/mongodb');
const { authenticateRequest } = require('../../lib/utils');

router.get('/:guildId', async (req, res) => {
  const { guildId } = req.params;

  // Authenticate admin
  const admin = authenticateRequest(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const db = await getDatabase();

  try {
    // Get guild data
    const guild = await db.collection('guilds').findOne({ guild_id: guildId });

    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }

    // Get verification stats
    const verifications = await db.collection('verifications').countDocuments({ guild_id: guildId });
    const altAccounts = await db.collection('alt_accounts').countDocuments({ guild_id: guildId });

    // Get recent warns
    const warns = Object.values(guild.warns || {}).flat();
    const totalWarns = warns.length;

    res.status(200).json({
      success: true,
      guild: {
        ...guild,
        stats: {
          total_verifications: verifications,
          alt_accounts_detected: altAccounts,
          total_warns: totalWarns
        }
      }
    });

  } catch (error) {
    console.error('Get guild error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:guildId', async (req, res) => {
  const { guildId } = req.params;

  // Authenticate admin
  const admin = authenticateRequest(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const updates = req.body;
    const db = await getDatabase();

    await db.collection('guilds').updateOne(
      { guild_id: guildId },
      { $set: updates },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Guild updated successfully'
    });

  } catch (error) {
    console.error('Update guild error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
