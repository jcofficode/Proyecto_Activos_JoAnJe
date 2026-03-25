// ============================================================
// NotificacionesPage_jja.jsx — Centro de notificaciones
// Compartido por los 3 roles
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect } from 'react'
import { apiRequest } from '../../utils/api'
import BotonAccion_jja from '../../components/ui_jja/BotonAccion_jja'
import EmptyState_jja from '../../components/ui_jja/EmptyState_jja'
import {
  IconoNotificacion_jja, IconoAlertas_jja, IconoCheck_jja,
  IconoReloj_jja, IconoAlertaTriangulo_jja, IconoSolicitudes_jja,
} from '../../components/ui_jja/Iconos_jja'

// Icono según tipo de notificación
function iconoTipo(tipo) {
  switch (tipo) {
    case 'vencimiento': return <IconoReloj_jja style={{ color: 'var(--color-advertencia-jja)' }} />
    case 'aprobacion': case 'confirmacion': return <IconoCheck_jja style={{ color: 'var(--color-exito-jja)' }} />
    case 'rechazo': return <IconoAlertaTriangulo_jja style={{ color: 'var(--color-error-jja)' }} />
    case 'solicitud': return <IconoSolicitudes_jja style={{ color: 'var(--color-info-jja)' }} />
    default: return <IconoAlertas_jja style={{ color: 'var(--color-primario-jja)' }} />
  }
}

const NotificacionesPage_jja = () => {
  const [notificaciones_jja, setNotificaciones_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)

  useEffect(() => { cargarDatos() }, [])

  async function cargarDatos() {
    try {
      const me = await apiRequest('/auth/me')
      const myId = me.datos?.id_usuario_jja || me.id_usuario_jja || me.datos?.id || me.id
      if (!myId) return
      const data = await apiRequest(`/notificaciones/usuario/${myId}`)
      const list = Array.isArray(data) ? data : (data?.datos || [])
      setNotificaciones_jja(list.sort((a, b) =>
        new Date(b.creado_en_jja || b.fecha_jja) - new Date(a.creado_en_jja || a.fecha_jja)
      ))
    } catch (err) {
      console.error('Error cargando notificaciones:', err)
      // Si el endpoint no existe, mostrar lista vacía
      setNotificaciones_jja([])
    }
    finally { setCargando_jja(false) }
  }

  const marcarLeida = async (notif) => {
    try {
      await apiRequest(`/notificaciones/${notif.id_notificacion_jja}/leer`, { method: 'PATCH' })
      cargarDatos()
    } catch (err) { console.error(err) }
  }

  const marcarTodasLeidas = async () => {
    try {
      const me = await apiRequest('/auth/me')
      const myId = me.datos?.id_usuario_jja || me.id_usuario_jja || me.datos?.id || me.id
      await apiRequest(`/notificaciones/usuario/${myId}/leer-todas`, { method: 'PATCH' })
      cargarDatos()
    } catch (err) { console.error(err) }
  }

  // Formatear fecha relativa
  const formatearFechaRelativa = (f) => {
    if (!f) return ''
    const ahora = new Date()
    const fecha = new Date(f)
    const diffMs = ahora - fecha
    const diffMin = Math.floor(diffMs / 60000)
    const diffHoras = Math.floor(diffMin / 60)
    const diffDias = Math.floor(diffHoras / 24)

    if (diffMin < 1) return 'Justo ahora'
    if (diffMin < 60) return `Hace ${diffMin} min`
    if (diffHoras < 24) return `Hace ${diffHoras}h`
    if (diffDias < 7) return `Hace ${diffDias} día${diffDias > 1 ? 's' : ''}`
    return fecha.toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const noLeidas = notificaciones_jja.filter(n => !n.leida_jja).length

  return (
    <div>
      {/* Header */}
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja">Notificaciones</h1>
          <p className="pagina-subtitulo-jja">
            Centro de alertas y mensajes del sistema
            {noLeidas > 0 && ` · ${noLeidas} sin leer`}
          </p>
        </div>
        {noLeidas > 0 && (
          <div className="pagina-acciones-jja">
            <BotonAccion_jja
              variante="ghost"
              tamaño="sm"
              icono={<IconoCheck_jja />}
              onClick={marcarTodasLeidas}
            >
              Marcar todas como leídas
            </BotonAccion_jja>
          </div>
        )}
      </div>

      {/* Lista */}
      {cargando_jja ? (
        <div className="notificaciones-lista-jja">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="notificacion-item-jja">
              <div style={{ display: 'flex', gap: 14, padding: 16 }}>
                <div className="skeleton-jja" style={{ width: 40, height: 40, borderRadius: 10 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton-jja" style={{ height: 16, width: '60%', marginBottom: 6 }} />
                  <div className="skeleton-jja" style={{ height: 12, width: '40%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notificaciones_jja.length === 0 ? (
        <EmptyState_jja
          icono={<IconoNotificacion_jja style={{ fontSize: '3rem' }} />}
          titulo="Sin notificaciones"
          descripcion="No tienes notificaciones en este momento. Las alertas y confirmaciones aparecerán aquí."
        />
      ) : (
        <div className="notificaciones-lista-jja">
          {notificaciones_jja.map(n => (
            <div
              key={n.id_notificacion_jja}
              className={`notificacion-item-jja ${!n.leida_jja ? 'notificacion-no-leida-jja' : ''}`}
              onClick={() => !n.leida_jja && marcarLeida(n)}
              style={{ cursor: !n.leida_jja ? 'pointer' : 'default' }}
            >
              <div className="notificacion-contenido-jja">
                {/* Icono */}
                <div className="notificacion-icono-jja">
                  {iconoTipo(n.tipo_jja)}
                </div>

                {/* Texto */}
                <div className="notificacion-texto-jja">
                  <div className="notificacion-titulo-jja">{n.titulo_jja || 'Notificación'}</div>
                  <div className="notificacion-mensaje-jja">{n.mensaje_jja || ''}</div>
                  <div className="notificacion-fecha-jja">
                    {formatearFechaRelativa(n.creado_en_jja || n.fecha_jja)}
                  </div>
                </div>

                {/* Indicador no leída */}
                {!n.leida_jja && (
                  <div className="notificacion-punto-jja" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificacionesPage_jja
