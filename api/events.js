/**
 * GET /api/events
 * Devuelve los eventos activos y próximos del juego.
 */

const COMLINK_URL = process.env.COMLINK_URL || 'https://comlink.kaiwu.dev';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const response = await fetch(`${COMLINK_URL}/getEvents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enums: false }),
    });

    if (!response.ok) throw new Error(`Comlink events error: ${response.status}`);
    const data = await response.json();

    const now    = Date.now();
    const events = (data?.gameEvent || [])
      .map(e => ({
        id:        e.id,
        name:      e.nameKey || e.id,
        type:      classifyEvent(e.id),
        startTime: e.startTime ? e.startTime * 1000 : null,
        endTime:   e.endTime   ? e.endTime   * 1000 : null,
        active:    e.startTime * 1000 <= now && e.endTime * 1000 >= now,
      }))
      .filter(e => e.endTime && e.endTime > now - 86400000) // últimas 24h + futuros
      .sort((a, b) => a.startTime - b.startTime)
      .slice(0, 20);

    return res.status(200).json({ events, lastUpdated: new Date().toISOString() });

  } catch (err) {
    console.error('[/api/events]', err);
    return res.status(500).json({ error: err.message });
  }
}

function classifyEvent(id = '') {
  const u = id.toUpperCase();
  if (u.includes('TW') || u.includes('TERRITORY_WAR'))      return 'tw';
  if (u.includes('TB') || u.includes('TERRITORY_BATTLE'))   return 'tb';
  if (u.includes('RAID'))                                    return 'raid';
  if (u.includes('CONQUEST'))                               return 'conquest';
  if (u.includes('GAC') || u.includes('GRAND_ARENA'))      return 'gac';
  return 'other';
}
