import { NavLink } from 'react-router-dom'
import { C } from '../theme.js'
import { Dot } from './ui/index.jsx'

const NAV = [
  { to: '/',         label: 'Dashboard',        icon: '◈' },
  { to: '/tw',       label: 'Territory War',    icon: '⚔' },
  { to: '/tb',       label: 'Territory Battle', icon: '◎' },
  { to: '/raids',    label: 'Raids',            icon: '☠' },
  { to: '/counters', label: 'Counters',         icon: '◬' },
]

export default function Sidebar({ lastSync }) {
  return (
    <aside style={{
      width: 215, flexShrink: 0,
      background: `linear-gradient(180deg, #06101f 0%, ${C.bgPanel} 100%)`,
      borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column',
      zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: `radial-gradient(ellipse 120% 80% at 50% 0%, ${C.blue}10, transparent 60%)`,
      }}>
        <img
          src="/logo.png"
          alt="ReneGatos"
          style={{
            width: 88, height: 88, objectFit: 'contain',
            filter: 'drop-shadow(0 0 18px #3b9ede44) drop-shadow(0 0 6px #f5a62322)',
            marginBottom: 12,
          }}
        />
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, fontWeight: 700, color: C.white, letterSpacing: '0.06em', textAlign: 'center' }}>
          RENE<span style={{ color: C.gold }}>GATOS</span>
        </div>
        <div style={{ color: C.textSecondary, fontSize: 9, letterSpacing: '0.15em', marginTop: 3, textAlign: 'center' }}>
          Compañerismo · Compromiso · Competitivo
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10, background: `${C.green}10`, border: `1px solid ${C.green}20`, borderRadius: 20, padding: '3px 10px' }}>
          <Dot status="active" />
          <span style={{ color: C.green, fontSize: 9, letterSpacing: '0.08em' }}>SISTEMA ACTIVO</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {NAV.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 7,
            border: 'none', borderLeft: isActive ? `2px solid ${C.gold}` : '2px solid transparent',
            background: isActive ? `linear-gradient(90deg, ${C.gold}15, transparent)` : 'transparent',
            color: isActive ? C.gold : C.textSecondary,
            fontSize: 11, fontFamily: "'Orbitron', monospace", letterSpacing: '0.06em',
            marginBottom: 3, transition: 'all 0.2s', textDecoration: 'none',
          })}>
            <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ color: C.textSecondary, fontSize: 9, letterSpacing: '0.1em', fontFamily: "'Orbitron', monospace" }}>ÚLTIMA SYNC</div>
        <div style={{ color: C.blue, fontSize: 11, fontFamily: 'monospace', marginTop: 2 }}>
          {lastSync || '—'}
        </div>
        <div style={{ color: C.textSecondary, fontSize: 9, marginTop: 1 }}>via Mandalorian API</div>
      </div>
    </aside>
  )
}
