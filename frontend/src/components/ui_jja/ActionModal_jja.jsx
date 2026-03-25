// ============================================================
// ActionModal_jja.jsx — Modal reutilizable con animación
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useEffect } from 'react'
import { IconoCerrar_jja } from './Iconos_jja'

const ActionModal_jja = ({
  visible = false,
  titulo = 'Modal',
  children,
  onCerrar,
  onConfirmar,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  variante = 'primario', // primario | exito | error | advertencia
  cargando = false,
  ancho = '560px',
  sinFooter = false,
}) => {
  // Cerrar con Escape
  useEffect(() => {
    if (!visible) return
    const handler = (e) => { if (e.key === 'Escape') onCerrar?.() }
    document.addEventListener('keydown', handler)
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [visible, onCerrar])

  if (!visible) return null

  return (
    <div className="modal-overlay-jja" onClick={(e) => { if (e.target === e.currentTarget) onCerrar?.() }}>
      <div className="modal-contenido-jja" style={{ maxWidth: ancho }}>
        {/* Header */}
        <div className="modal-header-jja">
          <h3 className="modal-titulo-jja">{titulo}</h3>
          <button className="modal-cerrar-jja" onClick={onCerrar} aria-label="Cerrar">
            <IconoCerrar_jja />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body-jja">
          {children}
        </div>

        {/* Footer */}
        {!sinFooter && (
          <div className="modal-footer-jja">
            <button className="btn-jja btn-ghost-jja" onClick={onCerrar} disabled={cargando}>
              {textoCancelar}
            </button>
            {onConfirmar && (
              <button className={`btn-jja btn-${variante}-jja`} onClick={onConfirmar} disabled={cargando}>
                {cargando ? 'Procesando...' : textoConfirmar}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ActionModal_jja
