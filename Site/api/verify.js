const { getDatabase } = require('../lib/mongodb');
const { getClientInfo } = require('../lib/utils');

// VPN/Proxy detection function
async function detectVPNProxy(ip) {
  try {
    // Use multiple free VPN detection APIs
    const checks = [];

    // 1. Check with IP-API (free, no key required)
    try {
      const ipApiResponse = await fetch(`http://ip-api.com/json/${ip}?fields=proxy,hosting`);
      const ipApiData = await ipApiResponse.json();
      if (ipApiData.proxy || ipApiData.hosting) {
        checks.push({ service: 'ip-api', detected: true, reason: ipApiData.proxy ? 'proxy' : 'hosting' });
      }
    } catch (e) {
      console.error('IP-API check failed:', e);
    }

    // 2. Check with IPHub (optional - requires API key)
    if (process.env.IPHUB_API_KEY) {
      try {
        const iphubResponse = await fetch(`http://v2.api.iphub.info/ip/${ip}`, {
          headers: { 'X-Key': process.env.IPHUB_API_KEY }
        });
        const iphubData = await iphubResponse.json();
        // block: 0 = residential/business, 1 = non-residential, 2 = non-residential & residential
        if (iphubData.block >= 1) {
          checks.push({ service: 'iphub', detected: true, block: iphubData.block });
        }
      } catch (e) {
        console.error('IPHub check failed:', e);
      }
    }

    // 3. Check for common VPN/proxy ports in client info
    const suspiciousPorts = [1080, 3128, 8080, 8888, 9050]; // Common proxy/VPN ports

    // 4. Check if IP is from a known datacenter/cloud provider
    const cloudProviderPatterns = [
      /amazon/i, /google/i, /microsoft/i, /digitalocean/i,
      /ovh/i, /hetzner/i, /linode/i, /vultr/i
    ];

    return {
      isVPN: checks.some(c => c.detected),
      checks: checks,
      confidence: checks.length > 0 ? (checks.filter(c => c.detected).length / checks.length) * 100 : 0
    };
  } catch (error) {
    console.error('VPN detection error:', error);
    return { isVPN: false, checks: [], confidence: 0, error: error.message };
  }
}

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

    // VPN/Proxy Detection
    const vpnCheck = await detectVPNProxy(clientInfo.ip);

    // Block if VPN/Proxy detected
    if (vpnCheck.isVPN && vpnCheck.confidence > 50) {
      return res.status(403).json({
        error: 'VPN or Proxy detected',
        message: 'Please disable your VPN or proxy and try again.',
        vpnDetected: true,
        details: vpnCheck
      });
    }

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

    // Save verification data with VPN check results
    await db.collection('verifications').insertOne({
      user_id: userId,
      guild_id: guildId,
      username,
      discriminator,
      client_info: {
        ...clientInfo,
        vpn_check: vpnCheck
      },
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
