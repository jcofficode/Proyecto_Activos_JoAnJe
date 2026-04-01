// ============================================================
// NotificacionContext_jja.jsx — Contexto global de notificaciones
// Polling cada 30s, conteo no-leídas, toast de nuevas notifs
// + Conteos de alertas, solicitudes pendientes, auditoría
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { createContext, useState, useEffect, useCallback, useRef, useContext } from 'react'
import { apiRequest } from '../utils/api'
import useAuth_jja from '../hooks/useAuth_jja'

const NotificacionContext_jja = createContext(null)

const INTERVALO_POLLING_MS = 30000 // 30 segundos

export const NotificacionProvider_jja = ({ children }) => {
  const { usuario, estaAutenticado, esAdmin, esEncargado } = useAuth_jja()
  const [noLeidas_jja, setNoLeidas_jja] = useState(0)
  const [toastNotif_jja, setToastNotif_jja] = useState(null)

  // ── Conteos adicionales para badges del sidebar ──
  const [conteosAlerts_jja, setConteosAlerts_jja] = useState(0)
  const [conteosSolicitudes_jja, setConteosSolicitudes_jja] = useState(0)
  const [conteosAuditoria_jja, setConteosAuditoria_jja] = useState(0)

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

  // ── Consultar conteos de sidebar (solo admin/encargado) ──
  const consultarConteosSidebar_jja = useCallback(async () => {
    if (!estaAutenticado || !usuario?.id) return
    if (!esAdmin && !esEncargado) return

    try {
      // Alertas: contar préstamos vencidos
      const [prestResp, solResp, devResp, audResp] = await Promise.allSettled([
        apiRequest('/prestamos'),
        apiRequest('/solicitudes-prestamo'),
        apiRequest('/solicitudes-devolucion'),
        esAdmin ? apiRequest('/auditoria') : Promise.resolve([]),
      ])

      // Contar alertas (préstamos vencidos o próximos a vencer)
      if (prestResp.status === 'fulfilled') {
        const prestamos = Array.isArray(prestResp.value) ? prestResp.value : (prestResp.value?.datos || prestResp.value?.prestamos || [])
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        const vencidosCount = prestamos.filter(p => {
          if (p.estado_prestamo_jja === 'vencido') return true
          if (p.estado_prestamo_jja !== 'activo') return false
          const limite = new Date(p.fecha_limite_jja)
          limite.setHours(0, 0, 0, 0)
          return limite < hoy
        }).length
        setConteosAlerts_jja(vencidosCount)
      }

      // Contar solicitudes pendientes
      let pendientes = 0
      if (solResp.status === 'fulfilled') {
        const sols = Array.isArray(solResp.value) ? solResp.value : (solResp.value?.datos || [])
        pendientes += sols.filter(s => (s.estado_jja || '') === 'pendiente').length
      }
      if (devResp.status === 'fulfilled') {
        const devs = Array.isArray(devResp.value) ? devResp.value : (devResp.value?.datos || [])
        pendientes += devs.filter(d => (d.estado_jja || '') === 'pendiente').length
      }
      setConteosSolicitudes_jja(pendientes)

      // Contar auditoría reciente (últimas 24h)
      if (esAdmin && audResp.status === 'fulfilled') {
        const auds = Array.isArray(audResp.value) ? audResp.value : (audResp.value?.datos || [])
        const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const recientes = auds.filter(a => {
          const fecha = new Date(a.fecha_jja || a.creado_en_jja)
          return fecha > hace24h
        }).length
        setConteosAuditoria_jja(recientes)
      }
    } catch (err) {
      console.warn('Error al consultar conteos sidebar:', err)
    }
  }, [estaAutenticado, usuario?.id, esAdmin, esEncargado])

  // ── Polling ──
  useEffect(() => {
    if (!estaAutenticado || !usuario?.id) {
      setNoLeidas_jja(0)
      prevNoLeidas_ref.current = 0
      primeraVez_ref.current = true
      setConteosAlerts_jja(0)
      setConteosSolicitudes_jja(0)
      setConteosAuditoria_jja(0)
      return
    }

    // Consulta inicial
    consultarNoLeidas_jja()
    consultarConteosSidebar_jja()

    // Intervalo
    polling_ref.current = setInterval(() => {
      consultarNoLeidas_jja()
      consultarConteosSidebar_jja()
    }, INTERVALO_POLLING_MS)
    return () => {
      if (polling_ref.current) clearInterval(polling_ref.current)
    }
  }, [estaAutenticado, usuario?.id, consultarNoLeidas_jja, consultarConteosSidebar_jja])

  // ── Auto-ocultar toast tras 5 segundos ──
  useEffect(() => {
    if (!toastNotif_jja) return
    const timer = setTimeout(() => setToastNotif_jja(null), 5000)
    return () => clearTimeout(timer)
  }, [toastNotif_jja])

  // ── Método para refrescar manualmente (tras marcar como leídas) ──
  const refrescar_jja = useCallback(() => {
    consultarNoLeidas_jja()
    consultarConteosSidebar_jja()
  }, [consultarNoLeidas_jja, consultarConteosSidebar_jja])

  // ── Cerrar toast ──
  const cerrarToast_jja = useCallback(() => {
    setToastNotif_jja(null)
  }, [])

  const valor = {
    noLeidas: noLeidas_jja,
    toastNotif: toastNotif_jja,
    refrescar: refrescar_jja,
    cerrarToast: cerrarToast_jja,
    // Conteos sidebar
    conteosAlerts: conteosAlerts_jja,
    conteosSolicitudes: conteosSolicitudes_jja,
    conteosAuditoria: conteosAuditoria_jja,
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
    return {
      noLeidas: 0, toastNotif: null, refrescar: () => { }, cerrarToast: () => { },
      conteosAlerts: 0, conteosSolicitudes: 0, conteosAuditoria: 0,
    }
  }
  return ctx
}

export default NotificacionContext_jja
