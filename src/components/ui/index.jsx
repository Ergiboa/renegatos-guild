import { C, STATUS_COLORS } from '../../theme.js'

export function Badge({ text, color = C.textSecondary }) {
  return (
    <span style={{
      background: `${color}18`, color,
      border: `1px solid ${color}35`,
      borderRadius: 3, padding: '2px 7px',
      fontSize: 9, fontFamily: "'Orbitron', monospace",
      letterSpacing: '0.08em', whiteSpace: 'nowrap',
    }}>{text}</span>
  )
}

export function Dot({ status }) {
  const col = STATUS_COLORS[status] || C.textSecondary
  return (
    <span style={{
      display: 'inline-block', width: 7, height: 7,
      borderRadius: '50%', background: col, flexShrink: 0,
      boxShadow: status === 'active' ? `0 0 8px ${col}` : 'none',
    }} />
  )
}

export function Bar({ val, max, color }) {
  const pct = Math.min(100, (val / max) * 100)
  return (
    <div style={{ background: C.border, borderRadius: 2, height: 4, width: '100%', overflow: 'hidden' }}>
      <div style={{
        width: `${pct}%`, height: '100%', borderRadius: 2,
        background: `linear-gradient(90deg, ${color}55, ${color})`,
        boxShadow: `0 0 8px ${color}44`,
        transition: 'width 1s ease',
      }} />
    </div>
  )
}
