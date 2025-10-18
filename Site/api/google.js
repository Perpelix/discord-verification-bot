const express = require('express');
const router = express.Router();
const { getDatabase } = require('../lib/mongodb');
const { authenticateRequest } = require('../lib/utils');

router.post('/', async (req, res) => {
  // Authenticate admin
  const admin = authenticateRequest(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    const db = await getDatabase();

    // Search for users by username or email
    const users = await db.collection('users').find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).toArray();

    // For each user, find alt accounts
    const results = await Promise.all(users.map(async (user) => {
      // Get all verifications for this user
      const verifications = await db.collection('verifications').find({
        user_id: user.user_id
      }).toArray();

      // Get all IPs used by this user
      const ips = [...new Set(verifications.map(v => v.client_info?.ip).filter(Boolean))];

      // Find other users with same IPs
      const altAccounts = await db.collection('verifications').find({
        'client_info.ip': { $in: ips },
        user_id: { $ne: user.user_id }
      }).toArray();

      // Group alt accounts by unique user IDs
      const uniqueAlts = [...new Set(altAccounts.map(a => a.user_id))];

      // Get user details for alts
      const altDetails = await Promise.all(uniqueAlts.map(async (altId) => {
        const altUser = await db.collection('users').findOne({ user_id: altId });
        const sharedIps = await db.collection('verifications').find({
          user_id: altId,
          'client_info.ip': { $in: ips }
        }).toArray();

        return {
          user_id: altId,
          username: altUser?.username || 'Unknown',
          discriminator: altUser?.discriminator || '0000',
          shared_ips: [...new Set(sharedIps.map(s => s.client_info?.ip))],
          servers_in_common: sharedIps.map(s => s.guild_id)
        };
      }));

      return {
        main_account: {
          user_id: user.user_id,
          username: user.username,
          discriminator: user.discriminator,
          ips: ips,
          servers: verifications.map(v => v.guild_id)
        },
        alt_accounts: altDetails,
        total_alts: altDetails.length
      };
    }));

    res.status(200).json({
      success: true,
      query,
      results,
      total_found: results.length
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
