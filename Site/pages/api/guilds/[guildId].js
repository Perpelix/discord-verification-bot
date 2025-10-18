import { getDatabase } from '../../../lib/mongodb';
import { authenticateRequest } from '../../../lib/utils';

export default async function handler(req, res) {
  const { guildId } = req.query;

  // Authenticate admin
  const admin = authenticateRequest(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const db = await getDatabase();

  if (req.method === 'GET') {
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

  } else if (req.method === 'PUT') {
    try {
      const updates = req.body;

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

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
