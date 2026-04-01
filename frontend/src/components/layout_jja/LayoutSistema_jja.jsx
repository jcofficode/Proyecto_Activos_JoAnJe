// ============================================================
// LayoutSistema_jja.jsx — Layout wrapper del sistema
// Compone: Sidebar + Header + Outlet (react-router)
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar_jja from './Sidebar_jja'
import HeaderSistema_jja from './HeaderSistema_jja'
import VerificadorSancion_jja from '../sistema/VerificadorSancion_jja'
import { useNotificaciones_jja } from '../../context/NotificacionContext_jja'
import useAuth_jja from '../../hooks/useAuth_jja'
import { IconoNotificacion_jja } from '../ui_jja/Iconos_jja'
import '../../styles/sistema_jja.css'

const LayoutSistema_jja = () => {
  const [sidebarAbierto_jja, setSidebarAbierto_jja] = useState(false)
  const { toastNotif, cerrarToast } = useNotificaciones_jja()
  const { esAdmin, esEncargado } = useAuth_jja()
  const navigate = useNavigate()

  const irANotificaciones = () => {
    cerrarToast()
    navigate(esAdmin || esEncargado ? '/sistema/notificaciones' : '/notificaciones')
  }

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
      {/* Verificador de sanción para clientes — modal rojo cada 5s */}
      <VerificadorSancion_jja />

      {/* Toast de notificación nueva */}
      {toastNotif && (
        <div className="notif-toast-banner-jja" onClick={irANotificaciones}>
          <div className="notif-toast-icono-jja">
            <IconoNotificacion_jja />
          </div>
          <div className="notif-toast-texto-jja">
            <span className="notif-toast-titulo-jja">🔔 Nueva notificación</span>
            <span className="notif-toast-mensaje-jja">{toastNotif.mensaje}</span>
          </div>
          <button
            className="notif-toast-cerrar-jja"
            onClick={(e) => { e.stopPropagation(); cerrarToast() }}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export default LayoutSistema_jja
