import React, { useState, useEffect, useRef } from 'react'
import imagenlogo_jja from '../../assets/JoanjeCoders.png'

const irA_jc = (destino) =>
  window.dispatchEvent(new CustomEvent('navegar_jc', { detail: { destino } }))

const Header = () => {
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

  const irAlSistema_jc = (e) => { e.preventDefault(); irA_jc('login') }

  return (
    <header className={`header ${scrolleado ? 'scrolleado' : ''}`}>
      <div className="contenedor header-contenido">

        <a href="#inicio" className="logo logo-grande">
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
          {['#inicio', '#funcionalidades', '#politicas', '#testimonios', '#sobre-nosotros', '#contacto'].map((href, i) => (
            <a key={i} href={href} onMouseDown={() => setMenuAbierto(false)}>
              {['Inicio', 'Funcionalidades', 'Políticas', 'Testimonios', 'Sobre Nosotros', 'Contacto'][i]}
            </a>
          ))}
          <a
            href="#sistema"
            className="boton-iniciar-sesion"
            onMouseDown={irAlSistema_jc}
          >
            Iniciar Sesión
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
