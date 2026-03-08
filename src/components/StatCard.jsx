import { C } from '../theme.js'
import { Panel } from './ui/Panel.jsx'

export default function StatCard({ label, value, sub, color = C.gold, icon }) {
  return (
    <Panel accent={color} style={{ padding: '18px 20px', flex: 1, minWidth: 140 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: C.textSecondary, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: "'Orbitron', monospace", marginBottom: 8 }}>
            {label}
          </div>
          <div style={{ color, fontSize: 26, fontWeight: 700, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>
            {value}
          </div>
          {sub && <div style={{ color: C.textSecondary, fontSize: 11, marginTop: 5 }}>{sub}</div>}
        </div>
        <span style={{ fontSize: 22, opacity: 0.2 }}>{icon}</span>
      </div>
    </Panel>
  )
}
