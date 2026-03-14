import React, { useState, useEffect, useRef } from 'react'
import { apiRequest } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import imagenlogo_jja from '../../assets/JoanjeCoders.png'

const Header = ({ usuario_jc, onLogout }) => {
  const navigate = useNavigate()
  const [scrolleado, setScrolleado] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const centinelaRef = useRef(null)

  useEffect(() => {
    // Cargar contador de solicitudes pendientes para roles administrativos
    const cargarPendientes = async () => {
      try {
        if (!usuario_jc || usuario_jc.rol === 'cliente') return
        const data = await apiRequest('/solicitudes-prestamo')
        let list = []
        if (Array.isArray(data)) list = data
        else if (Array.isArray(data.datos)) list = data.datos
        else if (Array.isArray(data.solicitudes)) list = data.solicitudes
        else list = data || []
        const pendientes = list.filter(r => (r.estado_jja || r.estado) === 'pendiente')
        setPendingCount(pendientes.length)
      } catch (e) {
        // ignore silently
      }
    }
    cargarPendientes()

    const centinela = document.createElement('div')
    centinela.style.cssText = 'position:absolute;top:1px;height:1px;width:100%;pointer-events:none'
    document.body.prepend(centinela)
    centinelaRef.current = centinela

    const observador_jja = new IntersectionObserver(
      ([entrada]) => setScrolleado(!entrada.isIntersecting),
      { threshold: 0 }
    )
    observador_jja.observe(centinela)
    return () => { observador_jja.disconnect(); centinelaRef.current?.remove() }
  }, [])

  const irAlSistema_jc = (e) => { e.preventDefault(); navigate('/login') }

  return (
    <header className={`header ${scrolleado ? 'scrolleado' : ''}`}>
      <div className="contenedor header-contenido">

        <a href="/" className="logo logo-grande" onClick={(e) => { e.preventDefault(); navigate('/') }}>
          <img src={imagenlogo_jja} alt="Logo JoAnJe Coders" />
        </a>

        <button
          className="menu-toggle"
          onPointerDown={() => setMenuAbierto(!menuAbierto)}
          aria-label="Menú"
        >
          <span></span><span></span><span></span>
        </button>

        <nav className={`navegacion ${menuAbierto ? 'abierta' : ''}`}>
          {['/#funcionalidades', '/#politicas', '/#testimonios', '/#sobre-nosotros', '/#contacto'].map((href, i) => (
            <a key={i} href={href} onMouseDown={() => setMenuAbierto(false)}>
              {['Funcionalidades', 'Políticas', 'Testimonios', 'Sobre Nosotros', 'Contacto'][i]}
            </a>
          ))}
          {usuario_jc ? (
            <div className="user-menu" style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Quick links según rol */}
              {usuario_jc.rol === 'cliente' ? (
                <>
                  <button className="login-boton" onClick={(e) => { e.preventDefault(); navigate('/marketplace') }}>Marketplace</button>
                  <button className="login-boton" onClick={(e) => { e.preventDefault(); navigate('/mis-solicitudes') }}>Solicitudes</button>
                </>
              ) : (
                <>
                  <button className="login-boton" onClick={(e) => { e.preventDefault(); navigate('/sistema') }}>Sistema</button>
                  <button className="login-boton" onClick={(e) => { e.preventDefault(); navigate('/sistema/solicitudes') }} style={{position:'relative'}}>
                    Solicitudes
                    {pendingCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: -6,
                        right: -10,
                        background: '#ef4444',
                        color: '#fff',
                        borderRadius: 12,
                        padding: '2px 6px',
                        fontSize: 12,
                        fontWeight: 700
                      }}>{pendingCount}</span>
                    )}
                  </button>
                </>
              )}

              <div className="user-trigger" style={{display:'flex',flexDirection:'column',alignItems:'flex-end'}}>
                <span className="header-user">{usuario_jc.nombre || usuario_jc.correo || 'Usuario'}</span>
                <div className="user-dropdown">
                  <button className="boton-ligero" onClick={(e) => { e.preventDefault(); onLogout && onLogout(); navigate('/') }}>Cerrar sesión</button>
                </div>
              </div>
            </div>
          ) : (
            <a
              href="/login"
              className="boton-iniciar-sesion"
              onClick={irAlSistema_jc}
            >
              Iniciar Sesión
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
