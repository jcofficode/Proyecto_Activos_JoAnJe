import React from 'react'
import imagenlogo_jja from "../../assets/JoanjeCoders.png"
import CompanySetup from './CompanySetup'

const irA_jc = (destino) =>
  window.dispatchEvent(new CustomEvent('navegar_jc', { detail: { destino } }))

const Sistema = ({ usuario_jc, navegarA_jc }) => {
  const nombre_jc = usuario_jc?.nombre || 'Usuario'
  const [company, setCompany] = React.useState(null)
  const [showSetup, setShowSetup] = React.useState(false)

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('joanje_company')
      if (raw) setCompany(JSON.parse(raw))
    } catch (e) { /* ignore */ }
  }, [])

  const handleCompanySaved = (payload) => setCompany(payload)

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
        <div className="sistema-header-left" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={imagenlogo_jja} alt="JoAnJe Coders" style={{ height: '50px', objectFit: 'contain' }} />
          {company && company.logo && (
            <img src={company.logo} alt={company.nombre || 'Empresa'} style={{ height: 40, objectFit: 'contain', borderRadius: 6 }} />
          )}
        </div>
        <div className="sistema-header-right">
          <a href="#landing" onMouseDown={volverALanding_jc} className="sistema-volver">
            ← Volver al sitio
          </a>
        </div>
      </header>

      <div className="sistema-contenido">

        {/* Panel de configuración de empresa si falta: mostrar CTA y abrir al click */}
        {!company && !showSetup && (
          <div className="company-cta" style={{ marginBottom: 16 }}>
            <button className="boton-enviar" onClick={() => setShowSetup(true)}>
              Configurar tu empresa
            </button>
          </div>
        )}
        {!company && showSetup && (
          <CompanySetup onSaved={(p) => { handleCompanySaved(p); setShowSetup(false) }} onCancel={() => setShowSetup(false)} />
        )}

        {/* Saludo */}
        <div className="sistema-saludo">
          <div className="sistema-avatar">
            {company && company.logo
              ? <img src={company.logo} alt={company.nombre || 'Empresa'} style={{ height: 48, width: 48, objectFit: 'cover', borderRadius: 8 }} />
              : '🖥️'
            }
          </div>
          <h1 className="sistema-titulo">¡Hola, {nombre_jc}!</h1>
          <p className="sistema-subtitulo">
            Has accedido exitosamente al demo del Sistema de Gestión de Activos.
          </p>
          {company && company.nombre && (
            <div className="empresa-info" style={{ marginTop: 8 }}>
              <strong>Empresa:</strong> {company.nombre}
            </div>
          )}
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
