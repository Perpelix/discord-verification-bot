const express = require('express');
const router = express.Router();
const { getDatabase } = require('../../lib/mongodb');
const { authenticateRequest } = require('../../lib/utils');

router.get('/', async (req, res) => {
  // Authenticate admin
  const admin = authenticateRequest(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const db = await getDatabase();
    const guilds = await db.collection('guilds').find({}).toArray();

    // Get stats for each guild
    const guildsWithStats = await Promise.all(guilds.map(async (guild) => {
      const verifications = await db.collection('verifications').countDocuments({ guild_id: guild.guild_id });
      const altAccounts = await db.collection('alt_accounts').countDocuments({ guild_id: guild.guild_id });

      const warns = Object.values(guild.warns || {}).flat();
      const totalWarns = warns.length;

      return {
        guild_id: guild.guild_id,
        verification_enabled: guild.verification?.enabled || false,
        total_verifications: verifications,
        alt_accounts_detected: altAccounts,
        total_warns: totalWarns
      };
    }));

    res.status(200).json({
      success: true,
      guilds: guildsWithStats,
      total: guildsWithStats.length
    });

  } catch (error) {
    console.error('List guilds error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
