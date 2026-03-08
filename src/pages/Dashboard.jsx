import { useState, useEffect } from 'react'
import { C } from '../theme.js'
import { Panel, PanelHeader } from '../components/ui/Panel.jsx'
import { Dot, Bar } from '../components/ui/index.jsx'
import StatCard from '../components/StatCard.jsx'
import MembersTable from '../components/MembersTable.jsx'

function TicketChart({ history = [] }) {
  const days = ['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM']
  // Si no hay historial usamos placeholder
  const vals = history.length ? history : [92, 87, 95, 78, 96, 88, 61]

  return (
    <Panel accent={C.gold}>
      <PanelHeader color={C.gold}>RAID TICKETS — 7 DÍAS</PanelHeader>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 90 }}>
          {vals.map((v, i) => {
            const col = v >= 90 ? C.green : v >= 70 ? C.gold : C.red
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div style={{ fontSize: 9, color: C.textSecondary, fontFamily: 'monospace' }}>{v}%</div>
                <div style={{
                  width: '100%', height: `${(v / 100) * 65}px`,
                  background: `linear-gradient(0deg, ${col}33, ${col}cc)`,
                  borderRadius: '3px 3px 0 0',
                  boxShadow: `0 -4px 12px ${col}33`,
                  border: `1px solid ${col}44`, borderBottom: 'none',
                }} />
                <span style={{ color: C.textSecondary, fontSize: 8, fontFamily: "'Orbitron', monospace" }}>
                  {days[i % 7]}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Panel>
  )
}

function TWWidget({ tw }) {
  const zones = tw?.zones || []
  const record = tw?.record || { wins: 0, losses: 0, winRate: 0 }
  const zc = { cleared: C.green, active: C.gold, locked: C.textSecondary }

  return (
    <Panel accent={C.blue}>
      <PanelHeader color={C.blue}>⚔ TERRITORY WAR</PanelHeader>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[[record.wins, 'WINS', C.green], [record.losses, 'LOSSES', C.red], [`${record.winRate}%`, 'WIN RATE', C.gold]].map(([v, l, col]) => (
            <div key={l} style={{ flex: 1, background: `${col}0e`, border: `1px solid ${col}25`, borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ color: col, fontFamily: "'Orbitron', monospace", fontSize: 20, fontWeight: 700 }}>{v}</div>
              <div style={{ color: C.textSecondary, fontSize: 9, letterSpacing: '0.1em', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
        {zones.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {zones.slice(0, 4).map((z, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', borderRadius: 6,
                background: `linear-gradient(90deg, ${zc[z.status] || C.textSecondary}08, transparent)`,
                border: `1px solid ${zc[z.status] || C.textSecondary}18`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Dot status={z.status === 'cleared' ? 'active' : z.status === 'active' ? 'warning' : 'inactive'} />
                  <span style={{ color: C.textPrimary, fontSize: 12 }}>{z.name}</span>
                </div>
                {z.score > 0 && <span style={{ color: zc[z.status] || C.textSecondary, fontFamily: 'monospace', fontSize: 11 }}>{z.score} pts</span>}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: C.textSecondary, fontSize: 12, textAlign: 'center', padding: '12px 0' }}>
            {tw?.active ? 'Cargando zonas...' : 'No hay TW activa'}
          </div>
        )}
      </div>
    </Panel>
  )
}

export default function Dashboard() {
  const [guild, setGuild]     = useState(null)
  const [tw, setTw]           = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [guildRes, twRes] = await Promise.allSettled([
          fetch('/api/guild').then(r => r.json()),
          fetch('/api/tw').then(r => r.json()),
        ])
        if (guildRes.status === 'fulfilled') setGuild(guildRes.value)
        if (twRes.status === 'fulfilled')   setTw(twRes.value)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const g = guild?.guild || {}
  const members = guild?.members || []

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.blue}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ color: C.textSecondary, fontFamily: "'Orbitron', monospace", fontSize: 12, letterSpacing: '0.1em' }}>
          CONECTANDO CON LA API...
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <Panel style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ color: C.red, fontFamily: "'Orbitron', monospace", fontSize: 13, marginBottom: 8 }}>ERROR DE CONEXIÓN</div>
        <div style={{ color: C.textSecondary, fontSize: 12 }}>{error}</div>
        <div style={{ color: C.textSecondary, fontSize: 11, marginTop: 8 }}>Verifica que las variables de entorno están configuradas en Vercel.</div>
      </Panel>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 20, color: C.gold, letterSpacing: '0.1em' }}>
            GUILD DASHBOARD
          </h1>
          <div style={{ color: C.textSecondary, fontSize: 12, marginTop: 4 }}>
            {g.name || 'ReneGatos'} · {g.memberCount || 0}/50 miembros · {g.totalGPDisplay || '—'} GP
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ background: `${C.green}12`, border: `1px solid ${C.green}25`, borderRadius: 6, padding: '6px 14px', fontSize: 10, color: C.green, fontFamily: "'Orbitron', monospace", display: 'flex', alignItems: 'center', gap: 6 }}>
            <Dot status="active" /> API CONECTADA
          </div>
          {tw?.active && (
            <div style={{ background: `${C.gold}12`, border: `1px solid ${C.gold}25`, borderRadius: 6, padding: '6px 14px', fontSize: 10, color: C.gold, fontFamily: "'Orbitron', monospace" }}>
              ⚔ TW EN CURSO
            </div>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <StatCard label="Total GP"    value={g.totalGPDisplay || '—'} sub="Poder galáctico total"  color={C.gold}   icon="⚡" />
        <StatCard label="TW Record"   value={tw?.record ? `${tw.record.wins}-${tw.record.losses}` : '—'} sub={`${tw?.record?.winRate || 0}% win rate`} color={C.blue} icon="⚔" />
        <StatCard label="Tickets hoy" value={g.totalTickets ? `${(g.totalTickets/1000).toFixed(1)}k` : '—'} sub={`Meta: ${g.targetTickets ? (g.targetTickets/1000).toFixed(0) : 0}k diarios`} color={C.green} icon="🎫" />
        <StatCard label="GP Promedio" value={g.avgGP || '—'} sub="Por miembro" color={C.orange} icon="👤" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <TicketChart />
        <TWWidget tw={tw} />
      </div>

      {/* Tickets total bar */}
      {g.totalTickets && (
        <Panel style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: C.textSecondary, fontSize: 11 }}>Progreso tickets diarios</span>
            <span style={{ color: C.gold, fontFamily: 'monospace', fontSize: 11 }}>
              {g.totalTickets.toLocaleString()} / {g.targetTickets?.toLocaleString()} ({g.ticketsPct}%)
            </span>
          </div>
          <Bar val={g.totalTickets} max={g.targetTickets} color={g.ticketsPct >= 80 ? C.green : g.ticketsPct >= 50 ? C.gold : C.red} />
        </Panel>
      )}

      {/* Roster */}
      <MembersTable members={members} />
    </div>
  )
}
