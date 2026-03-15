import React from 'react'
import { useNavigate } from 'react-router-dom'
import imagenlogo_jja from "../../assets/JoanjeCoders.png"
import CompanySetup from './CompanySetup'
import Inventory from './Inventory'
import Alerts from './Alerts'
import Reports from './Reports'
import Users from './Users'

const irA_jc = (destino) =>
  window.dispatchEvent(new CustomEvent('navegar_jc', { detail: { destino } }))

const Sistema = ({ usuario_jc, navegarA_jc }) => {
  const nombre_jc = usuario_jc?.nombre || 'Usuario'
  const [company, setCompany] = React.useState(null)
  const [showSetup, setShowSetup] = React.useState(false)
  const [module, setModule] = React.useState(null)

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('joanje_company')
      if (raw) setCompany(JSON.parse(raw))
    } catch (e) { /* ignore */ }
  }, [])

  const handleCompanySaved = (payload) => setCompany(payload)

  const navigate = useNavigate()

  const volverALanding_jc = (e) => {
    e.preventDefault()
    // Prefer react-router navigation to ensure route changes to landing
    try { navigate('/') } catch (err) {
      // fallback to previous custom event if navigate isn't available
      if (typeof navegarA_jc === 'function') navegarA_jc('landing')
      else irA_jc('landing')
    }
  }

  const modulos = [
    { icono: '📦', nombre: 'Inventario',  color: '#ff6b35' },
    { icono: '📊', nombre: 'Reportes',    color: '#7b2fff' },
    { icono: '🔔', nombre: 'Alertas',     color: '#ff6b35' },
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
          <button onClick={volverALanding_jc} className="sistema-volver boton-ligero">
            ← Volver al sitio
          </button>
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

        {/* Grid de módulos */}
        {!module && (
          <div className="sistema-grid">
            {modulos.map((m, i) => (
              <div key={i} className="sistema-modulo clickable" style={{ '--acento': m.color }} onClick={() => {
                const ruta = `/sistema/${m.nombre.toLowerCase()}`
                if (usuario_jc) {
                  // usuario ya autenticado: ir directo
                  window.history.pushState({}, '', ruta)
                  window.dispatchEvent(new PopStateEvent('popstate'))
                } else {
                  // no autenticado: enviar a login con next param
                  window.history.pushState({}, '', '/login')
                  window.dispatchEvent(new PopStateEvent('popstate'))
                  // store next path so Login can read from history state or location
                  sessionStorage.setItem('joanje_next', ruta)
                }
              }}>
                <span className="modulo-icono">{m.icono}</span>
                <span className="modulo-nombre">{m.nombre}</span>
                <span className="modulo-badge">Abrir</span>
              </div>
            ))}
          </div>
        )}

        {/* Module views */}
        {module === 'inventario' || module === 'inventario' && module === 'inventario' ? null : null}
        {module === 'inventario' && (
          <div style={{marginTop:12}}>
            <button className="boton-ligero" onClick={() => setModule(null)}>Volver</button>
            <Inventory />
          </div>
        )}
        {module === 'reportes' && (
          <div style={{marginTop:12}}>
            <button className="boton-ligero" onClick={() => setModule(null)}>Volver</button>
            <Reports />
          </div>
        )}
        {module === 'alertas' && (
          <div style={{marginTop:12}}>
            <button className="boton-ligero" onClick={() => setModule(null)}>Volver</button>
            <Alerts />
          </div>
        )}
        {module === 'usuarios' && (
          <div style={{marginTop:12}}>
            <button className="boton-ligero" onClick={() => setModule(null)}>Volver</button>
            <Users />
          </div>
        )}

      </div>
    </div>
  )
}

export default Sistema
