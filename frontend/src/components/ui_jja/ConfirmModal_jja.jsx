// ============================================================
// ConfirmModal_jja.jsx — Modal de confirmación reutilizable
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React from 'react'

const ConfirmModal_jja = ({
  visible = false,
  titulo = '¿Estás seguro?',
  mensaje = '',
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  variante = 'error', // 'error' | 'advertencia' | 'info'
  onConfirmar,
  onCancelar,
  cargando = false,
}) => {
  if (!visible) return null

  const iconoPorVariante_jja = {
    error: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    advertencia: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    info: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  }

  const claseBoton_jja = {
    error: 'btn-jja btn-error-jja',
    advertencia: 'btn-jja btn-advertencia-jja',
    info: 'btn-jja btn-primario-jja',
  }

  return (
    <>
      <div className="modal-overlay-jja confirm-overlay-jja" onClick={onCancelar} />
      <div className="modal-contenedor-jja confirm-modal-jja" role="dialog" aria-modal="true">
        <div className="confirm-icono-jja">
          {iconoPorVariante_jja[variante] || iconoPorVariante_jja.info}
        </div>
        <h3 className="confirm-titulo-jja">{titulo}</h3>
        {mensaje && <p className="confirm-mensaje-jja">{mensaje}</p>}
        <div className="confirm-acciones-jja">
          <button
            className="btn-jja btn-ghost-jja"
            onClick={onCancelar}
            disabled={cargando}
          >
            {textoCancelar}
          </button>
          <button
            className={claseBoton_jja[variante] || 'btn-jja btn-primario-jja'}
            onClick={onConfirmar}
            disabled={cargando}
          >
            {cargando ? 'Procesando...' : textoConfirmar}
          </button>
        </div>
      </div>
    </>
  )
}

export default ConfirmModal_jja
