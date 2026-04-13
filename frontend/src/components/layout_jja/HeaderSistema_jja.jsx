// ============================================================
// HeaderSistema_jja.jsx — Header superior del panel
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconoMenu_jja, IconoNotificacion_jja, IconoPerfil_jja, IconoLogout_jja } from '../ui_jja/Iconos_jja'
import Breadcrumb_jja from '../ui_jja/Breadcrumb_jja'
import useAuth_jja from '../../hooks/useAuth_jja'
import { useNotificaciones_jja } from '../../context/NotificacionContext_jja'

// SVG icons for role badge
const IconoAdmin_jja = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const IconoEncargado_jja = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconoCliente_jja = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const ROLES_CONFIG = {
  administrador: { label: 'Administrador', clase: 'admin-jja', Icono: IconoAdmin_jja },
  admin: { label: 'Administrador', clase: 'admin-jja', Icono: IconoAdmin_jja },
  encargado: { label: 'Encargado', clase: 'encargado-jja', Icono: IconoEncargado_jja },
  cliente: { label: 'Cliente', clase: 'cliente-jja', Icono: IconoCliente_jja },
}

const HeaderSistema_jja = ({ breadcrumb = [], onToggleSidebar }) => {
  const { usuario, esAdmin, esEncargado, logout } = useAuth_jja()
  const { noLeidas } = useNotificaciones_jja()
  const navigate = useNavigate()
  const [menuAbierto_jja, setMenuAbierto_jja] = useState(false)
  const menuRef = useRef(null)

  // Cerrar menu al hacer click afuera
  useEffect(() => {
    const handleClickFuera = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto_jja(false)
      }
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  // Rutas dinamicas segun rol
  const handleNotificaciones = () => {
    navigate(esAdmin || esEncargado ? '/sistema/notificaciones' : '/notificaciones')
  }

  const handlePerfil = () => {
    setMenuAbierto_jja(false)
    navigate(esAdmin || esEncargado ? '/sistema/perfil' : '/perfil')
  }

  const handleLogout = () => {
    setMenuAbierto_jja(false)
    logout()
    navigate('/')
  }

  // Iniciales del usuario
  const iniciales_jja = usuario
    ? `${(usuario.nombre || '')[0] || ''}${(usuario.apellido || '')[0] || ''}`.toUpperCase()
    : 'U'

  // Fecha formateada
  const fechaActual = new Date().toLocaleDateString('es-VE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const fechaCapitalizada = fechaActual.charAt(0).toUpperCase() + fechaActual.slice(1)

  // Rol config
  const rolKey = (usuario?.rol || '').toLowerCase()
  const rolConfig = ROLES_CONFIG[rolKey] || ROLES_CONFIG.cliente
  const RolIcono = rolConfig.Icono

  return (
    <header className="header-sistema-jja">
      <div className="header-izq-jja">
        <button className="header-hamburguesa-jja" onClick={onToggleSidebar} aria-label="Abrir menu">
          <IconoMenu_jja />
        </button>
        <Breadcrumb_jja items={breadcrumb} />
      </div>
      <div className="header-der-jja">
        <div className="header-fecha-jja">{fechaCapitalizada}</div>
        <div className="header-acciones-jja">

          {/* Badge de Rol */}
          <span className={`header-rol-badge-jja ${rolConfig.clase}`}>
            <RolIcono />
            {rolConfig.label}
          </span>

          <button className="header-btn-notificacion-jja" onClick={handleNotificaciones} aria-label="Notificaciones">
            <IconoNotificacion_jja />
            {noLeidas > 0 && (
              <span className="header-notificacion-count-jja">{noLeidas > 99 ? '99+' : noLeidas}</span>
            )}
          </button>

          <div className={`header-dropdown-container-jja ${menuAbierto_jja ? 'abierto-jja' : ''}`} ref={menuRef}>
            <div
              className="header-avatar-jja"
              onClick={() => setMenuAbierto_jja(!menuAbierto_jja)}
              title={usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario'}
              style={{ overflow: 'hidden' }}
            >
              {usuario?.imagen ? (
                 <img src={usuario.imagen} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
              ) : (
                 iniciales_jja
              )}
            </div>

            <div className="header-dropdown-jja">
              <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-color-jja)', marginBottom: '4px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{usuario?.nombre} {usuario?.apellido}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--texto-secundario-jja)', textTransform: 'capitalize' }}>{usuario?.rol}</div>
              </div>
              <button className="header-dropdown-item-jja" onClick={handlePerfil}>
                <IconoPerfil_jja />
                <span>Editar Perfil</span>
              </button>
              <button className="header-dropdown-item-jja" onClick={handleLogout} style={{ color: 'var(--color-error-jja)' }}>
                <IconoLogout_jja />
                <span>Cerrar Sesion</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}

export default HeaderSistema_jja
