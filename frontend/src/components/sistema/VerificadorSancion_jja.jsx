// ============================================================
// VerificadorSancion_jja.jsx — Verificador de sanciones
// Se monta en el layout del sistema. Cada 5 segundos y al
// cambiar de vista, verifica si el usuario (cliente) está
// sancionado y muestra el modal rojo.
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { apiRequest } from '../../utils/api'
import useAuth_jja from '../../hooks/useAuth_jja'
import ModalSancion_jja from '../ui_jja/ModalSancion_jja'

const INTERVALO_VERIFICACION_MS = 5000 // 5 segundos

const VerificadorSancion_jja = () => {
  const { usuario, esCliente } = useAuth_jja()
  const location = useLocation()

  const [sancionado_jja, setSancionado_jja] = useState(false)
  const [motivo_jja, setMotivo_jja] = useState('')
  const [modalVisible_jja, setModalVisible_jja] = useState(false)

  // Ref para evitar llamadas duplicadas
  const verificando_ref = useRef(false)
  const intervaloRef = useRef(null)

  // ── Función de verificación ──
  const verificarSancion_jja = useCallback(async () => {
    // Solo verificar si es cliente y está autenticado
    if (!esCliente || !usuario) return
    if (verificando_ref.current) return
    verificando_ref.current = true

    try {
      const resp_jja = await apiRequest('/lista-negra/verificar')
      const datos_jja = resp_jja?.datos || resp_jja
      const tieneSancion = (datos_jja?.tiene_sancion_activa === 1 || datos_jja?.tiene_sancion_activa === '1')

      setSancionado_jja(tieneSancion)
      setMotivo_jja(datos_jja?.motivo || '')

      if (tieneSancion) {
        setModalVisible_jja(true)
      }
    } catch (err) {
      // Si falla la verificación, no bloquear al usuario
      console.warn('Error al verificar sanción:', err)
    } finally {
      verificando_ref.current = false
    }
  }, [esCliente, usuario])

  // ── Verificar al montar y al cambiar de ruta ──
  useEffect(() => {
    verificarSancion_jja()
  }, [location.pathname, verificarSancion_jja])

  // ── Polling cada 5 segundos ──
  useEffect(() => {
    if (!esCliente || !usuario) return

    intervaloRef.current = setInterval(() => {
      verificarSancion_jja()
    }, INTERVALO_VERIFICACION_MS)

    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current)
      }
    }
  }, [esCliente, usuario, verificarSancion_jja])

  // ── Cerrar modal (temporalmente, se reabrirá al siguiente ciclo) ──
  const cerrarModal_jja = useCallback(() => {
    setModalVisible_jja(false)
  }, [])

  // No renderizar nada si no es cliente
  if (!esCliente) return null

  return (
    <ModalSancion_jja
      visible={modalVisible_jja && sancionado_jja}
      motivo={motivo_jja}
      onCerrar={cerrarModal_jja}
    />
  )
}

export default VerificadorSancion_jja
