// ============================================================
// NotificacionContext_jja.jsx — Contexto global de notificaciones
// Polling cada 30s, conteo no-leídas, toast de nuevas notifs
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { createContext, useState, useEffect, useCallback, useRef, useContext } from 'react'
import { apiRequest } from '../utils/api'
import useAuth_jja from '../hooks/useAuth_jja'

const NotificacionContext_jja = createContext(null)

const INTERVALO_POLLING_MS = 30000 // 30 segundos

export const NotificacionProvider_jja = ({ children }) => {
  const { usuario, estaAutenticado } = useAuth_jja()
  const [noLeidas_jja, setNoLeidas_jja] = useState(0)
  const [toastNotif_jja, setToastNotif_jja] = useState(null)

  const prevNoLeidas_ref = useRef(0)
  const primeraVez_ref = useRef(true)
  const polling_ref = useRef(null)

  // ── Consultar notificaciones no leídas ──
  const consultarNoLeidas_jja = useCallback(async () => {
    if (!estaAutenticado || !usuario?.id) return

    try {
      const data = await apiRequest(`/notificaciones/usuario/${usuario.id}`)
      const list = Array.isArray(data) ? data : (data?.datos || [])
      const cantNoLeidas = list.filter(n => !n.leida_jja).length
      setNoLeidas_jja(cantNoLeidas)

      // Si incrementó el conteo (y no es la primera carga), mostrar toast
      if (!primeraVez_ref.current && cantNoLeidas > prevNoLeidas_ref.current) {
        const diff = cantNoLeidas - prevNoLeidas_ref.current
        setToastNotif_jja({
          cantidad: diff,
          mensaje: diff === 1
            ? '¡Has recibido una nueva notificación!'
            : `¡Has recibido ${diff} nuevas notificaciones!`,
          timestamp: Date.now(),
        })
      }

      prevNoLeidas_ref.current = cantNoLeidas
      primeraVez_ref.current = false
    } catch (err) {
      console.warn('Error al consultar notificaciones:', err)
    }
  }, [estaAutenticado, usuario?.id])

  // ── Polling ──
  useEffect(() => {
    if (!estaAutenticado || !usuario?.id) {
      setNoLeidas_jja(0)
      prevNoLeidas_ref.current = 0
      primeraVez_ref.current = true
      return
    }

    // Consulta inicial
    consultarNoLeidas_jja()

    // Intervalo
    polling_ref.current = setInterval(consultarNoLeidas_jja, INTERVALO_POLLING_MS)
    return () => {
      if (polling_ref.current) clearInterval(polling_ref.current)
    }
  }, [estaAutenticado, usuario?.id, consultarNoLeidas_jja])

  // ── Auto-ocultar toast tras 5 segundos ──
  useEffect(() => {
    if (!toastNotif_jja) return
    const timer = setTimeout(() => setToastNotif_jja(null), 5000)
    return () => clearTimeout(timer)
  }, [toastNotif_jja])

  // ── Método para refrescar manualmente (tras marcar como leídas) ──
  const refrescar_jja = useCallback(() => {
    consultarNoLeidas_jja()
  }, [consultarNoLeidas_jja])

  // ── Cerrar toast ──
  const cerrarToast_jja = useCallback(() => {
    setToastNotif_jja(null)
  }, [])

  const valor = {
    noLeidas: noLeidas_jja,
    toastNotif: toastNotif_jja,
    refrescar: refrescar_jja,
    cerrarToast: cerrarToast_jja,
  }

  return (
    <NotificacionContext_jja.Provider value={valor}>
      {children}
    </NotificacionContext_jja.Provider>
  )
}

// ── Hook ──
export const useNotificaciones_jja = () => {
  const ctx = useContext(NotificacionContext_jja)
  // Retornar fallback seguro si no hay provider
  if (!ctx) {
    return { noLeidas: 0, toastNotif: null, refrescar: () => {}, cerrarToast: () => {} }
  }
  return ctx
}

export default NotificacionContext_jja
