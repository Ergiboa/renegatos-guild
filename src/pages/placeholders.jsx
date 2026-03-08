import { C } from '../theme.js'
import { Panel } from '../components/ui/Panel.jsx'

function ComingSoon({ icon, title, description }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '65vh' }}>
      <Panel style={{ padding: '60px 80px', textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 52, marginBottom: 20, opacity: 0.4 }}>{icon}</div>
        <div style={{ fontFamily: "'Orbitron', monospace", color: C.blue, fontSize: 16, letterSpacing: '0.12em', marginBottom: 12 }}>
          {title}
        </div>
        <div style={{ color: C.textSecondary, fontSize: 13, lineHeight: 1.6 }}>{description}</div>
        <div style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 8, background: `${C.gold}10`, border: `1px solid ${C.gold}25`, borderRadius: 6, padding: '6px 16px' }}>
          <span style={{ color: C.gold, fontSize: 10, fontFamily: "'Orbitron', monospace", letterSpacing: '0.1em' }}>PRÓXIMAMENTE</span>
        </div>
      </Panel>
    </div>
  )
}

export function TerritoryWar() {
  return <ComingSoon icon="⚔" title="TERRITORY WAR" description="Seguimiento en vivo de la guerra, asignación de defensas, registro de ataques y comparativa con el rival." />
}

export function TerritoryBattle() {
  return <ComingSoon icon="◎" title="TERRITORY BATTLE" description="Seguimiento de fases, misiones completadas, registro de combate y estadísticas históricas de TB." />
}

export function Raids() {
  return <ComingSoon icon="☠" title="RAIDS" description="Seguimiento de raids activos, asignación de equipos, puntuaciones y historial por miembro." />
}

export function Counters() {
  return <ComingSoon icon="◬" title="REPOSITORIO DE COUNTERS" description="Base de datos de counters para Territory War. Busca por equipo rival y encuentra la mejor respuesta." />
}
