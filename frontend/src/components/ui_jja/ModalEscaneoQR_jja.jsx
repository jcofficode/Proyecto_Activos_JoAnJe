// ============================================================
// ModalEscaneoQR_jja.jsx — Modal de escaneo QR para entrega de activos
// Paso 2 del flujo de aprobación: confirmar entrega física
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { apiRequest } from '../../utils/api'
import { IconoCerrar_jja, IconoQR_jja } from './Iconos_jja'

const ModalEscaneoQR_jja = ({ visible, idActivo_jja, nombreActivo_jja, onExito, onCerrar }) => {
  const [activo_jja, setActivo_jja] = useState(null)
  const [cargando_jja, setCargando_jja] = useState(false)
  const [escaneado_jja, setEscaneado_jja] = useState('')
  const [error_jja, setError_jja] = useState('')
  const [confirmando_jja, setConfirmando_jja] = useState(false)
  const inputRef_jja = useRef(null)

  useEffect(() => {
    if (visible && idActivo_jja) {
      setActivo_jja(null)
      setEscaneado_jja('')
      setError_jja('')
      cargarActivo_jja()
    }
  }, [visible, idActivo_jja])

  useEffect(() => {
    if (!visible) return
    const manejarEscape_jja = (e) => { if (e.key === 'Escape') onCerrar?.() }
    document.addEventListener('keydown', manejarEscape_jja)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', manejarEscape_jja)
      document.body.style.overflow = ''
    }
  }, [visible, onCerrar])

  useEffect(() => {
    if (visible && !cargando_jja) {
      setTimeout(() => inputRef_jja.current?.focus(), 100)
    }
  }, [visible, cargando_jja])

  async function cargarActivo_jja() {
    setCargando_jja(true)
    try {
      const res = await apiRequest(`/activos/${idActivo_jja}`)
      setActivo_jja(res.datos || res)
    } catch (err) {
      setError_jja('No se pudo cargar el activo: ' + err.message)
    } finally {
      setCargando_jja(false)
    }
  }

  async function confirmarEscaneo_jja() {
    const valor_jja = escaneado_jja.trim()
    if (!valor_jja) {
      setError_jja('Escanea el código QR o escríbelo manualmente.')
      inputRef_jja.current?.focus()
      return
    }

    // Validar que el código coincide con el activo esperado
    const codigoEsperado_jja = activo_jja?.codigo_qr_jja
    if (codigoEsperado_jja && valor_jja !== codigoEsperado_jja) {
      setError_jja(`Código incorrecto. Escanea el QR del activo "${activo_jja?.nombre_jja || nombreActivo_jja}".`)
      setEscaneado_jja('')
      inputRef_jja.current?.focus()
      return
    }

    setConfirmando_jja(true)
    setError_jja('')
    try {
      const res = await apiRequest('/escaneo', {
        method: 'POST',
        body: JSON.stringify({ id_activo: String(idActivo_jja) }),
      })
      if (res?.exito || res?.status === 'success') {
        onExito?.(res)
      } else {
        setError_jja(res?.mensaje || 'Error al confirmar la entrega.')
      }
    } catch (err) {
      setError_jja('Error: ' + err.message)
    } finally {
      setConfirmando_jja(false)
    }
  }

  const manejarTecla_jja = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      confirmarEscaneo_jja()
    }
  }

  if (!visible) return null

  const codigoQR_jja = activo_jja?.codigo_qr_jja || String(idActivo_jja)
  const nombreMostrar_jja = activo_jja?.nombre_jja || nombreActivo_jja || `Activo #${idActivo_jja}`

  return (
    <div className="modal-overlay-jja" onClick={(e) => { if (e.target === e.currentTarget) onCerrar?.() }}>
      <div className="modal-contenido-jja" style={{ maxWidth: 440 }}>

        {/* Header */}
        <div className="modal-header-jja">
          <h3 className="modal-titulo-jja" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconoQR_jja style={{ fontSize: '1.1rem' }} />
            Confirmar Entrega
          </h3>
          <button className="modal-cerrar-jja" onClick={onCerrar} aria-label="Cerrar">
            <IconoCerrar_jja />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body-jja" style={{ textAlign: 'center' }}>
          {cargando_jja ? (
            <div style={{ padding: '32px 0', color: 'var(--texto-secundario-jja)', fontSize: '0.9rem' }}>
              Cargando datos del activo...
            </div>
          ) : (
            <>
              <p style={{ marginBottom: 20, fontSize: '0.88rem', color: 'var(--texto-secundario-jja)', lineHeight: 1.5 }}>
                Escanea el código QR físico del activo
                <strong style={{ color: 'var(--texto-primario-jja)' }}> {nombreMostrar_jja}</strong> para confirmar la entrega.
              </p>

              {/* Código QR */}
              <div style={{
                display: 'inline-block', padding: 16, background: 'white',
                borderRadius: 12, border: '2px solid var(--borde-jja)', marginBottom: 12
              }}>
                <QRCodeSVG value={codigoQR_jja} size={160} level="M" />
              </div>

              <p style={{ fontSize: '0.72rem', color: 'var(--texto-terciario-jja)', marginBottom: 20, fontFamily: 'monospace' }}>
                {codigoQR_jja}
              </p>

              {/* Input del escáner */}
              <div style={{ textAlign: 'left', marginBottom: 8 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: 6, color: 'var(--texto-secundario-jja)' }}>
                  Lector QR / entrada manual:
                </label>
                <input
                  ref={inputRef_jja}
                  type="text"
                  className="form-input-jja"
                  placeholder="Escanea con el lector o escribe el código..."
                  value={escaneado_jja}
                  onChange={(e) => { setEscaneado_jja(e.target.value); setError_jja('') }}
                  onKeyDown={manejarTecla_jja}
                  autoComplete="off"
                  style={{ textAlign: 'center', letterSpacing: '0.04em', fontFamily: 'monospace' }}
                />
              </div>

              {error_jja && (
                <p style={{ color: '#ef4444', fontSize: '0.82rem', marginBottom: 4, textAlign: 'left' }}>
                  {error_jja}
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!cargando_jja && (
          <div className="modal-footer-jja">
            <button className="btn-jja btn-ghost-jja" onClick={onCerrar} disabled={confirmando_jja}>
              Cancelar
            </button>
            <button
              className="btn-jja btn-primario-jja"
              onClick={confirmarEscaneo_jja}
              disabled={confirmando_jja || !escaneado_jja.trim()}
            >
              {confirmando_jja ? 'Confirmando...' : 'Confirmar Entrega'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ModalEscaneoQR_jja
