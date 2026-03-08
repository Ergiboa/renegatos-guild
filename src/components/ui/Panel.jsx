import { C } from '../../theme.js'

export function Panel({ children, accent = C.blue, style = {} }) {
  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${C.border}`,
      borderTop: `1px solid ${accent}40`,
      borderRadius: 10,
      boxShadow: `0 4px 24px #00000044`,
      ...style,
    }}>
      {children}
    </div>
  )
}

export function PanelHeader({ children, color = C.blue, right }) {
  return (
    <div style={{
      padding: '14px 20px',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span style={{ fontFamily: "'Orbitron', monospace", color, fontSize: 11, letterSpacing: '0.15em' }}>
        {children}
      </span>
      {right && <span style={{ color: C.textSecondary, fontSize: 10 }}>{right}</span>}
    </div>
  )
}
