import { useState } from 'react'
import { C, STATUS_COLORS, ROLE_COLORS } from '../theme.js'
import { Panel, PanelHeader } from './ui/Panel.jsx'
import { Badge, Dot, Bar } from './ui/index.jsx'

export default function MembersTable({ members = [] }) {
  const [sort, setSort] = useState('tickets')

  const sorted = [...members].sort((a, b) => {
    if (sort === 'gp')      return b.galacticPower - a.galacticPower
    if (sort === 'tw')      return b.twScore - a.twScore
    if (sort === 'tickets') return b.tickets - a.tickets
    return 0
  })

  const TH = ({ id, label }) => (
    <th onClick={() => setSort(id)} style={{
      padding: '10px 14px', textAlign: 'left',
      color: sort === id ? C.gold : C.textSecondary,
      fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
      fontFamily: "'Orbitron', monospace", fontWeight: 400,
      borderBottom: `1px solid ${C.border}`, cursor: 'pointer', whiteSpace: 'nowrap',
      background: sort === id ? `${C.gold}06` : 'transparent',
    }}>{label} {sort === id ? '↓' : ''}</th>
  )

  const staticTH = (label) => (
    <th style={{ padding: '10px 14px', textAlign: 'left', color: C.textSecondary, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Orbitron', monospace", fontWeight: 400, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{label}</th>
  )

  if (!members.length) {
    return (
      <Panel>
        <PanelHeader>ROSTER</PanelHeader>
        <div style={{ padding: 40, textAlign: 'center', color: C.textSecondary, fontSize: 13 }}>
          Cargando datos del gremio...
        </div>
      </Panel>
    )
  }

  return (
    <Panel>
      <PanelHeader right={`${members.length} miembros · clic en columna para ordenar`}>
        ROSTER COMPLETO
      </PanelHeader>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 580 }}>
          <thead>
            <tr>
              {staticTH('#')}
              {staticTH('JUGADOR')}
              <TH id="gp"      label="GP" />
              <TH id="tickets" label="TICKETS" />
              {staticTH('ESTADO')}
            </tr>
          </thead>
          <tbody>
            {sorted.map((m, i) => (
              <tr key={m.allyCode || i}
                style={{ borderBottom: `1px solid ${C.border}22`, transition: 'background 0.15s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.background = C.bgHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '11px 14px', color: C.textMuted, fontFamily: 'monospace', fontSize: 11 }}>
                  {String(i + 1).padStart(2, '0')}
                </td>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${ROLE_COLORS[m.role] || C.blue}33, ${ROLE_COLORS[m.role] || C.blue}0a)`,
                      border: `1px solid ${ROLE_COLORS[m.role] || C.blue}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: ROLE_COLORS[m.role] || C.blue,
                      fontFamily: "'Orbitron', monospace", flexShrink: 0,
                    }}>
                      {(m.name || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color: C.textPrimary, fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                      <Badge text={m.role} color={ROLE_COLORS[m.role] || C.textSecondary} />
                    </div>
                  </div>
                </td>
                <td style={{ padding: '11px 14px', color: C.blueBright, fontFamily: 'monospace', fontSize: 12 }}>
                  {m.gp || ((m.galacticPower || 0) / 1_000_000).toFixed(1) + 'M'}
                </td>
                <td style={{ padding: '11px 14px', minWidth: 130 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{
                        color: m.tickets >= 600 ? C.green : m.tickets >= 400 ? C.gold : C.red,
                        fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
                      }}>{m.tickets}</span>
                      <span style={{ color: C.textSecondary, fontSize: 10 }}>/600</span>
                    </div>
                    <Bar val={m.tickets} max={600}
                      color={m.tickets >= 600 ? C.green : m.tickets >= 400 ? C.gold : C.red} />
                  </div>
                </td>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Dot status={m.status} />
                    <span style={{ color: STATUS_COLORS[m.status] || C.textSecondary, fontSize: 11, textTransform: 'capitalize' }}>
                      {m.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
