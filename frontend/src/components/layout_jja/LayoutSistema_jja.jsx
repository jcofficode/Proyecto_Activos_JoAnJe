// ============================================================
// LayoutSistema_jja.jsx — Layout wrapper del sistema
// Compone: Sidebar + Header + Outlet (react-router)
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar_jja from './Sidebar_jja'
import HeaderSistema_jja from './HeaderSistema_jja'
import '../../styles/sistema_jja.css'

const LayoutSistema_jja = () => {
  const [sidebarAbierto_jja, setSidebarAbierto_jja] = useState(false)

  return (
    <div className="layout-sistema-jja">
      <Sidebar_jja
        abierto={sidebarAbierto_jja}
        onCerrar={() => setSidebarAbierto_jja(false)}
      />
      <div className="main-area-jja">
        <HeaderSistema_jja
          onToggleSidebar={() => setSidebarAbierto_jja(prev => !prev)}
        />
        <main className="contenido-sistema-jja">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default LayoutSistema_jja
