export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const COMLINK_URL = process.env.COMLINK_URL || 'https://comlink.kaiwu.dev';
  const GUILD_ID    = process.env.GUILD_ID;

  if (!GUILD_ID) {
    return res.status(500).json({ error: 'GUILD_ID not configured in environment variables' });
  }

  try {
    const response = await fetch(`${COMLINK_URL}/guild`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payload: {
          guildId: GUILD_ID,
          includeRecentGuildActivityInfo: true,
        },
        enums: false,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: `Comlink error ${response.status}: ${text}` });
    }

    const data = await response.json();
    const guild   = data?.guild   || data;
    const profile = guild?.profile || {};
    const members = guild?.member  || [];

    const memberList = members.map(m => {
      const tickets = m.memberContribution?.find(c => c.type === 2)?.currentValue ?? 0;
      return {
        name:          m.playerName || 'Unknown',
        allyCode:      m.allyCode   || 0,
        role:          formatRole(m.memberLevel),
        galacticPower: m.galacticPower || 0,
        gp:            ((m.galacticPower || 0) / 1_000_000).toFixed(1) + 'M',
        tickets:       Math.min(tickets, 600),
        status:        getStatus(tickets, m.lastActivityTime),
      };
    }).sort((a, b) => b.galacticPower - a.galacticPower);

    const totalGP      = memberList.reduce((s, m) => s + m.galacticPower, 0);
    const totalTickets = memberList.reduce((s, m) => s + m.tickets, 0);
    const targetTickets = 600 * memberList.length;

    return res.status(200).json({
      guild: {
        name:           profile.name || 'ReneGatos',
        memberCount:    memberList.length,
        totalGP,
        totalGPDisplay: (totalGP / 1_000_000).toFixed(0) + 'M',
        avgGP:          memberList.length ? (totalGP / memberList.length / 1_000_000).toFixed(1) + 'M' : '0M',
        totalTickets,
        targetTickets,
        ticketsPct:     targetTickets > 0 ? Math.round((totalTickets / targetTickets) * 100) : 0,
      },
      members: memberList,
      lastUpdated: new Date().toISOString(),
    });

  } catch (err) {
    return res.status(500).json({ error: `fetch failed: ${err.message}` });
  }
}

function formatRole(level) {
  return { 1: 'Member', 2: 'Member', 3: 'Officer', 4: 'Leader' }[level] || 'Member';
}

function getStatus(tickets, lastActivity) {
  const days = lastActivity ? (Date.now() - lastActivity * 1000) / 86400000 : 999;
  if (days > 7 || tickets === 0) return 'inactive';
  if (tickets < 300) return 'danger';
  if (tickets < 500) return 'warning';
  return 'active';
}
