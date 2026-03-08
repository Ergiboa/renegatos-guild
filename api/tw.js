export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const COMLINK_URL = process.env.COMLINK_URL || 'https://comlink.kaiwu.dev';
  const GUILD_ID    = process.env.GUILD_ID;

  if (!GUILD_ID) {
    return res.status(500).json({ error: 'GUILD_ID not configured' });
  }

  try {
    const response = await fetch(`${COMLINK_URL}/guild`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payload: { guildId: GUILD_ID, includeRecentGuildActivityInfo: true },
        enums: false,
      }),
    });

    if (!response.ok) {
      return res.status(500).json({ error: `Comlink error ${response.status}` });
    }

    const data  = await response.json();
    const guild = data?.guild || data;

    // Intentar sacar historial de TW del objeto de gremio
    const twHistory = guild?.recentTerritoryWarResult || [];
    const wins   = twHistory.filter(w => w?.isMine === true).length;
    const losses = twHistory.filter(w => w?.isMine === false).length;

    return res.status(200).json({
      active:  false, // se actualizará cuando tengamos el endpoint correcto del bot
      record:  {
        wins,
        losses,
        winRate: wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0,
      },
      zones:   [],
      history: twHistory.slice(0, 10).map((h, i) => ({
        result:    h?.isMine ? 'win' : 'loss',
        ourScore:  h?.guildScore    || 0,
        theirScore: h?.opponentScore || 0,
      })),
      lastUpdated: new Date().toISOString(),
    });

  } catch (err) {
    return res.status(500).json({ error: `fetch failed: ${err.message}` });
  }
}
