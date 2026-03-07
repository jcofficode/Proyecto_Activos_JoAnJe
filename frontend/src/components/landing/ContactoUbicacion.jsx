import React, { useState } from 'react'
import ContactForm from '../contact/ContactForm'
import Map from '../contact/Map'

// ── Loader CSS (restored to keep original loader styles) ──
const estilosLoader_jc = `
  .loader-jc { width:36px;aspect-ratio:1;--c:linear-gradient(#ff6b35 0 0);--r1:radial-gradient(farthest-side at bottom,#ff6b35 93%,#0000);--r2:radial-gradient(farthest-side at top,#ff6b35 93%,#0000);background:var(--c),var(--r1),var(--r2),var(--c),var(--r1),var(--r2),var(--c),var(--r1),var(--r2);background-repeat:no-repeat;animation:l2-jc 1s infinite alternate; }
  @keyframes l2-jc{0%,25%{background-size:8px 0,8px 4px,8px 4px,8px 0,8px 4px,8px 4px,8px 0,8px 4px,8px 4px;background-position:0 50%,0 calc(50% - 2px),0 calc(50% + 2px),50% 50%,50% calc(50% - 2px),50% calc(50% + 2px),100% 50%,100% calc(50% - 2px),100% calc(50% + 2px)}50%{background-size:8px 100%,8px 4px,8px 4px,8px 0,8px 4px,8px 4px,8px 0,8px 4px,8px 4px;background-position:0 50%,0 calc(0% - 2px),0 calc(100% + 2px),50% 50%,50% calc(50% - 2px),50% calc(50% + 2px),100% 50%,100% calc(50% - 2px),100% calc(50% + 2px)}75%{background-size:8px 100%,8px 4px,8px 4px,8px 100%,8px 4px,8px 4px,8px 0,8px 4px,8px 4px;background-position:0 50%,0 calc(0% - 2px),0 calc(100% + 2px),50% 50%,50% calc(0% - 2px),50% calc(100% + 2px),100% 50%,100% calc(50% - 2px),100% calc(50% + 2px)}95%,100%{background-size:8px 100%,8px 4px,8px 4px,8px 100%,8px 4px,8px 4px,8px 100%,8px 4px,8px 4px;background-position:0 50%,0 calc(0% - 2px),0 calc(100% + 2px),50% 50%,50% calc(0% - 2px),50% calc(100% + 2px),100% 50%,100% calc(0% - 2px),100% calc(100% + 2px)}
`

// ── Iconos SVG ────────────────────────────────────────────────────
const IconoCorreo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)
const IconoTelefono = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.08 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" />
  </svg>
)
const IconoUbicacion = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

// ────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL — Tabs: Formulario / Ubicación (usa subcomponentes)
// ────────────────────────────────────────────────────────────────
const ContactoUbicacion = ({ navegarA_jc }) => {
  const [tabActivo_jc, setTabActivo_jc] = useState('formulario')
  return (
    <>
      <style>{estilosLoader_jc}</style>

      <section id="contacto" className="seccion contacto-ubicacion">
        <div className="contenedor">
          <h2 className="seccion-titulo">Contáctenos</h2>

          {/* ── TABS ── */}
          <div className="tabs-contenedor">
            <div className="tabs-barra">
              <button
                className={`tab-btn ${tabActivo_jc === 'formulario' ? 'activo' : ''}`}
                onPointerDown={() => setTabActivo_jc('formulario')}
              >
                📋 Formulario de Contacto
              </button>
              <button
                className={`tab-btn ${tabActivo_jc === 'ubicacion' ? 'activo' : ''}`}
                onPointerDown={() => setTabActivo_jc('ubicacion')}
              >
                📍 Ubicación / Mapa
              </button>
            </div>

            {/* ── TAB: FORMULARIO ── */}
            <div className={`tab-panel ${tabActivo_jc === 'formulario' ? 'visible' : ''}`}>
              <div className="contactanos-contenedor">

                {/* Info lateral */}
                <div className="contactanos-info">
                  <h3>Estamos aquí para ayudarte</h3>
                  <p>Regístrate para obtener acceso al demo del Sistema de Gestión de Activos. Te enviaremos una clave temporal a tu correo.</p>
                  <div className="info-item">
                    <div className="info-icono"><IconoTelefono /></div>
                    <div className="info-texto"><h4>Teléfono</h4><p>+58 414 000 0000</p></div>
                  </div>
                  <div className="info-item">
                    <div className="info-icono"><IconoCorreo /></div>
                    <div className="info-texto"><h4>Correo</h4><p>contacto@joanje.com</p></div>
                  </div>
                  <div className="info-item">
                    <div className="info-icono"><IconoUbicacion /></div>
                    <div className="info-texto"><h4>Ubicación</h4><p>Caracas, Venezuela</p></div>
                  </div>
                </div>

                {/* Formulario con validación (subcomponente) */}
                <div className="formulario-contacto">
                  <ContactForm navegarA_jc={navegarA_jc} />
                </div>
              </div>
            </div>

            {/* ── TAB: UBICACIÓN ── */}
            <div className={`tab-panel ${tabActivo_jc === 'ubicacion' ? 'visible' : ''}`}>
              <div className="ubicacion-panel">
                <div className="mapa-placeholder" style={{ height: '420px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                  <Map />
                </div>
                <div className="ubicacion-datos">
                  <div className="ubicacion-dato-item">
                    <strong>📍 Oficinas Centrales</strong>
                    <p>Av. Sanz, Sector El Convento III, Edificio Tauro, Piso 2.<br />Miranda, Venezuela.</p>
                  </div>
                  <div className="ubicacion-dato-item">
                    <strong>🕐 Horarios de Atención</strong>
                    <p>Lunes a Viernes: 8:00 AM – 5:00 PM<br />Sábados: 9:00 AM – 1:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

export default ContactoUbicacion
