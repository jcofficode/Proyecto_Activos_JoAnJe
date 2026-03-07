import React from 'react'
import imagenlogo_jja from "../../assets/JoanjeCoders.png"

const irA_jc = (destino) =>
  window.dispatchEvent(new CustomEvent('navegar_jc', { detail: { destino } }))

const Sistema = ({ usuario_jc, navegarA_jc }) => {
  const nombre_jc = usuario_jc?.nombre || 'Usuario'

  const volverALanding_jc = (e) => {
    e.preventDefault()
    if (typeof navegarA_jc === 'function') navegarA_jc('landing')
    else irA_jc('landing')
  }

  const modulos = [
    { icono: '📦', nombre: 'Inventario',  color: '#ff6b35' },
    { icono: '📊', nombre: 'Reportes',    color: '#7b2fff' },
    { icono: '🔔', nombre: 'Alertas',     color: '#ff6b35' },
    { icono: '👤', nombre: 'Usuarios',    color: '#7b2fff' },
  ]

  return (
    <div className="sistema-pagina">
      {/* Decoraciones */}
      <div className="sistema-deco deco-1" aria-hidden="true"></div>
      <div className="sistema-deco deco-2" aria-hidden="true"></div>

      {/* Header del sistema */}
      <header className="sistema-header">
        <img src={imagenlogo_jja} alt="JoAnJe Coders" style={{ height: '50px', objectFit: 'contain' }} />
        <a href="#landing" onMouseDown={volverALanding_jc} className="sistema-volver">
          ← Volver al sitio
        </a>
      </header>

      <div className="sistema-contenido">

        {/* Saludo */}
        <div className="sistema-saludo">
          <div className="sistema-avatar">🖥️</div>
          <h1 className="sistema-titulo">¡Hola, {nombre_jc}!</h1>
          <p className="sistema-subtitulo">
            Has accedido exitosamente al demo del Sistema de Gestión de Activos.
          </p>
        </div>

        {/* Banner en construcción */}
        <div className="sistema-construccion">
          <span className="construccion-icono">🚧</span>
          <div>
            <h2>Proyecto en Construcción</h2>
            <p>
              El Sistema de Gestión de Activos está en desarrollo activo.
              Próximamente podrás registrar, monitorear y gestionar todos tus activos desde aquí.
            </p>
          </div>
        </div>

        {/* Grid de módulos */}
        <div className="sistema-grid">
          {modulos.map((m, i) => (
            <div key={i} className="sistema-modulo" style={{ '--acento': m.color }}>
              <span className="modulo-icono">{m.icono}</span>
              <span className="modulo-nombre">{m.nombre}</span>
              <span className="modulo-badge">Próximamente</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Sistema
