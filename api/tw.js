/**
 * GET /api/tw
 * Devuelve datos de la Territory War activa o la última jugada.
 */

const MANDO_URL  = process.env.MANDO_URL || 'https://mhanndalorianbot.work/api';
const MANDO_ID   = process.env.MANDO_ACCOUNT_ID;
const MANDO_PASS = process.env.MANDO_PASSWORD;
const GUILD_ID   = process.env.GUILD_ID;

async function fetchMando(endpoint, body = {}) {
  const res = await fetch(`${MANDO_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Account-Id': MANDO_ID,
      'X-Account-Password': MANDO_PASS,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Mando error ${res.status}: ${endpoint}`);
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Obtener datos TW del Mandalorian bot
    const twData = await fetchMando('/tw/status', { guildId: GUILD_ID });

    // Historial de TW (últimas guerras)
    let history = [];
    try {
      const histData = await fetchMando('/tw/history', { guildId: GUILD_ID, count: 10 });
      history = (histData?.history || []).map(h => ({
        opponent:   h.opponentName || 'Desconocido',
        result:     h.guildScore > h.opponentScore ? 'win' : 'loss',
        ourScore:   h.guildScore    || 0,
        theirScore: h.opponentScore || 0,
        date:       h.endTime ? new Date(h.endTime * 1000).toLocaleDateString('es-ES') : '',
      }));
    } catch (e) {
      console.warn('TW history unavailable:', e.message);
    }

    const wins   = history.filter(h => h.result === 'win').length;
    const losses = history.filter(h => h.result === 'loss').length;

    return res.status(200).json({
      active:      twData?.active      || false,
      phase:       twData?.phase       || 0,
      ourScore:    twData?.guildScore  || 0,
      theirScore:  twData?.oppScore    || 0,
      opponent:    twData?.oppName     || null,
      zones:       (twData?.zones      || []).map(z => ({
        name:      z.name   || z.id,
        status:    z.status || 'locked',
        score:     z.score  || 0,
      })),
      record: { wins, losses, winRate: wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0 },
      history,
      lastUpdated: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[/api/tw]', err);
    return res.status(500).json({ error: err.message });
  }
}
