import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import imagenlogo_jja from '../../assets/JoanjeCoders.png'

const Header = ({ usuario_jc, onLogout }) => {
  const navigate = useNavigate()
  const [scrolleado, setScrolleado] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const centinelaRef = useRef(null)

  useEffect(() => {
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
          {['/#inicio', '/#funcionalidades', '/#politicas', '/#testimonios', '/#sobre-nosotros', '/#contacto'].map((href, i) => (
            <a key={i} href={href} onMouseDown={() => setMenuAbierto(false)}>
              {['Inicio', 'Funcionalidades', 'Políticas', 'Testimonios', 'Sobre Nosotros', 'Contacto'][i]}
            </a>
          ))}
          {usuario_jc ? (
            <div className="user-menu" style={{ marginLeft: 8 }}>
              <button
                className="boton-iniciar-sesion"
                onClick={(e) => { e.preventDefault(); navigate('/sistema') }}
                title="Ir al panel"
              >
                Ir al sistema
              </button>
              <div className="user-trigger">
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
