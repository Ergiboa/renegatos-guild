import { Routes, Route } from 'react-router-dom'
import { C } from './theme.js'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { TerritoryWar, TerritoryBattle, Raids, Counters } from './pages/placeholders.jsx'

export default function App() {
  const now = new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.bg }}>

      {/* Grid de fondo sutil */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `linear-gradient(${C.border}22 1px, transparent 1px), linear-gradient(90deg, ${C.border}22 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />

      {/* Línea de acento superior */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 1, zIndex: 20,
        background: `linear-gradient(90deg, transparent, ${C.blue}60, ${C.gold}40, ${C.blue}60, transparent)`,
      }} />

      <Sidebar lastSync={now} />

      <main style={{
        flex: 1, overflow: 'auto',
        padding: '28px 32px',
        position: 'relative', zIndex: 1,
      }}>
        <Routes>
          <Route path="/"         element={<Dashboard />} />
          <Route path="/tw"       element={<TerritoryWar />} />
          <Route path="/tb"       element={<TerritoryBattle />} />
          <Route path="/raids"    element={<Raids />} />
          <Route path="/counters" element={<Counters />} />
        </Routes>
      </main>
    </div>
  )
}
