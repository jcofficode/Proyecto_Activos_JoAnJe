// ============================================================
// ModalEscaneoQR_jja.jsx — Modal de confirmación QR (entrega y devolución)
// Arquitectura Pusher: el teléfono escanea el QR → llama al backend
// → el backend emite evento → el modal se cierra automáticamente.
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Pusher from 'pusher-js'
import { API_URL_JC } from '../../api.config.js'
import { IconoCerrar_jja, IconoQR_jja } from './Iconos_jja'

const ModalEscaneoQR_jja = ({
  visible,
  idActivo_jja,
  idSolicitud_jja,
  idEncargado_jja,
  nombreActivo_jja,
  // Props para modo devolución
  modo = 'entrega',
  idPrestamo_jja,
  idSolicitudDevolucion_jja,
  onExito,
  onCerrar,
}) => {
  const pusherRef_jja = useRef(null)
  const esDevolucion_jja = modo === 'devolucion'

  // Cerrar con Escape + bloquear scroll
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

  // Pusher: conectar mientras el modal está visible
  useEffect(() => {
    const idEscucha_jja = esDevolucion_jja ? idSolicitudDevolucion_jja : idSolicitud_jja
    if (!visible || !idEscucha_jja) return

    const pusher_jja = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
    })
    pusherRef_jja.current = pusher_jja

    const canal_jja = pusher_jja.subscribe('prestamos_jja')
    const evento_jja = esDevolucion_jja ? 'devolucion_confirmada_jja' : 'entrega_confirmada_jja'
    const campoId_jja = esDevolucion_jja ? 'id_solicitud_devolucion' : 'id_solicitud'

    canal_jja.bind(evento_jja, (datos_jja) => {
      if (Number(datos_jja[campoId_jja]) === Number(idEscucha_jja)) {
        onExito?.(datos_jja)
      }
    })

    return () => {
      canal_jja.unbind_all()
      pusher_jja.unsubscribe('prestamos_jja')
      pusher_jja.disconnect()
      pusherRef_jja.current = null
    }
  }, [visible, idSolicitud_jja, idSolicitudDevolucion_jja, modo])

  if (!visible) return null

  // URL del QR según el modo
  const urlQR_jja = esDevolucion_jja
    ? `${API_URL_JC}/confirmar-devolucion?id_solicitud_devolucion=${idSolicitudDevolucion_jja}&id_prestamo=${idPrestamo_jja}&id_encargado=${idEncargado_jja || 0}`
    : `${API_URL_JC}/confirmar-entrega?id_solicitud=${idSolicitud_jja}&id_activo=${idActivo_jja}&id_encargado=${idEncargado_jja || 0}`

  const nombreMostrar_jja = nombreActivo_jja || `Activo #${idActivo_jja}`
  const titulo_jja = esDevolucion_jja ? 'Confirmar Devolución' : 'Confirmar Entrega'
  const instruccion_jja = esDevolucion_jja
    ? 'Escanea este código QR con el teléfono para confirmar la devolución de'
    : 'Escanea este código QR con el teléfono para confirmar la entrega de'
  const espera_jja = esDevolucion_jja
    ? 'Esperando confirmación de devolución desde el teléfono...'
    : 'Esperando confirmación desde el teléfono...'

  return (
    <div className="modal-overlay-jja" onClick={(e) => { if (e.target === e.currentTarget) onCerrar?.() }}>
      <div className="modal-contenido-jja" style={{ maxWidth: 440 }}>

        {/* Header */}
        <div className="modal-header-jja">
          <h3 className="modal-titulo-jja" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconoQR_jja style={{ fontSize: '1.1rem' }} />
            {titulo_jja}
          </h3>
          <button className="modal-cerrar-jja" onClick={onCerrar} aria-label="Cerrar">
            <IconoCerrar_jja />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body-jja" style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: 20, fontSize: '0.88rem', color: 'var(--texto-secundario-jja)', lineHeight: 1.5 }}>
            {instruccion_jja}
            <strong style={{ color: 'var(--texto-primario-jja)' }}> {nombreMostrar_jja}</strong>.
          </p>

          {/* Código QR */}
          <div style={{
            display: 'inline-block', padding: 16, background: 'white',
            borderRadius: 12, border: '2px solid var(--borde-jja)', marginBottom: 20,
          }}>
            <QRCodeSVG value={urlQR_jja} size={180} level="M" />
          </div>

          {/* Estado de espera */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: 'var(--fondo-secundario-jja)', borderRadius: 10, padding: '12px 16px',
          }}>
            <span className="skeleton-jja" style={{
              width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
              background: esDevolucion_jja ? 'var(--color-exito-jja, #10b981)' : 'var(--color-advertencia-jja)',
            }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--texto-secundario-jja)' }}>
              {espera_jja}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer-jja">
          <button className="btn-jja btn-ghost-jja" onClick={onCerrar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalEscaneoQR_jja
