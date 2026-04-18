// ============================================================
// MisSolicitudesPage_jja.jsx — Historial de solicitudes del cliente
// Tabs, filtros, cancelación, timeline de estados
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect, useMemo } from 'react'
import { apiRequest } from '../../utils/api'
import StatusBadge_jja from '../../components/ui_jja/StatusBadge_jja'
import BotonAccion_jja from '../../components/ui_jja/BotonAccion_jja'
import ActionModal_jja from '../../components/ui_jja/ActionModal_jja'
import EmptyState_jja from '../../components/ui_jja/EmptyState_jja'
import { useModal_jja } from '../../context/ModalContext_jja'
import {
  IconoSolicitudes_jja, IconoCancelar_jja, IconoReloj_jja,
  IconoCheck_jja, IconoCerrar_jja, IconoBuscar_jja,
} from '../../components/ui_jja/Iconos_jja'

// Helper para resolver URL de imagen de activo
function resolverImgActivo(s) {
  const imgs = s.imagenes_jja
  if (imgs && Array.isArray(imgs) && imgs.length > 0) return imgs[0]
  if (typeof imgs === 'string') {
    try {
      const arr = JSON.parse(imgs)
      if (Array.isArray(arr) && arr.length > 0) return arr[0]
      return imgs
    } catch { return imgs }
  }
  return null
}

// Helper para extraer id del usuario
function extraerIdUsuario(meResp) {
  if (!meResp) return null
  if (meResp.datos) {
    if (meResp.datos.id_usuario_jja) return meResp.datos.id_usuario_jja
    if (meResp.datos.id) return meResp.datos.id
  }
  if (meResp.id_usuario_jja) return meResp.id_usuario_jja
  if (meResp.id) return meResp.id
  return null
}

const TABS_JJA = [
  { clave: 'todas', label: 'Todas' },
  { clave: 'pendiente', label: 'Pendientes' },
  { clave: 'aprobada', label: 'Aprobadas' },
  { clave: 'rechazada', label: 'Rechazadas' },
]

const MisSolicitudesPage_jja = () => {
  const { mostrarModal } = useModal_jja()
  const [solicitudes_jja, setSolicitudes_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)
  const [error_jja, setError_jja] = useState('')
  const [tabActivo_jja, setTabActivo_jja] = useState('todas')
  const [busqueda_jja, setBusqueda_jja] = useState('')
  const [fechaDesde_jja, setFechaDesde_jja] = useState('')
  const [fechaHasta_jja, setFechaHasta_jja] = useState('')
  const [orden_jja, setOrden_jja] = useState('reciente')

  // Modal cancelar
  const [modalCancelar_jja, setModalCancelar_jja] = useState(false)
  const [solicitudCancelar_jja, setSolicitudCancelar_jja] = useState(null)
  const [cancelando_jja, setCancelando_jja] = useState(false)

  useEffect(() => { cargarDatos() }, [])

  async function cargarDatos() {
    try {
      const me = await apiRequest('/auth/me')
      const myId = extraerIdUsuario(me)
      if (!myId) throw new Error('No se pudo determinar el ID de usuario')
      const data = await apiRequest(`/solicitudes-prestamo/cliente/${myId}`)
      const list = Array.isArray(data) ? data : (Array.isArray(data?.datos) ? data.datos : [])
      setSolicitudes_jja(list.sort((a, b) =>
        new Date(b.fecha_solicitud_jja) - new Date(a.fecha_solicitud_jja)
      ))
    } catch (err) { setError_jja(err.message || 'Error cargando solicitudes') }
    finally { setCargando_jja(false) }
  }

  // Filtrar por tab + búsqueda + fecha + orden
  const solicitudesFiltradas_jja = useMemo(() => {
    let lista = solicitudes_jja
    if (tabActivo_jja === 'aprobada') lista = lista.filter(s => ['aprobada', 'aceptada', 'en_proceso'].includes(s.estado_jja))
    else if (tabActivo_jja === 'rechazada') lista = lista.filter(s => ['rechazada', 'cancelada', 'fallido'].includes(s.estado_jja))
    else if (tabActivo_jja !== 'todas') lista = lista.filter(s => s.estado_jja === tabActivo_jja)

    if (busqueda_jja.trim()) {
      const term = busqueda_jja.toLowerCase()
      lista = lista.filter(s =>
        (s.producto_nombre || s.activo_nombre || '').toLowerCase().includes(term) ||
        (s.observaciones_jja || '').toLowerCase().includes(term)
      )
    }
    if (fechaDesde_jja) {
      const desde = new Date(fechaDesde_jja); desde.setHours(0, 0, 0, 0)
      lista = lista.filter(s => s.fecha_solicitud_jja && new Date(s.fecha_solicitud_jja) >= desde)
    }
    if (fechaHasta_jja) {
      const hasta = new Date(fechaHasta_jja); hasta.setHours(23, 59, 59, 999)
      lista = lista.filter(s => s.fecha_solicitud_jja && new Date(s.fecha_solicitud_jja) <= hasta)
    }
    lista = [...lista].sort((a, b) => {
      const fA = new Date(a.fecha_solicitud_jja || 0)
      const fB = new Date(b.fecha_solicitud_jja || 0)
      if (orden_jja === 'reciente') return fB - fA
      if (orden_jja === 'antiguo') return fA - fB
      if (orden_jja === 'nombre_asc') return (a.producto_nombre || '').localeCompare(b.producto_nombre || '')
      if (orden_jja === 'nombre_desc') return (b.producto_nombre || '').localeCompare(a.producto_nombre || '')
      return 0
    })
    return lista
  }, [solicitudes_jja, tabActivo_jja, busqueda_jja, fechaDesde_jja, fechaHasta_jja, orden_jja])

  // Contar por estado
  const conteos_jja = useMemo(() => ({
    todas: solicitudes_jja.length,
    pendiente: solicitudes_jja.filter(s => s.estado_jja === 'pendiente').length,
    aprobada: solicitudes_jja.filter(s => ['aprobada', 'aceptada', 'en_proceso'].includes(s.estado_jja)).length,
    rechazada: solicitudes_jja.filter(s => ['rechazada', 'cancelada', 'fallido'].includes(s.estado_jja)).length,
  }), [solicitudes_jja])

  // Cancelar solicitud
  const abrirCancelar = (solicitud) => {
    setSolicitudCancelar_jja(solicitud)
    setModalCancelar_jja(true)
  }

  const confirmarCancelar = async () => {
    if (!solicitudCancelar_jja) return
    setCancelando_jja(true)
    try {
      let endpoint = `/solicitudes-prestamo/${solicitudCancelar_jja.id_solicitud_jja}/estado`
      if (solicitudCancelar_jja.tipo_jja === 'devolucion') {
        endpoint = `/solicitudes-devolucion/${solicitudCancelar_jja.id_solicitud_jja}/estado`
      }

      await apiRequest(endpoint, {
        method: 'PATCH',
        body: JSON.stringify({ estado: 'cancelada', tipo: solicitudCancelar_jja.tipo_jja })
      })
      setModalCancelar_jja(false)
      cargarDatos()
    } catch (err) { mostrarModal({ mensaje: 'Error: ' + err.message, tipo: 'error' }) }
    finally { setCancelando_jja(false) }
  }

  // Formatear fecha
  const formatearFecha = (f) => {
    if (!f) return '—'
    const d = new Date(f)
    return d.toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const formatearHora = (f) => {
    if (!f) return ''
    const d = new Date(f)
    return d.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
  }

  // Icono del estado
  const iconoEstado = (estado) => {
    switch (estado) {
      case 'pendiente': return <IconoReloj_jja style={{ fontSize: '1.2rem', color: 'var(--color-advertencia-jja)' }} />
      case 'aprobada': case 'aceptada': return <IconoCheck_jja style={{ fontSize: '1.2rem', color: 'var(--color-exito-jja)' }} />
      case 'rechazada': return <IconoCerrar_jja style={{ fontSize: '1.2rem', color: 'var(--color-error-jja)' }} />
      case 'cancelada': return <IconoCancelar_jja style={{ fontSize: '1.2rem', color: 'var(--texto-terciario-jja)' }} />
      default: return <IconoSolicitudes_jja style={{ fontSize: '1.2rem' }} />
    }
  }

  if (error_jja) {
    return (
      <div>
        <div className="pagina-header-jja">
          <div>
            <h1 className="pagina-titulo-jja">Mis Solicitudes</h1>
            <p className="pagina-subtitulo-jja">Error al cargar las solicitudes</p>
          </div>
        </div>
        <EmptyState_jja
          icono={<IconoCerrar_jja style={{ fontSize: '3rem', color: 'var(--color-error-jja)' }} />}
          titulo="Error"
          descripcion={error_jja}
        />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja">Mis Solicitudes</h1>
          <p className="pagina-subtitulo-jja">Historial de solicitudes realizadas</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-jja">
        {TABS_JJA.map(t => (
          <button
            key={t.clave}
            className={`tab-btn-jja ${tabActivo_jja === t.clave ? 'activo-jja' : ''}`}
            onClick={() => setTabActivo_jja(t.clave)}
          >
            {t.label}
            {conteos_jja[t.clave] > 0 && (
              <span className="sidebar-item-badge-jja" style={{ marginLeft: 6, fontSize: '0.68rem' }}>
                {conteos_jja[t.clave]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filtros de búsqueda */}
      <div className="filtros-busqueda-jja" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', margin: '16px 0' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--texto-terciario-jja)', display: 'flex' }}>
            <IconoBuscar_jja />
          </span>
          <input
            type="text"
            value={busqueda_jja}
            onChange={(e) => setBusqueda_jja(e.target.value)}
            placeholder="Buscar por nombre de activo..."
            className="form-input-jja"
            style={{ paddingLeft: 38, fontSize: '0.88rem' }}
          />
        </div>
        <input
          type="date"
          value={fechaDesde_jja}
          onChange={(e) => setFechaDesde_jja(e.target.value)}
          className="form-input-jja"
          style={{ width: 'auto', fontSize: '0.85rem' }}
          title="Desde fecha"
        />
        <input
          type="date"
          value={fechaHasta_jja}
          onChange={(e) => setFechaHasta_jja(e.target.value)}
          className="form-input-jja"
          style={{ width: 'auto', fontSize: '0.85rem' }}
          title="Hasta fecha"
        />
        <select
          value={orden_jja}
          onChange={(e) => setOrden_jja(e.target.value)}
          className="form-input-jja"
          style={{ width: 'auto', fontSize: '0.85rem', cursor: 'pointer' }}
        >
          <option value="reciente">Más reciente</option>
          <option value="antiguo">Más antiguo</option>
          <option value="nombre_asc">Nombre A-Z</option>
          <option value="nombre_desc">Nombre Z-A</option>
        </select>
        {(busqueda_jja || fechaDesde_jja || fechaHasta_jja) && (
          <button
            onClick={() => { setBusqueda_jja(''); setFechaDesde_jja(''); setFechaHasta_jja('') }}
            className="btn-jja btn-ghost-jja"
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            Limpiar
          </button>
        )}
        <span style={{ fontSize: '0.82rem', color: 'var(--texto-terciario-jja)', marginLeft: 'auto' }}>
          {solicitudesFiltradas_jja.length} resultado{solicitudesFiltradas_jja.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Lista de solicitudes */}
      {cargando_jja ? (
        <div className="solicitudes-lista-jja">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="solicitud-card-jja">
              <div style={{ display: 'flex', gap: 16, padding: 20 }}>
                <div className="skeleton-jja" style={{ width: 56, height: 56, borderRadius: 12 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton-jja" style={{ height: 18, width: '50%', marginBottom: 8 }} />
                  <div className="skeleton-jja" style={{ height: 14, width: '30%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : solicitudesFiltradas_jja.length === 0 ? (
        <EmptyState_jja
          icono={<IconoSolicitudes_jja style={{ fontSize: '3rem' }} />}
          titulo="Sin solicitudes"
          descripcion={tabActivo_jja === 'todas'
            ? 'Aún no has realizado ninguna solicitud. Visita el Marketplace para solicitar activos.'
            : `No tienes solicitudes con estado "${tabActivo_jja}".`}
        />
      ) : (
        <div className="solicitudes-lista-jja">
          {solicitudesFiltradas_jja.map(s => {
            const imgUrl = resolverImgActivo(s)
            return (
              <div key={`${s.tipo_jja || 'prestamo'}-${s.id_solicitud_jja}`} className="solicitud-card-jja">
                <div className="solicitud-card-contenido-jja">
                  {/* Imagen del activo o Icono estado */}
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt="Activo"
                      style={{
                        width: 68, height: 68, borderRadius: 10, objectFit: 'contain', flexShrink: 0,
                        border: '2px solid var(--borde-jja)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        background: '#f1f5f9'
                      }}
                    />
                  ) : (
                    <div className="solicitud-card-icono-jja">
                      {iconoEstado(s.estado_jja)}
                    </div>
                  )}

                  {/* Info principal */}
                  <div className="solicitud-card-info-jja">
                    <div className="solicitud-card-nombre-jja" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      {s.producto_nombre || s.activo_nombre || 'Activo'}
                      <span style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--color-primario-jja)', border: '1px solid var(--color-primario-jja)', padding: '2px 8px', borderRadius: 12 }}>
                        {s.tipo_solicitud || 'Préstamo de Activo'}
                      </span>
                    </div>
                    <div className="solicitud-card-meta-jja" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginTop: 4 }}>
                      <span>Cantidad: {s.cantidad_jja || 1}</span>
                      <span style={{ color: 'var(--texto-terciario-jja)' }}>·</span>
                      <span>📅 {formatearFecha(s.fecha_solicitud_jja)}</span>
                      <span style={{ color: 'var(--texto-terciario-jja)' }}>·</span>
                      <span>🕐 {formatearHora(s.fecha_solicitud_jja)}</span>
                    </div>
                    {s.id_activo_jja && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--texto-terciario-jja)', marginTop: 3 }}>
                        ID Activo: {s.id_activo_jja}
                      </div>
                    )}
                    {s.observaciones_jja && (
                      <div className="solicitud-card-obs-jja" style={{ marginTop: 4 }}>
                        💬 {s.observaciones_jja}
                      </div>
                    )}
                    {s.fecha_respuesta_jja && (
                      <div className="solicitud-card-respuesta-jja" style={{ marginTop: 3 }}>
                        ✅ Respondido: {formatearFecha(s.fecha_respuesta_jja)} a las {formatearHora(s.fecha_respuesta_jja)}
                      </div>
                    )}
                  </div>

                  {/* Estado + acciones */}
                  <div className="solicitud-card-acciones-jja">
                    <StatusBadge_jja estado={s.estado_jja} />
                    {(s.estado_jja === 'pendiente' || s.estado_jja === 'en_proceso') && (
                      <BotonAccion_jja
                        variante="ghost"
                        tamaño="sm"
                        icono={<IconoCancelar_jja />}
                        onClick={() => abrirCancelar(s)}
                      >
                        Cancelar
                      </BotonAccion_jja>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal confirmar cancelación */}
      <ActionModal_jja
        visible={modalCancelar_jja}
        titulo="Cancelar Solicitud"
        onCerrar={() => setModalCancelar_jja(false)}
        onConfirmar={confirmarCancelar}
        textoConfirmar="Sí, Cancelar"
        variante="error"
        cargando={cancelando_jja}
        ancho="420px"
      >
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <IconoCancelar_jja style={{ fontSize: '3rem', color: 'var(--color-error-jja)', marginBottom: 12 }} />
          <p style={{ fontSize: '0.95rem', color: 'var(--texto-primario-jja)', fontWeight: 600, marginBottom: 6 }}>
            ¿Estás seguro?
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--texto-secundario-jja)' }}>
            Esta acción cancelará tu solicitud para "{solicitudCancelar_jja?.producto_nombre || 'este activo'}".
          </p>
        </div>
      </ActionModal_jja>
    </div>
  )
}

export default MisSolicitudesPage_jja
