// ============================================================
// PrestamosPage_jja.jsx — Vista de Todos los Préstamos
// Admin y Encargado pueden ver el historial completo de préstamos
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect, useMemo } from 'react'
import { apiRequest } from '../../utils/api'
import DataTable_jja from '../../components/ui_jja/DataTable_jja'
import StatusBadge_jja from '../../components/ui_jja/StatusBadge_jja'
import KpiCard_jja from '../../components/ui_jja/KpiCard_jja'
import ActionModal_jja from '../../components/ui_jja/ActionModal_jja'
import {
  IconoPrestamo_jja, IconoCheck_jja, IconoReloj_jja,
  IconoAlertaTriangulo_jja, IconoBuscar_jja, IconoInventario_jja,
} from '../../components/ui_jja/Iconos_jja'

// Helper para resolver URL de imagen de activo
function resolverImgActivo_jja(fila) {
  const imgs = fila.imagenes_jja
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

// Colores para avatares
const COLORES_AVATAR_JJA = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4']
function hashStr_jja(s) { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i); return h }
function colorAvatar_jja(nombre) { return COLORES_AVATAR_JJA[Math.abs(hashStr_jja(nombre || '')) % COLORES_AVATAR_JJA.length] }

const PrestamosPage_jja = () => {
  const [prestamos_jja, setPrestamos_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)
  const [tabActivo_jja, setTabActivo_jja] = useState('todos')

  // Filtros
  const [busqueda_jja, setBusqueda_jja] = useState('')
  const [fechaDesde_jja, setFechaDesde_jja] = useState('')
  const [fechaHasta_jja, setFechaHasta_jja] = useState('')
  const [orden_jja, setOrden_jja] = useState('reciente')

  // Modal detalle
  const [modalDetalle_jja, setModalDetalle_jja] = useState({ visible: false, prestamo: null })

  useEffect(() => {
    cargarPrestamos_jja()
  }, [])

  async function cargarPrestamos_jja() {
    setCargando_jja(true)
    try {
      const resp_jja = await apiRequest('/prestamos')
      const datos_jja = Array.isArray(resp_jja) ? resp_jja : (Array.isArray(resp_jja?.datos) ? resp_jja.datos : [])
      setPrestamos_jja(datos_jja)
    } catch (err_jja) {
      console.error('Error al cargar préstamos:', err_jja)
    } finally {
      setCargando_jja(false)
    }
  }

  // ── KPIs ──
  const totalPrestamos_jja = prestamos_jja.length
  const prestamosActivos_jja = prestamos_jja.filter(p => (p.estado_prestamo_jja || '').toLowerCase() === 'activo')
  const prestamosDevueltos_jja = prestamos_jja.filter(p => (p.estado_prestamo_jja || '').toLowerCase() === 'devuelto')
  const prestamosVencidos_jja = prestamos_jja.filter(p => (p.estado_prestamo_jja || '').toLowerCase() === 'vencido')
  const prestamosPerdidos_jja = prestamos_jja.filter(p => (p.estado_prestamo_jja || '').toLowerCase() === 'perdido')

  // ── Filtrar por tab ──
  const prestamosPorTab_jja = useMemo(() => {
    switch (tabActivo_jja) {
      case 'activos': return prestamosActivos_jja
      case 'devueltos': return prestamosDevueltos_jja
      case 'vencidos': return prestamosVencidos_jja
      case 'perdidos': return prestamosPerdidos_jja
      default: return prestamos_jja
    }
  }, [tabActivo_jja, prestamos_jja])

  // ── Filtrar y ordenar ──
  const prestamosFiltrados_jja = useMemo(() => {
    let resultado = [...prestamosPorTab_jja]

    // Búsqueda por texto
    if (busqueda_jja.trim()) {
      const q = busqueda_jja.toLowerCase().trim()
      resultado = resultado.filter(p =>
        (p.activo_nombre_jja || '').toLowerCase().includes(q) ||
        (p.usuario_nombre_completo_jja || '').toLowerCase().includes(q) ||
        (p.encargado_nombre_jja || '').toLowerCase().includes(q) ||
        (p.cedula_jja || '').toLowerCase().includes(q) ||
        (p.codigo_qr_jja || '').toLowerCase().includes(q) ||
        (p.observaciones_jja || '').toLowerCase().includes(q)
      )
    }

    // Filtro por fecha desde
    if (fechaDesde_jja) {
      const desde = new Date(fechaDesde_jja)
      desde.setHours(0, 0, 0, 0)
      resultado = resultado.filter(p => {
        const fecha = new Date(p.fecha_prestamo_jja)
        return fecha >= desde
      })
    }

    // Filtro por fecha hasta
    if (fechaHasta_jja) {
      const hasta = new Date(fechaHasta_jja)
      hasta.setHours(23, 59, 59, 999)
      resultado = resultado.filter(p => {
        const fecha = new Date(p.fecha_prestamo_jja)
        return fecha <= hasta
      })
    }

    // Ordenamiento
    resultado.sort((a, b) => {
      switch (orden_jja) {
        case 'reciente':
          return new Date(b.fecha_prestamo_jja) - new Date(a.fecha_prestamo_jja)
        case 'antiguo':
          return new Date(a.fecha_prestamo_jja) - new Date(b.fecha_prestamo_jja)
        case 'activo_az':
          return (a.activo_nombre_jja || '').localeCompare(b.activo_nombre_jja || '')
        case 'activo_za':
          return (b.activo_nombre_jja || '').localeCompare(a.activo_nombre_jja || '')
        case 'usuario_az':
          return (a.usuario_nombre_completo_jja || '').localeCompare(b.usuario_nombre_completo_jja || '')
        case 'usuario_za':
          return (b.usuario_nombre_completo_jja || '').localeCompare(a.usuario_nombre_completo_jja || '')
        default:
          return 0
      }
    })

    return resultado
  }, [prestamosPorTab_jja, busqueda_jja, fechaDesde_jja, fechaHasta_jja, orden_jja])

  // ── Helpers de fecha ──
  const formatFecha_jja = (f) => {
    if (!f) return '—'
    return new Date(f).toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }
  const formatFechaHora_jja = (f) => {
    if (!f) return '—'
    const d = new Date(f)
    return d.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
  }

  // Limpiar filtros
  function limpiarFiltros_jja() {
    setBusqueda_jja('')
    setFechaDesde_jja('')
    setFechaHasta_jja('')
    setOrden_jja('reciente')
  }

  // ── Columnas de la tabla ──
  const columnas_jja = [
    {
      clave: 'activo_nombre_jja',
      titulo: 'Activo',
      render: (v, f) => {
        const imgUrl = resolverImgActivo_jja(f)
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={v}
                className="datatable-avatar-jja"
                style={{ objectFit: 'contain', border: '2px solid var(--borde-jja)', background: '#f1f5f9', borderRadius: 8 }}
              />
            ) : (
              <div style={{
                width: 50, height: 50, borderRadius: 8,
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
              }}>
                <IconoInventario_jja />
              </div>
            )}
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{v || 'Sin nombre'}</div>
              {f.codigo_qr_jja && (
                <div style={{ fontSize: '0.72rem', color: 'var(--texto-terciario-jja)' }}>QR: {f.codigo_qr_jja}</div>
              )}
            </div>
          </div>
        )
      }
    },
    {
      clave: 'usuario_nombre_completo_jja',
      titulo: 'Usuario',
      render: (v, f) => {
        const imgUrl = f.usuario_imagen || null
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={v}
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  objectFit: 'cover', flexShrink: 0,
                  border: '2px solid var(--borde-jja)',
                }}
              />
            ) : (
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: colorAvatar_jja(v),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0
              }}>
                {(v || '??').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>{v}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--texto-terciario-jja)' }}>CI: {f.cedula_jja}</div>
            </div>
          </div>
        )
      }
    },
    {
      clave: 'encargado_nombre_jja',
      titulo: 'Encargado',
      render: (v) => (
        <span style={{ fontSize: '0.86rem' }}>{v || '—'}</span>
      )
    },
    {
      clave: 'fecha_prestamo_jja',
      titulo: 'Fecha Préstamo',
      render: (v) => (
        <span style={{ fontSize: '0.84rem' }}>{formatFecha_jja(v)}</span>
      )
    },
    {
      clave: 'fecha_limite_jja',
      titulo: 'Fecha Límite',
      render: (v, f) => {
        const vencido = f.estado_prestamo_jja === 'activo' && v && new Date(v) < new Date()
        return (
          <span style={{ fontSize: '0.84rem', color: vencido ? '#dc2626' : undefined, fontWeight: vencido ? 600 : undefined }}>
            {formatFecha_jja(v)}
            {vencido && <span style={{ fontSize: '0.7rem', marginLeft: 4 }}>⚠️</span>}
          </span>
        )
      }
    },
    {
      clave: 'fecha_devolucion_jja',
      titulo: 'Devolución',
      render: (v) => v ? (
        <span style={{ fontSize: '0.84rem', color: '#10b981' }}>{formatFecha_jja(v)}</span>
      ) : (
        <span style={{ fontSize: '0.8rem', color: 'var(--texto-terciario-jja)' }}>Pendiente</span>
      )
    },
    {
      clave: 'estado_prestamo_jja',
      titulo: 'Estado',
      render: (v) => <StatusBadge_jja estado={v} />
    },
    {
      clave: 'acciones',
      titulo: '',
      render: (_, f) => (
        <button
          onClick={() => setModalDetalle_jja({ visible: true, prestamo: f })}
          style={{
            background: 'none', border: '1px solid var(--borde-jja)',
            borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
            fontSize: '0.78rem', color: 'var(--texto-principal-jja)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.target.style.background = 'var(--bg-hover-jja)' }}
          onMouseLeave={e => { e.target.style.background = 'none' }}
        >
          Detalle
        </button>
      )
    },
  ]

  // ── Tabs ──
  const tabs_jja = [
    { clave: 'todos', label: 'Todos', count: totalPrestamos_jja },
    { clave: 'activos', label: 'Activos', count: prestamosActivos_jja.length },
    { clave: 'devueltos', label: 'Devueltos', count: prestamosDevueltos_jja.length },
    { clave: 'vencidos', label: 'Vencidos', count: prestamosVencidos_jja.length },
    { clave: 'perdidos', label: 'Perdidos', count: prestamosPerdidos_jja.length },
  ]

  const tienesFiltros_jja = busqueda_jja || fechaDesde_jja || fechaHasta_jja || orden_jja !== 'reciente'

  return (
    <div>
      {/* ── Header ── */}
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconoPrestamo_jja style={{ fontSize: '1.3rem', color: 'var(--kpi-2-jja)' }} />
            Préstamos
          </h1>
          <p className="pagina-subtitulo-jja">
            Historial completo de préstamos de activos del sistema
          </p>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="kpi-grid-jja" style={{ marginBottom: 24 }}>
        <KpiCard_jja
          icono={<IconoPrestamo_jja />}
          valor={totalPrestamos_jja}
          etiqueta="Total Préstamos"
          color="var(--kpi-1-jja)"
          bgColor="var(--kpi-1-bg-jja)"
        />
        <KpiCard_jja
          icono={<IconoReloj_jja />}
          valor={prestamosActivos_jja.length}
          etiqueta="Activos"
          color="var(--kpi-2-jja)"
          bgColor="var(--kpi-2-bg-jja)"
        />
        <KpiCard_jja
          icono={<IconoCheck_jja />}
          valor={prestamosDevueltos_jja.length}
          etiqueta="Devueltos"
          color="#10b981"
          bgColor="rgba(16, 185, 129, 0.1)"
        />
        <KpiCard_jja
          icono={<IconoAlertaTriangulo_jja />}
          valor={prestamosVencidos_jja.length + prestamosPerdidos_jja.length}
          etiqueta="Vencidos / Perdidos"
          color="#dc2626"
          bgColor="rgba(220, 38, 38, 0.1)"
        />
      </div>

      {/* ── Tabs ── */}
      <div className="tabs-jja">
        {tabs_jja.map(t => (
          <button
            key={t.clave}
            className={`tab-btn-jja ${tabActivo_jja === t.clave ? 'activo-jja' : ''}`}
            onClick={() => setTabActivo_jja(t.clave)}
          >
            {t.label}
            {t.count > 0 && (
              <span className="sidebar-item-badge-jja" style={{
                marginLeft: 6,
                background: t.clave === 'vencidos' || t.clave === 'perdidos' ? '#dc2626' :
                  t.clave === 'activos' ? 'var(--kpi-2-jja)' : undefined
              }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Filtros ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
        padding: '16px 20px', margin: '0 0 4px',
        background: 'var(--bg-tarjeta-jja)', borderRadius: 'var(--border-radius-jja, 14px)',
        border: '1px solid var(--borde-jja)',
      }}>
        {/* Búsqueda */}
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--texto-terciario-jja)', fontSize: '0.9rem', pointerEvents: 'none' }}>
            <IconoBuscar_jja />
          </span>
          <input
            type="text"
            placeholder="Buscar activo, usuario, cédula, QR..."
            value={busqueda_jja}
            onChange={e => setBusqueda_jja(e.target.value)}
            style={{
              width: '100%', padding: '9px 14px 9px 36px',
              borderRadius: 'var(--border-radius-sm-jja, 10px)',
              border: '1px solid var(--borde-jja)', background: 'var(--bg-principal-jja)',
              color: 'var(--texto-principal-jja)', fontSize: '0.88rem', outline: 'none',
            }}
          />
        </div>

        {/* Fecha desde */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--texto-terciario-jja)', whiteSpace: 'nowrap' }}>Desde:</label>
          <input
            type="date"
            value={fechaDesde_jja}
            onChange={e => setFechaDesde_jja(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: 'var(--border-radius-sm-jja, 10px)',
              border: '1px solid var(--borde-jja)', background: 'var(--bg-principal-jja)',
              color: 'var(--texto-principal-jja)', fontSize: '0.85rem',
            }}
          />
        </div>

        {/* Fecha hasta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--texto-terciario-jja)', whiteSpace: 'nowrap' }}>Hasta:</label>
          <input
            type="date"
            value={fechaHasta_jja}
            onChange={e => setFechaHasta_jja(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: 'var(--border-radius-sm-jja, 10px)',
              border: '1px solid var(--borde-jja)', background: 'var(--bg-principal-jja)',
              color: 'var(--texto-principal-jja)', fontSize: '0.85rem',
            }}
          />
        </div>

        {/* Ordenar */}
        <select
          value={orden_jja}
          onChange={e => setOrden_jja(e.target.value)}
          style={{
            padding: '9px 14px', borderRadius: 'var(--border-radius-sm-jja, 10px)',
            border: '1px solid var(--borde-jja)', background: 'var(--bg-tarjeta-jja)',
            color: 'var(--texto-principal-jja)', fontSize: '0.85rem', cursor: 'pointer',
          }}
        >
          <option value="reciente">Más reciente</option>
          <option value="antiguo">Más antiguo</option>
          <option value="activo_az">Activo A→Z</option>
          <option value="activo_za">Activo Z→A</option>
          <option value="usuario_az">Usuario A→Z</option>
          <option value="usuario_za">Usuario Z→A</option>
        </select>

        {/* Limpiar */}
        {tienesFiltros_jja && (
          <button
            onClick={limpiarFiltros_jja}
            style={{
              padding: '8px 14px', borderRadius: 'var(--border-radius-sm-jja, 10px)',
              border: '1px solid var(--borde-jja)', background: 'transparent',
              color: 'var(--texto-terciario-jja)', fontSize: '0.82rem', cursor: 'pointer',
            }}
          >
            Limpiar filtros
          </button>
        )}

        {/* Contador */}
        <span style={{ fontSize: '0.8rem', color: 'var(--texto-terciario-jja)', marginLeft: 'auto' }}>
          {prestamosFiltrados_jja.length} resultado{prestamosFiltrados_jja.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Tabla ── */}
      <DataTable_jja
        columnas={columnas_jja}
        datos={prestamosFiltrados_jja}
        cargando={cargando_jja}
        placeholderBusqueda="Buscar en la tabla..."
      />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── Modal: Detalle del Préstamo ── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <ActionModal_jja
        visible={modalDetalle_jja.visible}
        titulo="Detalle del Préstamo"
        sinFooter={true}
        onCerrar={() => setModalDetalle_jja({ visible: false, prestamo: null })}
        ancho="560px"
      >
        {modalDetalle_jja.prestamo && (() => {
          const p = modalDetalle_jja.prestamo
          const imgActivo = resolverImgActivo_jja(p)
          const imgUsuario = p.usuario_imagen || null

          return (
            <div style={{ padding: '8px 0' }}>
              {/* Activo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                {imgActivo ? (
                  <img
                    src={imgActivo}
                    alt={p.activo_nombre_jja}
                    style={{
                      width: 70, height: 70, borderRadius: 12,
                      objectFit: 'contain', background: '#f1f5f9',
                      border: '2px solid var(--borde-jja)',
                    }}
                  />
                ) : (
                  <div style={{
                    width: 70, height: 70, borderRadius: 12,
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '1.5rem',
                  }}>
                    <IconoInventario_jja />
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{p.activo_nombre_jja}</div>
                  {p.codigo_qr_jja && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--texto-terciario-jja)', marginTop: 2 }}>
                      Código QR: {p.codigo_qr_jja}
                    </div>
                  )}
                  <div style={{ marginTop: 6 }}>
                    <StatusBadge_jja estado={p.estado_prestamo_jja} />
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px',
                background: 'var(--bg-principal-jja)', borderRadius: 12,
                padding: 16, border: '1px solid var(--borde-jja)',
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--texto-terciario-jja)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Usuario</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {imgUsuario ? (
                      <img src={imgUsuario} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: colorAvatar_jja(p.usuario_nombre_completo_jja),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                      }}>
                        {(p.usuario_nombre_completo_jja || '??').split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.usuario_nombre_completo_jja}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--texto-terciario-jja)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cédula</div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.cedula_jja || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--texto-terciario-jja)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Encargado</div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.encargado_nombre_jja || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--texto-terciario-jja)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha Préstamo</div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{formatFechaHora_jja(p.fecha_prestamo_jja)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--texto-terciario-jja)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha Límite</div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{formatFechaHora_jja(p.fecha_limite_jja)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--texto-terciario-jja)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Devolución</div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: p.fecha_devolucion_jja ? '#10b981' : 'var(--texto-terciario-jja)' }}>
                    {p.fecha_devolucion_jja ? formatFechaHora_jja(p.fecha_devolucion_jja) : 'Pendiente'}
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              {p.observaciones_jja && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--texto-terciario-jja)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Observaciones</div>
                  <div style={{
                    padding: '10px 14px', borderRadius: 10,
                    background: 'var(--bg-principal-jja)', border: '1px solid var(--borde-jja)',
                    fontSize: '0.88rem', lineHeight: 1.5,
                  }}>
                    {p.observaciones_jja}
                  </div>
                </div>
              )}

              {/* Botón cerrar */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <button
                  className="btn-jja btn-primario-jja"
                  onClick={() => setModalDetalle_jja({ visible: false, prestamo: null })}
                  style={{ width: '100%' }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )
        })()}
      </ActionModal_jja>
    </div>
  )
}

export default PrestamosPage_jja
