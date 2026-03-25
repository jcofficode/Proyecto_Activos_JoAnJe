// ============================================================
// PersonalizacionPage_jja.jsx — Personalización del sistema
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useContext, useState, useRef } from 'react'
import { ThemeContext_jja } from '../../context/ThemeContext_jja'
import FormGroup_jja from '../../components/ui_jja/FormGroup_jja'
import BotonAccion_jja from '../../components/ui_jja/BotonAccion_jja'
import {
  IconoPersonalizacion_jja, IconoSubir_jja, IconoDashboard_jja,
  IconoInventario_jja, IconoUsuarios_jja, IconoSolicitudes_jja,
  IconoReportes_jja, IconoAlertas_jja, IconoCheck_jja,
} from '../../components/ui_jja/Iconos_jja'

const PersonalizacionPage_jja = () => {
  const { tema, actualizarTema, resetearTema } = useContext(ThemeContext_jja)
  const [form_jja, setForm_jja] = useState({ ...tema })
  const [guardado_jja, setGuardado_jja] = useState(false)
  const fileRef = useRef(null)

  const handleCambio = (campo, valor) => {
    setForm_jja(prev => ({ ...prev, [campo]: valor }))
    setGuardado_jja(false)
  }

  const handleLogo = (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      handleCambio('logoUrl', ev.target.result)
    }
    reader.readAsDataURL(archivo)
  }

  const handleGuardar = () => {
    actualizarTema(form_jja)
    setGuardado_jja(true)
    setTimeout(() => setGuardado_jja(false), 3000)
  }

  const handleResetear = () => {
    resetearTema()
    setForm_jja({
      nombreEmpresa: 'JoAnJe Coders',
      subtitulo: 'Sistema de Gestión de Activos',
      colorPrimario: '#4f46e5',
      colorSecundario: '#0ea5e9',
      colorSidebar: '#1e1b4b',
      logoUrl: null,
    })
  }

  // Items de preview del sidebar
  const previewItems = [
    { icono: <IconoDashboard_jja />, label: 'Dashboard', activo: true },
    { icono: <IconoInventario_jja />, label: 'Inventario' },
    { icono: <IconoUsuarios_jja />, label: 'Usuarios' },
    { icono: <IconoSolicitudes_jja />, label: 'Solicitudes' },
    { icono: <IconoReportes_jja />, label: 'Reportes' },
    { icono: <IconoAlertas_jja />, label: 'Alertas' },
  ]

  return (
    <div>
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja">Personalización</h1>
          <p className="pagina-subtitulo-jja">Configura la identidad visual de tu empresa en el sistema</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
        {/* Formulario principal */}
        <div className="card-jja">
          <div className="card-header-jja">
            <span className="card-titulo-jja">
              <IconoPersonalizacion_jja style={{ fontSize: '1.1rem' }} /> Datos de la Empresa
            </span>
          </div>
          <div className="card-body-jja">
            <div className="form-grid-jja">
              <FormGroup_jja
                label="Nombre de la empresa"
                nombre="nombreEmpresa"
                valor={form_jja.nombreEmpresa}
                onChange={handleCambio}
                placeholder="Nombre de tu empresa"
                requerido
              />
              <FormGroup_jja
                label="Subtítulo del sistema"
                nombre="subtitulo"
                valor={form_jja.subtitulo}
                onChange={handleCambio}
                placeholder="Descripción breve"
              />
            </div>

            <div style={{ marginTop: 8 }}>
              <div className="form-label-jja" style={{ marginBottom: 10 }}>Logotipo de la empresa</div>
              <div
                className="upload-area-jja"
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogo}
                  style={{ display: 'none' }}
                />
                {form_jja.logoUrl ? (
                  <img src={form_jja.logoUrl} alt="Logo" className="upload-preview-jja" />
                ) : (
                  <>
                    <div className="upload-icono-jja"><IconoSubir_jja /></div>
                    <div className="upload-texto-jja">Haz clic para seleccionar tu logotipo</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--texto-terciario-jja)', marginTop: 4 }}>PNG, JPG o SVG. Máximo 2MB</div>
                  </>
                )}
              </div>
              {form_jja.logoUrl && (
                <button
                  className="btn-jja btn-ghost-jja btn-sm-jja"
                  style={{ marginTop: 8 }}
                  onClick={() => handleCambio('logoUrl', null)}
                >
                  Eliminar logotipo
                </button>
              )}
            </div>

            <div style={{ marginTop: 24 }}>
              <div className="form-label-jja" style={{ marginBottom: 14 }}>Colores del sistema</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--texto-secundario-jja)', marginBottom: 6 }}>Color primario</div>
                  <div className="color-picker-jja">
                    <input
                      type="color"
                      className="color-picker-input-jja"
                      value={form_jja.colorPrimario}
                      onChange={(e) => handleCambio('colorPrimario', e.target.value)}
                    />
                    <span className="color-picker-hex-jja">{form_jja.colorPrimario}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--texto-secundario-jja)', marginBottom: 6 }}>Color secundario</div>
                  <div className="color-picker-jja">
                    <input
                      type="color"
                      className="color-picker-input-jja"
                      value={form_jja.colorSecundario}
                      onChange={(e) => handleCambio('colorSecundario', e.target.value)}
                    />
                    <span className="color-picker-hex-jja">{form_jja.colorSecundario}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--texto-secundario-jja)', marginBottom: 6 }}>Sidebar</div>
                  <div className="color-picker-jja">
                    <input
                      type="color"
                      className="color-picker-input-jja"
                      value={form_jja.colorSidebar}
                      onChange={(e) => handleCambio('colorSidebar', e.target.value)}
                    />
                    <span className="color-picker-hex-jja">{form_jja.colorSidebar}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: 10, marginTop: 28, justifyContent: 'flex-end' }}>
              <BotonAccion_jja variante="ghost" onClick={handleResetear}>
                Restaurar valores por defecto
              </BotonAccion_jja>
              <BotonAccion_jja
                variante="primario"
                icono={guardado_jja ? <IconoCheck_jja /> : null}
                onClick={handleGuardar}
              >
                {guardado_jja ? 'Guardado ✓' : 'Guardar cambios'}
              </BotonAccion_jja>
            </div>
          </div>
        </div>

        {/* Preview del sidebar */}
        <div className="card-jja">
          <div className="card-header-jja">
            <span className="card-titulo-jja">Vista previa</span>
          </div>
          <div className="card-body-jja" style={{ padding: 12 }}>
            <div
              className="preview-sidebar-jja"
              style={{ background: form_jja.colorSidebar }}
            >
              {/* Logo preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 6px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 6 }}>
                {form_jja.logoUrl ? (
                  <img src={form_jja.logoUrl} alt="Logo" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'contain', background: 'rgba(255,255,255,0.1)', padding: 2 }} />
                ) : (
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>JC</div>
                )}
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>{form_jja.nombreEmpresa}</div>
                  <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)' }}>{form_jja.subtitulo}</div>
                </div>
              </div>

              {/* Menu items preview */}
              {previewItems.map((item, i) => (
                <div
                  key={i}
                  className={`preview-sidebar-item-jja ${item.activo ? 'activo-jja' : ''}`}
                  style={item.activo ? { background: `${form_jja.colorPrimario}33` } : undefined}
                >
                  <span style={{ fontSize: '0.85rem' }}>{item.icono}</span>
                  {item.label}
                </div>
              ))}

              {/* Color primario indicator */}
              <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ height: 4, borderRadius: 4, background: form_jja.colorPrimario, marginBottom: 6 }} />
                <div style={{ height: 4, borderRadius: 4, background: form_jja.colorSecundario, width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalizacionPage_jja
