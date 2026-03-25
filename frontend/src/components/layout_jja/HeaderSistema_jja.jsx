// ============================================================
// HeaderSistema_jja.jsx — Header superior del panel
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconoMenu_jja, IconoNotificacion_jja, IconoPerfil_jja, IconoLogout_jja } from '../ui_jja/Iconos_jja'
import Breadcrumb_jja from '../ui_jja/Breadcrumb_jja'
import useAuth_jja from '../../hooks/useAuth_jja'

const HeaderSistema_jja = ({ breadcrumb = [], onToggleSidebar }) => {
  const { usuario, esAdmin, esEncargado, logout } = useAuth_jja()
  const navigate = useNavigate()
  const [menuAbierto_jja, setMenuAbierto_jja] = useState(false)
  const menuRef = useRef(null)

  // Cerrar menú al hacer click afuera
  useEffect(() => {
    const handleClickFuera = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto_jja(false)
      }
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  // Rutas dinámicas según rol
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

  return (
    <header className="header-sistema-jja">
      <div className="header-izq-jja">
        <button className="header-hamburguesa-jja" onClick={onToggleSidebar} aria-label="Abrir menú">
          <IconoMenu_jja />
        </button>
        <Breadcrumb_jja items={breadcrumb} />
      </div>
      <div className="header-der-jja">
        <div className="header-fecha-jja">{fechaCapitalizada}</div>
        <div className="header-acciones-jja">
          
          <button className="header-btn-notificacion-jja" onClick={handleNotificaciones} aria-label="Notificaciones">
            <IconoNotificacion_jja />
            <span className="header-notificacion-badge-jja"></span>
          </button>

          <div className={`header-dropdown-container-jja ${menuAbierto_jja ? 'abierto-jja' : ''}`} ref={menuRef}>
            <div 
              className="header-avatar-jja" 
              onClick={() => setMenuAbierto_jja(!menuAbierto_jja)}
              title={usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario'}
            >
              {iniciales_jja}
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
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}

export default HeaderSistema_jja
