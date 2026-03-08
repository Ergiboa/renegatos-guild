/**
 * GET /api/guild
 * Devuelve datos del gremio: miembros, GP, tickets, etc.
 * Usa Mandalorian Bot para datos autenticados (tickets, participación)
 * y Comlink para datos base del gremio.
 */

const COMLINK_URL  = process.env.COMLINK_URL  || 'https://comlink.kaiwu.dev';
const MANDO_URL    = process.env.MANDO_URL    || 'https://mhanndalorianbot.work/api';
const MANDO_ID     = process.env.MANDO_ACCOUNT_ID;
const MANDO_PASS   = process.env.MANDO_PASSWORD;
const GUILD_ID     = process.env.GUILD_ID;

async function fetchComlink(endpoint, body) {
  const res = await fetch(`${COMLINK_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Comlink error ${res.status}: ${endpoint}`);
  return res.json();
}

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

module.exports = async function handler(req, res) {
  // CORS para desarrollo local
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // 1. Datos del gremio desde Comlink
    const guildData = await fetchComlink('/guild', {
      payload: { guildId: GUILD_ID, includeRecentGuildActivityInfo: true },
      enums: false,
    });

    const guild   = guildData?.guild    || guildData;
    const members = guild?.member       || [];
    const profile = guild?.profile      || {};

    // 2. Intentar obtener tickets de Mandalorian Bot (más preciso)
    let ticketData = null;
    try {
      ticketData = await fetchMando('/guild/tickets', { guildId: GUILD_ID });
    } catch (e) {
      console.warn('Mando tickets fallback:', e.message);
    }

    // 3. Construir respuesta normalizada
    const memberList = members.map(m => {
      const playerName = m.playerName || m.name || 'Unknown';
      const allyCode   = m.allyCode   || 0;

      // Tickets: intentar desde Mando, fallback a Comlink
      const memberTickets = ticketData?.members?.find(t => t.allyCode === allyCode);
      const tickets = memberTickets?.tickets ?? m.memberContribution?.find(c => c.type === 2)?.currentValue ?? 0;

      return {
        name:         playerName,
        allyCode:     allyCode,
        role:         formatRole(m.memberLevel),
        galacticPower: m.galacticPower || 0,
        gp:           ((m.galacticPower || 0) / 1_000_000).toFixed(1) + 'M',
        tickets:      Math.min(tickets, 600),
        ticketsPct:   Math.round((Math.min(tickets, 600) / 600) * 100),
        lastActivity: m.lastActivityTime || 0,
        status:       getStatus(tickets, m.lastActivityTime),
      };
    });

    // Ordenar por GP descendente
    memberList.sort((a, b) => b.galacticPower - a.galacticPower);

    const totalGP      = memberList.reduce((s, m) => s + m.galacticPower, 0);
    const totalTickets = memberList.reduce((s, m) => s + m.tickets, 0);
    const targetTickets = 600 * memberList.length;

    return res.status(200).json({
      guild: {
        name:           profile.name        || 'ReneGatos',
        guildId:        GUILD_ID,
        memberCount:    memberList.length,
        totalGP:        totalGP,
        totalGPDisplay: (totalGP / 1_000_000).toFixed(0) + 'M',
        avgGP:          memberList.length ? (totalGP / memberList.length / 1_000_000).toFixed(1) + 'M' : '0M',
        totalTickets,
        targetTickets,
        ticketsPct:     Math.round((totalTickets / targetTickets) * 100),
        bannerLogo:     profile.bannerLogo  || null,
        bannerColor:    profile.bannerColor || null,
      },
      members: memberList,
      lastUpdated: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[/api/guild]', err);
    return res.status(500).json({ error: err.message });
  }
}

function formatRole(level) {
  const roles = { 1: 'Member', 2: 'Member', 3: 'Officer', 4: 'Leader' };
  return roles[level] || 'Member';
}

function getStatus(tickets, lastActivity) {
  const daysSinceActive = lastActivity
    ? (Date.now() - lastActivity * 1000) / (1000 * 60 * 60 * 24)
    : 999;

  if (daysSinceActive > 7)   return 'inactive';
  if (tickets === 0)          return 'inactive';
  if (tickets < 300)          return 'danger';
  if (tickets < 500)          return 'warning';
  return 'active';
}
