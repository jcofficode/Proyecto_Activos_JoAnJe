// ============================================================
// MisPrestamosPage_jja.jsx — Préstamos del usuario (todos los roles)
// Tabs por estado, alertas vencimiento, solicitar devolución
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect, useMemo } from 'react'
import { apiRequest } from '../../utils/api'
import StatusBadge_jja from '../../components/ui_jja/StatusBadge_jja'
import BotonAccion_jja from '../../components/ui_jja/BotonAccion_jja'
import ActionModal_jja from '../../components/ui_jja/ActionModal_jja'
import EmptyState_jja from '../../components/ui_jja/EmptyState_jja'
import FormGroup_jja from '../../components/ui_jja/FormGroup_jja'
import { useModal_jja } from '../../context/ModalContext_jja'
import {
  IconoPrestamo_jja, IconoDevolucion_jja, IconoReloj_jja,
  IconoAlertaTriangulo_jja,
} from '../../components/ui_jja/Iconos_jja'

// Helper para resolver URL de imagen de activo
function resolverImgActivo(raw) {
  const imgs = raw?.imagenes_jja
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

const TABS_JJA = [
  { clave: 'activos', label: 'Activos' },
  { clave: 'devueltos', label: 'Devueltos' },
  { clave: 'todos', label: 'Todos' },
]

const MisPrestamosPage_jja = () => {
  const { mostrarModal } = useModal_jja()
  const [prestamos_jja, setPrestamos_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)
  const [tabActivo_jja, setTabActivo_jja] = useState('activos')

  // Modal devolución
  const [modalDevolucion_jja, setModalDevolucion_jja] = useState(false)
  const [prestamoDevolucion_jja, setPrestamoDevolucion_jja] = useState(null)
  const [observacionesDevolucion_jja, setObservacionesDevolucion_jja] = useState('')
  const [enviando_jja, setEnviando_jja] = useState(false)

  useEffect(() => { cargarDatos() }, [])

  async function cargarDatos() {
    try {
      const me = await apiRequest('/auth/me')
      const myId = me.datos?.id_usuario_jja || me.id_usuario_jja || me.datos?.id || me.id
      if (!myId) throw new Error('No se pudo determinar tu usuario')

      const [prestamosResp, prestamosProductosResp] = await Promise.allSettled([
        apiRequest(`/prestamos/usuario/${myId}`),
        apiRequest(`/prestamos-productos/usuario/${myId}`),
      ])

      const prestamos = extraerPrestamos(prestamosResp)
      const prestamosProd = extraerPrestamos(prestamosProductosResp)

      // Normalizar y combinar
      const combinados = [
        ...prestamos.map(p => ({
          tipo: 'activo',
          id: p.id_prestamo_jja,
          nombre: p.nombre_activo_jja || p.activo_nombre_jja || p.nombre_jja || `Activo #${p.id_activo_jja}`,
          estado: p.estado_prestamo_jja,
          fechaPrestamo: p.fecha_prestamo_jja,
          fechaDevolucion: p.fecha_devolucion_jja || p.fecha_limite_jja,
          raw: p,
        })),
        ...prestamosProd.map(pp => ({
          tipo: 'producto',
          id: pp.id_prestamo_producto_jja,
          nombre: pp.producto_nombre || `Producto #${pp.id_producto_jja}`,
          estado: pp.estado_jja,
          fechaPrestamo: pp.fecha_prestamo_jja,
          fechaDevolucion: pp.fecha_devolucion_jja,
          raw: pp,
        })),
      ].sort((a, b) => new Date(b.fechaPrestamo) - new Date(a.fechaPrestamo))

      setPrestamos_jja(combinados)
    } catch (err) { console.error(err) }
    finally { setCargando_jja(false) }
  }

  function extraerPrestamos(r) {
    if (r.status !== 'fulfilled') return []
    const d = r.value
    if (Array.isArray(d)) return d
    if (d?.prestamos && Array.isArray(d.prestamos)) return d.prestamos
    if (d?.datos && Array.isArray(d.datos)) return d.datos
    return []
  }

  // Calcular estado vencimiento
  function estadoVencimiento(prestamo) {
    if (prestamo.estado !== 'activo') return null
    if (!prestamo.fechaDevolucion) return null
    const hoy = new Date()
    const limite = new Date(prestamo.fechaDevolucion)
    const diffDias = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24))
    if (diffDias < 0) return { tipo: 'vencido', dias: Math.abs(diffDias) }
    if (diffDias <= 3) return { tipo: 'proximo', dias: diffDias }
    return null
  }

  // Filtrar por tab
  const prestamosFiltrados_jja = useMemo(() => {
    if (tabActivo_jja === 'todos') return prestamos_jja
    if (tabActivo_jja === 'activos') return prestamos_jja.filter(p => p.estado === 'activo' || p.estado === 'vencido')
    if (tabActivo_jja === 'devueltos') return prestamos_jja.filter(p => p.estado === 'devuelto')
    return prestamos_jja
  }, [prestamos_jja, tabActivo_jja])

  // Conteos
  const conteos_jja = useMemo(() => ({
    activos: prestamos_jja.filter(p => p.estado === 'activo' || p.estado === 'vencido').length,
    devueltos: prestamos_jja.filter(p => p.estado === 'devuelto').length,
    todos: prestamos_jja.length,
  }), [prestamos_jja])

  // Solicitar devolución
  const abrirDevolucion = (prestamo) => {
    setPrestamoDevolucion_jja(prestamo)
    setObservacionesDevolucion_jja('')
    setModalDevolucion_jja(true)
  }

  const confirmarDevolucion = async () => {
    if (!prestamoDevolucion_jja) return
    setEnviando_jja(true)
    try {
      const endpoint = prestamoDevolucion_jja.tipo === 'activo'
        ? `/prestamos/${prestamoDevolucion_jja.id}/solicitud-devolucion`
        : `/prestamos-productos/${prestamoDevolucion_jja.id}/solicitud-devolucion`
      await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({ observaciones: observacionesDevolucion_jja || 'Solicitud de devolución' })
      })
      setModalDevolucion_jja(false)
      mostrarModal({ mensaje: 'Solicitud de devolución enviada exitosamente', tipo: 'success' })
      cargarDatos()
    } catch (err) { mostrarModal({ mensaje: 'Error: ' + err.message, tipo: 'error' }) }
    finally { setEnviando_jja(false) }
  }

  // Formatear fecha
  const formatearFecha = (f) => {
    if (!f) return '—'
    return new Date(f).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const formatearHora = (f) => {
    if (!f) return ''
    return new Date(f).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      {/* Header */}
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja">Mis Préstamos</h1>
          <p className="pagina-subtitulo-jja">Estado actual e historial de tus préstamos</p>
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

      {/* Lista de préstamos */}
      {cargando_jja ? (
        <div className="prestamos-lista-jja">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="prestamo-card-jja">
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
      ) : prestamosFiltrados_jja.length === 0 ? (
        <EmptyState_jja
          icono={<IconoPrestamo_jja style={{ fontSize: '3rem' }} />}
          titulo="Sin préstamos"
          descripcion={tabActivo_jja === 'todos'
            ? 'Aún no tienes préstamos. Solicita un activo desde el Marketplace.'
            : `No tienes préstamos con estado "${tabActivo_jja}".`}
        />
      ) : (
        <div className="prestamos-lista-jja">
          {prestamosFiltrados_jja.map(p => {
            const vencimiento = estadoVencimiento(p)
            const activoImg = resolverImgActivo(p.raw)
            return (
              <div key={`${p.tipo}-${p.id}`} className="prestamo-card-jja">
                {/* Alerta de vencimiento */}
                {vencimiento && vencimiento.tipo === 'vencido' && (
                  <div className="alerta-vencido-jja">
                    <IconoAlertaTriangulo_jja style={{ fontSize: '1rem' }} />
                    <span>
                      {vencimiento.dias === 1
                        ? 'Este préstamo venció ayer — Tienes 1 día de retraso'
                        : `Este préstamo está vencido — Tienes ${vencimiento.dias} días de retraso`}
                    </span>
                  </div>
                )}
                {vencimiento && vencimiento.tipo === 'proximo' && (
                  <div className="alerta-vencimiento-jja">
                    <IconoReloj_jja style={{ fontSize: '1rem' }} />
                    <span>
                      {vencimiento.dias === 0
                        ? '¡Este préstamo vence hoy! Devuélvelo antes de que finalice el día'
                        : vencimiento.dias === 1
                          ? 'Este préstamo vence mañana'
                          : `Este préstamo vence en ${vencimiento.dias} días`}
                    </span>
                  </div>
                )}

                <div className="prestamo-card-contenido-jja">
                  {/* Imagen del activo o icono */}
                  {activoImg ? (
                    <img
                      src={activoImg}
                      alt="Activo"
                      style={{
                        width: 56, height: 56, borderRadius: 10, objectFit: 'cover', flexShrink: 0,
                        border: '2px solid var(--borde-jja)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                      }}
                    />
                  ) : (
                    <div className="prestamo-card-icono-jja" style={{
                      background: p.estado === 'activo' ? 'var(--color-exito-bg-jja)' : p.estado === 'devuelto' ? 'var(--color-info-bg-jja)' : 'var(--color-error-bg-jja)',
                      color: p.estado === 'activo' ? 'var(--color-exito-jja)' : p.estado === 'devuelto' ? 'var(--color-info-jja)' : 'var(--color-error-jja)',
                    }}>
                      <IconoPrestamo_jja style={{ fontSize: '1.2rem' }} />
                    </div>
                  )}

                  {/* Info */}
                  <div className="prestamo-card-info-jja">
                    <div className="prestamo-card-nombre-jja">{p.nombre}</div>
                    <div className="prestamo-card-meta-jja" style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', marginTop: 3 }}>
                      <span className="prestamo-card-tipo-badge-jja">
                        {p.tipo === 'activo' ? 'Activo' : 'Producto'}
                      </span>
                      <span style={{ color: 'var(--texto-terciario-jja)' }}>·</span>
                      <span>📅 {formatearFecha(p.fechaPrestamo)}</span>
                      <span style={{ color: 'var(--texto-terciario-jja)' }}>·</span>
                      <span>🕐 {formatearHora(p.fechaPrestamo)}</span>
                    </div>
                    {p.fechaDevolucion && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--texto-terciario-jja)', marginTop: 3 }}>
                        🔄 Límite devolución: {formatearFecha(p.fechaDevolucion)}
                      </div>
                    )}
                    {p.raw?.nombre_tipo_jja && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--texto-terciario-jja)', marginTop: 2 }}>
                        Tipo: {p.raw.nombre_tipo_jja}
                      </div>
                    )}
                  </div>

                  {/* Estado + acciones */}
                  <div className="prestamo-card-acciones-jja">
                    <StatusBadge_jja estado={p.estado} />
                    {(p.estado === 'activo' || p.estado === 'vencido') && (
                      <BotonAccion_jja
                        variante={p.estado === 'vencido' ? 'advertencia' : 'info'}
                        tamaño="sm"
                        icono={<IconoDevolucion_jja />}
                        onClick={() => abrirDevolucion(p)}
                      >
                        Devolver
                      </BotonAccion_jja>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal devolución */}
      <ActionModal_jja
        visible={modalDevolucion_jja}
        titulo="Solicitar Devolución"
        onCerrar={() => setModalDevolucion_jja(false)}
        onConfirmar={confirmarDevolucion}
        textoConfirmar="Solicitar Devolución"
        variante="info"
        cargando={enviando_jja}
        ancho="480px"
      >
        {prestamoDevolucion_jja && (
          <div>
            <div style={{
              background: 'var(--bg-principal-jja)', borderRadius: 'var(--border-radius-sm-jja)',
              padding: 16, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center'
            }}>
              {(() => {
                const img = resolverImgActivo(prestamoDevolucion_jja.raw)
                return img ? (
                  <img src={img} alt="Activo" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '2px solid var(--borde-jja)' }} />
                ) : (
                  <IconoDevolucion_jja style={{ fontSize: '1.5rem', color: 'var(--color-info-jja)' }} />
                )
              })()}
              <div>
                <div style={{ fontWeight: 700 }}>{prestamoDevolucion_jja.nombre}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--texto-secundario-jja)' }}>
                  Préstamo #{prestamoDevolucion_jja.id} · {prestamoDevolucion_jja.tipo === 'activo' ? 'Activo' : 'Producto'}
                </div>
              </div>
            </div>
            <FormGroup_jja
              label="Observaciones"
              nombre="observaciones"
              tipo="textarea"
              valor={observacionesDevolucion_jja}
              onChange={(_, v) => setObservacionesDevolucion_jja(v)}
              placeholder="Describe el estado del activo al momento de devolverlo..."
              helper="Opcional: información adicional sobre la devolución"
            />
          </div>
        )}
      </ActionModal_jja>
    </div>
  )
}

export default MisPrestamosPage_jja
