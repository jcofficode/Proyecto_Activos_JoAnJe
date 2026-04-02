// ============================================================
// AlertasPage_jja.jsx — Alertas y Notificaciones (Mejorada)
// Sistema JoAnJe Coders — Sufijo: _jja
// Muestra información detallada en lenguaje natural: nombre,
// foto de perfil, activo vencido, días de retraso, fecha.
// ============================================================
import React, { useState, useEffect } from 'react'
import { apiRequest } from '../../utils/api'
import StatusBadge_jja from '../../components/ui_jja/StatusBadge_jja'
import {
  IconoAlertas_jja, IconoReloj_jja,
  IconoAlertaTriangulo_jja, IconoCheck_jja,
} from '../../components/ui_jja/Iconos_jja'
import { API_BASE_JC } from '../../api.config'

const API_BASE_JJA = API_BASE_JC

const AlertasPage_jja = () => {
  const [tabActivo_jja, setTabActivo_jja] = useState('vencidos')
  const [prestamos_jja, setPrestamos_jja] = useState([])
  const [notificaciones_jja, setNotificaciones_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)

  useEffect(() => { cargarDatos() }, [])

  async function cargarDatos() {
    try {
      const [pResp, nResp] = await Promise.allSettled([
        apiRequest('/prestamos'),
        apiRequest('/notificaciones'),
      ])
      const prestamos = extraer(pResp)
      setPrestamos_jja(prestamos)
      setNotificaciones_jja(extraer(nResp))
    } catch (err) { console.error(err) }
    finally { setCargando_jja(false) }
  }
  function extraer(r) { if (r.status !== 'fulfilled') return []; const d = r.value; return Array.isArray(d) ? d : d?.datos || d?.prestamos || [] }

  // ── Filtrar vencidos y próximos a vencer ──
  // Usamos comparación por fecha (sin hora) para no marcar como vencido el mismo día
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const vencidos = prestamos_jja.filter(p => {
    if (p.estado_prestamo_jja === 'vencido') return true
    if (p.estado_prestamo_jja !== 'activo') return false
    const limite = new Date(p.fecha_limite_jja)
    limite.setHours(0, 0, 0, 0)
    return limite < hoy // Solo si la fecha límite ya PASÓ (no el mismo día)
  })

  const proximosAVencer = prestamos_jja.filter(p => {
    if (p.estado_prestamo_jja !== 'activo') return false
    const limite = new Date(p.fecha_limite_jja)
    limite.setHours(0, 0, 0, 0)
    const diffDias = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24))
    return diffDias >= 0 && diffDias <= 3 // Hoy (0) cuenta como "próximo", no como vencido
  })

  // ── Helpers para lenguaje natural ──
  function formatearFechaLarga(fechaStr) {
    if (!fechaStr) return '—'
    const f = new Date(fechaStr)
    const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    return f.toLocaleDateString('es-VE', opciones)
  }

  function textoTiempoVencido(fechaLimiteStr) {
    if (!fechaLimiteStr) return ''
    const limite = new Date(fechaLimiteStr)
    limite.setHours(0, 0, 0, 0)
    const ahora = new Date()
    ahora.setHours(0, 0, 0, 0)
    const diffMs = ahora - limite
    const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24))

    if (diffDias === 0) return 'Se vence hoy'
    if (diffDias === 1) return 'Venció ayer'
    if (diffDias > 1) return `Venció hace ${diffDias} días`
    if (diffDias === -1) return 'Vence mañana'
    return `Vence en ${Math.abs(diffDias)} días`
  }

  function textoTiempoRestante(fechaLimiteStr) {
    if (!fechaLimiteStr) return ''
    const limite = new Date(fechaLimiteStr)
    limite.setHours(0, 0, 0, 0)
    const ahora = new Date()
    ahora.setHours(0, 0, 0, 0)
    const diffMs = limite - ahora
    const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24))

    if (diffDias === 0) return 'Vence hoy'
    if (diffDias === 1) return 'Vence mañana'
    return `Vence en ${diffDias} días`
  }

  function obtenerIniciales(nombre) {
    if (!nombre) return '??'
    return nombre.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
  }

  function obtenerImagenUsuario(fila) {
    const img = fila.usuario_imagen || fila.usuario_imagen_jja
    if (img) return `${API_BASE_JJA}${img}`
    return null
  }

  function obtenerNombreUsuario(fila) {
    return fila.usuario_nombre_jja || fila.usuario_nombre_completo_jja || fila.nombre_usuario_jja || `Usuario ID ${fila.id_usuario_jja}`
  }

  function obtenerNombreActivo(fila) {
    return fila.activo_nombre_jja || fila.activo_nombre || fila.nombre_activo_jja || `Activo ID ${fila.id_activo_jja}`
  }

  // ── Tabs ──
  const tabs = [
    { clave: 'vencidos', label: 'Préstamos Vencidos', count: vencidos.length, icono: <IconoAlertaTriangulo_jja /> },
    { clave: 'proximos', label: 'Próximos a Vencer', count: proximosAVencer.length, icono: <IconoReloj_jja /> },
    { clave: 'notificaciones', label: 'Notificaciones', count: notificaciones_jja.length, icono: <IconoAlertas_jja /> },
  ]

  // ═══════════════════════════════════════
  // ── Render de tarjeta de préstamo vencido ──
  // ═══════════════════════════════════════
  function renderTarjetaVencido(p, idx) {
    const nombre = obtenerNombreUsuario(p)
    const activo = obtenerNombreActivo(p)
    const imgUrl = obtenerImagenUsuario(p)
    const fechaLimite = formatearFechaLarga(p.fecha_limite_jja)
    const textoVencido = textoTiempoVencido(p.fecha_limite_jja)

    const limite = new Date(p.fecha_limite_jja)
    limite.setHours(0, 0, 0, 0)
    const ahoraFecha = new Date()
    ahoraFecha.setHours(0, 0, 0, 0)
    const diasRetraso = Math.max(0, Math.round((ahoraFecha - limite) / (1000 * 60 * 60 * 24)))

    return (
      <div key={p.id_prestamo_jja || idx} style={estilos.tarjeta}>
        {/* Indicador lateral del nivel de urgencia */}
        <div style={{
          ...estilos.indicadorLateral,
          background: diasRetraso >= 5 ? '#dc2626' : diasRetraso >= 2 ? '#f59e0b' : '#ef4444',
        }} />

        <div style={estilos.tarjetaContenido}>
          {/* Fila principal con avatar y texto */}
          <div style={estilos.filaUsuario}>
            {imgUrl ? (
              <img src={imgUrl} alt={nombre} style={estilos.avatar} />
            ) : (
              <div style={estilos.avatarFallback}>
                {obtenerIniciales(nombre)}
              </div>
            )}
            <div style={estilos.infoUsuario}>
              <div style={estilos.nombreUsuario}>{nombre}</div>
              <div style={estilos.cedulaUsuario}>
                CI: {p.cedula_jja || '—'}
              </div>
            </div>

            {/* Badge de estado */}
            <div style={{
              ...estilos.badgeVencido,
              background: diasRetraso >= 5 ? 'rgba(220, 38, 38, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              color: diasRetraso >= 5 ? '#dc2626' : '#f59e0b',
              border: `1px solid ${diasRetraso >= 5 ? 'rgba(220, 38, 38, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: diasRetraso >= 5 ? '#dc2626' : '#f59e0b',
                display: 'inline-block',
              }} />
              {textoVencido}
            </div>
          </div>

          {/* Descripción en lenguaje natural */}
          <div style={estilos.descripcionNatural}>
            <strong>{nombre}</strong> tiene el activo <strong>"{activo}"</strong> vencido
            {diasRetraso > 0 && <> desde hace <strong style={{ color: '#dc2626' }}>{diasRetraso} {diasRetraso === 1 ? 'día' : 'días'}</strong></>}.
            {diasRetraso === 0 && <> (<em>se vence hoy</em>)</>}
          </div>

          {/* Detalles de fecha */}
          <div style={estilos.detallesGrid}>
            <div style={estilos.detalle}>
              <span style={estilos.detalleLabel}>📦 Activo</span>
              <span style={estilos.detalleValor}>{activo}</span>
            </div>
            <div style={estilos.detalle}>
              <span style={estilos.detalleLabel}>📅 Fecha límite</span>
              <span style={estilos.detalleValor}>{fechaLimite}</span>
            </div>
            <div style={estilos.detalle}>
              <span style={estilos.detalleLabel}>⏱️ Días de retraso</span>
              <span style={{
                ...estilos.detalleValor,
                color: diasRetraso >= 5 ? '#dc2626' : diasRetraso >= 2 ? '#f59e0b' : 'var(--texto-principal-jja)',
                fontWeight: 700,
              }}>
                {diasRetraso > 0 ? `+${diasRetraso} ${diasRetraso === 1 ? 'día' : 'días'}` : 'Hoy'}
              </span>
            </div>
            <div style={estilos.detalle}>
              <span style={estilos.detalleLabel}>🆔 Préstamo</span>
              <span style={estilos.detalleValor}>#{p.id_prestamo_jja}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════
  // ── Render de tarjeta próximo a vencer ──
  // ═══════════════════════════════════════
  function renderTarjetaProximo(p, idx) {
    const nombre = obtenerNombreUsuario(p)
    const activo = obtenerNombreActivo(p)
    const imgUrl = obtenerImagenUsuario(p)
    const fechaLimite = formatearFechaLarga(p.fecha_limite_jja)
    const textoRestante = textoTiempoRestante(p.fecha_limite_jja)

    const limite = new Date(p.fecha_limite_jja)
    limite.setHours(0, 0, 0, 0)
    const ahoraFecha = new Date()
    ahoraFecha.setHours(0, 0, 0, 0)
    const diasRestantes = Math.max(0, Math.round((limite - ahoraFecha) / (1000 * 60 * 60 * 24)))

    const esHoy = diasRestantes === 0

    return (
      <div key={p.id_prestamo_jja || idx} style={estilos.tarjeta}>
        <div style={{
          ...estilos.indicadorLateral,
          background: esHoy ? '#f59e0b' : diasRestantes === 1 ? '#fb923c' : '#3b82f6',
        }} />

        <div style={estilos.tarjetaContenido}>
          <div style={estilos.filaUsuario}>
            {imgUrl ? (
              <img src={imgUrl} alt={nombre} style={{
                ...estilos.avatar,
                border: `2px solid ${esHoy ? '#f59e0b' : '#3b82f6'}`,
              }} />
            ) : (
              <div style={{
                ...estilos.avatarFallback,
                background: esHoy
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              }}>
                {obtenerIniciales(nombre)}
              </div>
            )}
            <div style={estilos.infoUsuario}>
              <div style={estilos.nombreUsuario}>{nombre}</div>
              <div style={estilos.cedulaUsuario}>
                CI: {p.cedula_jja || '—'}
              </div>
            </div>

            <div style={{
              ...estilos.badgeVencido,
              background: esHoy ? 'rgba(245, 158, 11, 0.12)' : 'rgba(59, 130, 246, 0.12)',
              color: esHoy ? '#f59e0b' : '#3b82f6',
              border: `1px solid ${esHoy ? 'rgba(245, 158, 11, 0.25)' : 'rgba(59, 130, 246, 0.25)'}`,
            }}>
              <IconoReloj_jja style={{ fontSize: '0.75rem' }} />
              {textoRestante}
            </div>
          </div>

          <div style={estilos.descripcionNatural}>
            El activo <strong>"{activo}"</strong> prestado a <strong>{nombre}</strong>{' '}
            {esHoy ? (
              <><strong style={{ color: '#f59e0b' }}>se vence hoy</strong>. Es importante recordarle la devolución.</>
            ) : diasRestantes === 1 ? (
              <><strong style={{ color: '#fb923c' }}>vence mañana</strong>. Se recomienda enviar un recordatorio.</>
            ) : (
              <>vence en <strong style={{ color: '#3b82f6' }}>{diasRestantes} días</strong> ({fechaLimite}).</>
            )}
          </div>

          <div style={estilos.detallesGrid}>
            <div style={estilos.detalle}>
              <span style={estilos.detalleLabel}>📦 Activo</span>
              <span style={estilos.detalleValor}>{activo}</span>
            </div>
            <div style={estilos.detalle}>
              <span style={estilos.detalleLabel}>📅 Fecha límite</span>
              <span style={estilos.detalleValor}>{fechaLimite}</span>
            </div>
            <div style={estilos.detalle}>
              <span style={estilos.detalleLabel}>⏳ Tiempo restante</span>
              <span style={{
                ...estilos.detalleValor,
                color: esHoy ? '#f59e0b' : '#3b82f6',
                fontWeight: 700,
              }}>
                {textoRestante}
              </span>
            </div>
            <div style={estilos.detalle}>
              <span style={estilos.detalleLabel}>🆔 Préstamo</span>
              <span style={estilos.detalleValor}>#{p.id_prestamo_jja}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════
  // ── Render de notificación ──
  // ═══════════════════════════════════════
  function renderNotificacion(n, idx) {
    const icono = n.tipo_notificacion_jja === 'vencido' ? '🔴'
      : n.tipo_notificacion_jja === 'vencimiento_proximo' ? '🟡'
        : n.tipo_notificacion_jja === 'sancion' ? '⛔'
          : n.tipo_notificacion_jja === 'devolucion_confirmada' ? '✅'
            : 'ℹ️'

    return (
      <div key={n.id_notificacion_jja || idx} style={{
        ...estilos.tarjeta,
        opacity: n.leida_jja ? 0.7 : 1,
      }}>
        <div style={{
          ...estilos.indicadorLateral,
          background: n.tipo_notificacion_jja === 'vencido' ? '#dc2626'
            : n.tipo_notificacion_jja === 'vencimiento_proximo' ? '#f59e0b'
              : n.tipo_notificacion_jja === 'sancion' ? '#dc2626'
                : n.tipo_notificacion_jja === 'devolucion_confirmada' ? '#10b981'
                  : '#6366f1',
        }} />
        <div style={estilos.tarjetaContenido}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{icono}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4, color: 'var(--texto-principal-jja)' }}>
                {n.titulo_jja || 'Notificación'}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--texto-secundario-jja)', lineHeight: 1.5 }}>
                {n.mensaje_jja}
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--texto-terciario-jja)' }}>
                  📅 {n.creado_en_jja ? formatearFechaLarga(n.creado_en_jja) : '—'}
                </span>
                {n.leida_jja ? (
                  <span style={{
                    fontSize: '0.72rem', padding: '2px 8px', borderRadius: 12,
                    background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                  }}>✓ Leída</span>
                ) : (
                  <span style={{
                    fontSize: '0.72rem', padding: '2px 8px', borderRadius: 12,
                    background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6',
                    fontWeight: 600,
                  }}>● Nueva</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════
  // ── Skeleton loader ──
  // ═══════════════════════════════════════
  function renderSkeletons() {
    return Array.from({ length: 3 }).map((_, i) => (
      <div key={`sk-${i}`} style={{ ...estilos.tarjeta, opacity: 0.5 }}>
        <div style={{ ...estilos.indicadorLateral, background: 'var(--borde-jja)' }} />
        <div style={{ ...estilos.tarjetaContenido, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="skeleton-jja" style={{ width: 48, height: 48, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton-jja" style={{ height: 16, width: '60%', marginBottom: 6 }} />
              <div className="skeleton-jja" style={{ height: 12, width: '30%' }} />
            </div>
          </div>
          <div className="skeleton-jja" style={{ height: 14, width: '90%' }} />
          <div style={{ display: 'flex', gap: 16 }}>
            <div className="skeleton-jja" style={{ height: 12, width: '25%' }} />
            <div className="skeleton-jja" style={{ height: 12, width: '25%' }} />
          </div>
        </div>
      </div>
    ))
  }

  // ═══════════════════════════════════════
  // ── Empty state ──
  // ═══════════════════════════════════════
  function renderEmpty(mensaje, icono = '📋') {
    return (
      <div style={{
        textAlign: 'center', padding: '60px 20px',
        color: 'var(--texto-terciario-jja)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.6 }}>{icono}</div>
        <div style={{ fontSize: '1rem', fontWeight: 500, marginBottom: 6, color: 'var(--texto-secundario-jja)' }}>
          {mensaje}
        </div>
        <div style={{ fontSize: '0.85rem' }}>
          No hay registros que mostrar en este momento
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════
  // ── RENDER PRINCIPAL ──
  // ═══════════════════════════════════════
  return (
    <div>
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja">Alertas y Notificaciones</h1>
          <p className="pagina-subtitulo-jja">Monitorea préstamos vencidos y notificaciones del sistema</p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="tabs-jja">
        {tabs.map(t => (
          <button
            key={t.clave}
            className={`tab-btn-jja ${tabActivo_jja === t.clave ? 'activo-jja' : ''}`}
            onClick={() => setTabActivo_jja(t.clave)}
          >
            {t.label}
            {t.count > 0 && (
              <span className="sidebar-item-badge-jja" style={{
                marginLeft: 6,
                background: t.clave === 'vencidos' ? '#dc2626' : undefined,
              }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Contenido ── */}
      <div style={{ marginTop: 16 }}>
        {cargando_jja ? (
          renderSkeletons()
        ) : tabActivo_jja === 'vencidos' ? (
          vencidos.length === 0
            ? renderEmpty('No hay préstamos vencidos', '🎉')
            : (
              <>
                {/* Resumen rápido */}
                <div style={estilos.resumen}>
                  <div style={estilos.resumenItem}>
                    <span style={{ ...estilos.resumenValor, color: '#dc2626' }}>{vencidos.length}</span>
                    <span style={estilos.resumenLabel}>
                      {vencidos.length === 1 ? 'Préstamo vencido' : 'Préstamos vencidos'}
                    </span>
                  </div>
                  <div style={estilos.resumenSeparador} />
                  <div style={estilos.resumenItem}>
                    <span style={{ ...estilos.resumenValor, color: '#f59e0b' }}>
                      {new Set(vencidos.map(v => v.id_usuario_jja)).size}
                    </span>
                    <span style={estilos.resumenLabel}>
                      {new Set(vencidos.map(v => v.id_usuario_jja)).size === 1 ? 'Usuario afectado' : 'Usuarios afectados'}
                    </span>
                  </div>
                </div>
                {vencidos.map((p, i) => renderTarjetaVencido(p, i))}
              </>
            )
        ) : tabActivo_jja === 'proximos' ? (
          proximosAVencer.length === 0
            ? renderEmpty('No hay préstamos próximos a vencer', '✅')
            : (
              <>
                <div style={estilos.resumen}>
                  <div style={estilos.resumenItem}>
                    <span style={{ ...estilos.resumenValor, color: '#3b82f6' }}>{proximosAVencer.length}</span>
                    <span style={estilos.resumenLabel}>
                      {proximosAVencer.length === 1 ? 'Préstamo por vencer' : 'Préstamos por vencer'}
                    </span>
                  </div>
                  <div style={estilos.resumenSeparador} />
                  <div style={estilos.resumenItem}>
                    <span style={{ ...estilos.resumenValor, color: '#f59e0b' }}>
                      {proximosAVencer.filter(p => {
                        const l = new Date(p.fecha_limite_jja); l.setHours(0, 0, 0, 0)
                        const a = new Date(); a.setHours(0, 0, 0, 0)
                        return l.getTime() === a.getTime()
                      }).length}
                    </span>
                    <span style={estilos.resumenLabel}>Vencen hoy</span>
                  </div>
                </div>
                {proximosAVencer.map((p, i) => renderTarjetaProximo(p, i))}
              </>
            )
        ) : (
          notificaciones_jja.length === 0
            ? renderEmpty('No hay notificaciones', '🔔')
            : notificaciones_jja.map((n, i) => renderNotificacion(n, i))
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════
// ── Estilos inline ──
// ═══════════════════════════════════════
const estilos = {
  tarjeta: {
    display: 'flex',
    background: 'var(--bg-tarjeta-jja)',
    borderRadius: '16px',
    border: '1px solid var(--borde-jja)',
    marginBottom: 20,
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
  },
  indicadorLateral: {
    width: 8,
    flexShrink: 0,
  },
  tarjetaContenido: {
    flex: 1,
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  filaUsuario: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #dc2626, #991b1b)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 800,
    flexShrink: 0,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  infoUsuario: {
    flex: 1,
    minWidth: 140,
  },
  nombreUsuario: {
    fontWeight: 700,
    fontSize: '1.1rem',
    color: 'var(--texto-principal-jja)',
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  cedulaUsuario: {
    fontSize: '0.85rem',
    color: 'var(--texto-terciario-jja)',
    marginTop: 4,
    fontWeight: 500,
  },
  badgeVencido: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 16px',
    borderRadius: '24px',
    fontSize: '0.85rem',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    letterSpacing: '0.02em',
  },
  descripcionNatural: {
    fontSize: '0.95rem',
    color: 'var(--texto-secundario-jja)',
    lineHeight: 1.6,
    padding: '12px 0 4px',
    borderTop: '1px dashed var(--borde-jja)',
    marginTop: 4,
  },
  detallesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12,
    marginTop: 8,
    background: 'var(--bg-principal-jja, rgba(0,0,0,0.02))',
    padding: '16px',
    borderRadius: '12px',
  },
  detalle: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: '4px 8px',
  },
  detalleLabel: {
    fontSize: '0.75rem',
    color: 'var(--texto-terciario-jja)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  detalleValor: {
    fontSize: '0.95rem',
    color: 'var(--texto-principal-jja)',
    fontWeight: 700,
  },
  resumen: {
    display: 'flex',
    alignItems: 'center',
    gap: 32,
    padding: '20px 28px',
    background: 'linear-gradient(to right, var(--bg-tarjeta-jja), var(--bg-principal-jja))',
    borderRadius: '16px',
    border: '1px solid var(--borde-jja)',
    marginBottom: 24,
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  resumenItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  resumenValor: {
    fontSize: '2rem',
    fontWeight: 800,
    lineHeight: 1,
  },
  resumenLabel: {
    fontSize: '1rem',
    color: 'var(--texto-secundario-jja)',
    fontWeight: 600,
  },
  resumenSeparador: {
    width: 2,
    height: 48,
    background: 'var(--borde-jja)',
    borderRadius: 2,
  },
}

export default AlertasPage_jja
