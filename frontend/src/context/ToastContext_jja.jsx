// ============================================================
// ToastContext_jja.jsx — Sistema de notificaciones Toast global
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { createContext, useState, useCallback, useContext } from 'react'

const ToastContext_jja = createContext(null)

// ── Tipos de toast ──────────────────────────────────────────
const TIPOS_TOAST_JJA = {
  exito: { icono: '✅', clase: 'toast-exito-jja' },
  error: { icono: '❌', clase: 'toast-error-jja' },
  advertencia: { icono: '⚠️', clase: 'toast-advertencia-jja' },
  info: { icono: 'ℹ️', clase: 'toast-info-jja' },
}

let contadorToast_jja = 0

// ── Provider ────────────────────────────────────────────────
export const ToastProvider_jja = ({ children }) => {
  const [toasts_jja, setToasts_jja] = useState([])

  const agregarToast_jja = useCallback((tipo_jja, mensaje_jja, duracion_jja = 4000) => {
    const id_jja = ++contadorToast_jja
    const nuevoToast_jja = {
      id: id_jja,
      tipo: tipo_jja,
      mensaje: mensaje_jja,
      saliendo: false,
    }
    setToasts_jja(prev => [...prev, nuevoToast_jja])

    // Auto-dismiss
    setTimeout(() => {
      setToasts_jja(prev =>
        prev.map(t => t.id === id_jja ? { ...t, saliendo: true } : t)
      )
      setTimeout(() => {
        setToasts_jja(prev => prev.filter(t => t.id !== id_jja))
      }, 300)
    }, duracion_jja)
  }, [])

  const cerrarToast_jja = useCallback((id_jja) => {
    setToasts_jja(prev =>
      prev.map(t => t.id === id_jja ? { ...t, saliendo: true } : t)
    )
    setTimeout(() => {
      setToasts_jja(prev => prev.filter(t => t.id !== id_jja))
    }, 300)
  }, [])

  const valor_jja = {
    exito: (msg, dur) => agregarToast_jja('exito', msg, dur),
    error: (msg, dur) => agregarToast_jja('error', msg, dur),
    advertencia: (msg, dur) => agregarToast_jja('advertencia', msg, dur),
    info: (msg, dur) => agregarToast_jja('info', msg, dur),
  }

  return (
    <ToastContext_jja.Provider value={valor_jja}>
      {children}

      {/* ── Contenedor de Toasts ──────────────────────────── */}
      <div className="toast-contenedor-jja" aria-live="polite">
        {toasts_jja.map(toast => {
          const config = TIPOS_TOAST_JJA[toast.tipo] || TIPOS_TOAST_JJA.info
          return (
            <div
              key={toast.id}
              className={`toast-jja ${config.clase} ${toast.saliendo ? 'toast-saliendo-jja' : 'toast-entrando-jja'}`}
              role="alert"
            >
              <span className="toast-icono-jja">{config.icono}</span>
              <span className="toast-mensaje-jja">{toast.mensaje}</span>
              <button
                className="toast-cerrar-jja"
                onClick={() => cerrarToast_jja(toast.id)}
                aria-label="Cerrar notificación"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext_jja.Provider>
  )
}

// ── Hook para usar toasts ───────────────────────────────────
export const useToast_jja = () => {
  const contexto = useContext(ToastContext_jja)
  if (!contexto) {
    throw new Error('useToast_jja debe usarse dentro de ToastProvider_jja')
  }
  return contexto
}

export default ToastContext_jja
