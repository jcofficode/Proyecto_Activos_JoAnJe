// ============================================================
// Sidebar_jja.jsx — Menú lateral del sistema
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ThemeContext_jja } from '../../context/ThemeContext_jja'
import useAuth_jja from '../../hooks/useAuth_jja'
import { useNotificaciones_jja } from '../../context/NotificacionContext_jja'
import logoDefault from '../../assets/JoanjeCoders.png'
import {
  IconoDashboard_jja, IconoInventario_jja, IconoUsuarios_jja,
  IconoSolicitudes_jja, IconoReportes_jja, IconoAlertas_jja,
  IconoConfiguracion_jja, IconoPersonalizacion_jja, IconoAuditoria_jja,
  IconoPerfil_jja, IconoLogout_jja, IconoMarketplace_jja, IconoPrestamo_jja,
  IconoNotificacion_jja, IconoSancion_jja,
} from '../ui_jja/Iconos_jja'

// ── Definición de menú por rol ───────────────────────────────
const MENU_ADMIN_JJA = [
  { seccion: 'Menú Principal' },
  { ruta: '/sistema/dashboard', icono: <IconoDashboard_jja />, label: 'Dashboard' },
  { ruta: '/sistema/inventario', icono: <IconoInventario_jja />, label: 'Inventario' },
  { ruta: '/sistema/usuarios', icono: <IconoUsuarios_jja />, label: 'Usuarios' },
  { ruta: '/sistema/solicitudes', icono: <IconoSolicitudes_jja />, label: 'Solicitudes', badgeKey: 'solicitudes' },
  { ruta: '/sistema/prestamos', icono: <IconoPrestamo_jja />, label: 'Préstamos' },
  { ruta: '/sistema/reportes', icono: <IconoReportes_jja />, label: 'Reportes' },
  { ruta: '/sistema/alertas', icono: <IconoAlertas_jja />, label: 'Alertas', badgeKey: 'alertas' },
  { ruta: '/sistema/lista-negra', icono: <IconoSancion_jja />, label: 'Lista Negra' },
  { ruta: '/sistema/notificaciones', icono: <IconoNotificacion_jja />, label: 'Notificaciones', badgeKey: 'notificaciones' },
  { separador: true },
  { seccion: 'Configuración' },
  { ruta: '/sistema/configuracion', icono: <IconoConfiguracion_jja />, label: 'Configuración' },
  { ruta: '/sistema/personalizacion', icono: <IconoPersonalizacion_jja />, label: 'Personalización' },
  { ruta: '/sistema/auditoria', icono: <IconoAuditoria_jja />, label: 'Auditoría', badgeKey: 'auditoria' },
]

const MENU_ENCARGADO_JJA = [
  { seccion: 'Menú Principal' },
  { ruta: '/sistema/dashboard', icono: <IconoDashboard_jja />, label: 'Dashboard' },
  { ruta: '/sistema/inventario', icono: <IconoInventario_jja />, label: 'Inventario' },
  { ruta: '/sistema/solicitudes', icono: <IconoSolicitudes_jja />, label: 'Solicitudes', badgeKey: 'solicitudes' },
  { ruta: '/sistema/prestamos', icono: <IconoPrestamo_jja />, label: 'Préstamos' },
  { ruta: '/sistema/alertas', icono: <IconoAlertas_jja />, label: 'Alertas', badgeKey: 'alertas' },
  { ruta: '/sistema/lista-negra', icono: <IconoSancion_jja />, label: 'Lista Negra' },
  { ruta: '/sistema/notificaciones', icono: <IconoNotificacion_jja />, label: 'Notificaciones', badgeKey: 'notificaciones' },
  { separador: true },
  { seccion: 'GESTIÓN PERSONAL' },
  { ruta: '/marketplace', icono: <IconoMarketplace_jja />, label: 'Catálogo' },
  { ruta: '/mis-solicitudes', icono: <IconoSolicitudes_jja />, label: 'Mis Solicitudes' },
  { ruta: '/mis-prestamos', icono: <IconoPrestamo_jja />, label: 'Mis Préstamos' },
]

const MENU_CLIENTE_JJA = [
  { seccion: 'Menú Principal' },
  { ruta: '/marketplace', icono: <IconoMarketplace_jja />, label: 'Catálogo' },
  { ruta: '/mis-solicitudes', icono: <IconoSolicitudes_jja />, label: 'Mis Solicitudes' },
  { ruta: '/mis-prestamos', icono: <IconoPrestamo_jja />, label: 'Mis Préstamos' },
  { ruta: '/notificaciones', icono: <IconoNotificacion_jja />, label: 'Notificaciones', badgeKey: 'notificaciones' },
]

const Sidebar_jja = ({ abierto = false, onCerrar }) => {
  const { usuario, logout, esAdmin, esEncargado } = useAuth_jja()
  const { tema } = useContext(ThemeContext_jja)
  const navigate = useNavigate()

  // Notificaciones y conteos
  const notifCtx = useNotificaciones_jja()
  const noLeidas_jja = notifCtx?.noLeidas || 0
  const conteosAlerts_jja = notifCtx?.conteosAlerts || 0
  const conteosSolicitudes_jja = notifCtx?.conteosSolicitudes || 0
  const conteosAuditoria_jja = notifCtx?.conteosAuditoria || 0

  // Mapa de badges dinámicos
  const badgeMap = {
    notificaciones: noLeidas_jja,
    alertas: conteosAlerts_jja,
    solicitudes: conteosSolicitudes_jja,
    auditoria: conteosAuditoria_jja,
  }

  // Seleccionar menú según rol y agregar badge dinámico
  const menuBase = esAdmin ? MENU_ADMIN_JJA : esEncargado ? MENU_ENCARGADO_JJA : MENU_CLIENTE_JJA
  const menuItems = menuBase.map(item => {
    if (item.badgeKey && badgeMap[item.badgeKey] > 0) {
      return { ...item, badge: badgeMap[item.badgeKey] }
    }
    return item
  })

  // Iniciales del usuario para el avatar
  const iniciales = usuario
    ? `${(usuario.nombre || '')[0] || ''}${(usuario.apellido || '')[0] || ''}`.toUpperCase()
    : 'U'

  const avatarUrl = usuario?.imagen || null

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      {/* Overlay para móvil */}
      <div
        className={`sidebar-overlay-jja ${abierto ? 'visible-jja' : ''}`}
        onClick={onCerrar}
      />

      <aside className={`sidebar-jja ${abierto ? 'abierto-jja' : ''}`}>
        {/* Brand / Logo */}
        <div className="sidebar-brand-jja">
          <img
            src={tema.logoUrl || logoDefault}
            alt={tema.nombreEmpresa}
            className="sidebar-brand-logo-jja"
          />
          <div className="sidebar-brand-info-jja">
            <div className="sidebar-brand-nombre-jja">{tema.nombreEmpresa}</div>
            <div className="sidebar-brand-subtitulo-jja">{tema.subtitulo}</div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="sidebar-nav-jja">
          {menuItems.map((item, i) => {
            if (item.separador) {
              return <div key={`sep-${i}`} className="sidebar-separador-jja" />
            }
            if (item.seccion) {
              return (
                <div key={`sec-${i}`} className="sidebar-seccion-jja">
                  <div className="sidebar-seccion-titulo-jja">{item.seccion}</div>
                </div>
              )
            }
            return (
              <NavLink
                key={item.ruta}
                to={item.ruta}
                className={({ isActive }) => `sidebar-item-jja ${isActive ? 'activo-jja' : ''}`}
                onClick={onCerrar}
              >
                <span className="sidebar-item-icono-jja">{item.icono}</span>
                <span>{item.label}</span>
                {item.badge && <span className="sidebar-item-badge-jja">{item.badge > 99 ? '99+' : item.badge}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* Separador antes del footer */}
        <div className="sidebar-separador-jja" />

        {/* Perfil en footer */}
        <div className="sidebar-footer-jja">
          <NavLink
            to={esAdmin || esEncargado ? '/sistema/perfil' : '/perfil'}
            className={({ isActive }) => `sidebar-item-jja ${isActive ? 'activo-jja' : ''}`}
            onClick={onCerrar}
          >
            <span className="sidebar-item-icono-jja"><IconoPerfil_jja /></span>
            <span>Mi Perfil</span>
          </NavLink>

          <button className="sidebar-item-jja" onClick={handleLogout} style={{ marginTop: 2 }}>
            <span className="sidebar-item-icono-jja"><IconoLogout_jja /></span>
            <span>Cerrar Sesión</span>
          </button>

          {/* Info usuario */}
          <div className="sidebar-usuario-jja">
            <div className="sidebar-avatar-jja" style={{ overflow: 'hidden' }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                iniciales
              )}
            </div>
            <div className="sidebar-usuario-info-jja">
              <div className="sidebar-usuario-nombre-jja">{usuario?.nombre} {usuario?.apellido}</div>
              <div className="sidebar-usuario-rol-jja">{usuario?.rol}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar_jja
