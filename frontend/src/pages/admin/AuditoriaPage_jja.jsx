// ============================================================
// AuditoriaPage_jja.jsx — Auditoría en Lenguaje Natural (Timeline)
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect, useMemo } from 'react'
import { apiRequest } from '../../utils/api'
import { useToast_jja } from '../../context/ToastContext_jja'

// ── Mapeo de tablas a nombres legibles ──
const TABLA_NOMBRES_jja = {
  'activos_jja': 'Activos',
  'usuarios_jja': 'Usuarios',
  'prestamos_jja': 'Préstamos',
  'roles_jja': 'Roles',
  'tipos_activos_jja': 'Tipos de Activos',
  'politicas_prestamo_jja': 'Políticas de Préstamo',
  'notificaciones_jja': 'Notificaciones',
  'lista_negra_jja': 'Lista Negra',
  'historial_prestamos_jja': 'Historial de Préstamos',
  'solicitudes_prestamo_activos_jja': 'Solicitudes de Préstamo',
  'solicitudes_devolucion_jja': 'Solicitudes de Devolución',
  'tokens_invalidos_jja': 'Sesiones',
  'auditoria_jja': 'Auditoría',
  'productos_jja': 'Productos',
  'categorias_jja': 'Categorías',
  'ofertas_jja': 'Ofertas',
  'transacciones_jja': 'Transacciones',
}

// ── Mapeo de acciones a verbos naturales ──
const ACCION_VERBO_jja = {
  'INSERT': 'creó',
  'UPDATE': 'actualizó',
  'DELETE': 'eliminó',
}

const ACCION_ICONO_jja = {
  'INSERT': '➕',
  'UPDATE': '✏️',
  'DELETE': '🗑️',
}

const ACCION_COLOR_jja = {
  'INSERT': { bg: '#ecfdf5', border: '#10b981', text: '#065f46', badge: '#10b981' },
  'UPDATE': { bg: '#fffbeb', border: '#f59e0b', text: '#92400e', badge: '#f59e0b' },
  'DELETE': { bg: '#fef2f2', border: '#ef4444', text: '#991b1b', badge: '#ef4444' },
}

// ── Campos a nombres legibles ──
const CAMPO_NOMBRES_jja = {
  'estado_jja': 'el estado',
  'estado_prestamo_jja': 'el estado del préstamo',
  'nombre_jja': 'el nombre',
  'apellido_jja': 'el apellido',
  'correo_jja': 'el correo',
  'telefono_jja': 'el teléfono',
  'contrasena_jja': 'la contraseña',
  'ubicacion_jja': 'la ubicación',
  'descripcion_jja': 'la descripción',
  'estado_registro_jja': 'el estado de registro',
  'publicado_jja': 'la publicación',
  'activa_jja': 'el estado de la sanción',
  'leida_jja': 'el estado de lectura',
  'imagen_jja': 'la imagen de perfil',
  'id_rol_jja': 'el rol',
  'fecha_devolucion_jja': 'la fecha de devolución',
  'fecha_limite_jja': 'la fecha límite',
  'observaciones_jja': 'las observaciones',
}

// ── Genera descripción en lenguaje natural ──
function generarDescripcion_jja(reg) {
  const usuario = reg.nombre_usuario_jja || 'Sistema'
  const accion = ACCION_VERBO_jja[reg.accion_jja] || 'modificó'
  const tabla = TABLA_NOMBRES_jja[reg.tabla_afectada_jja] || reg.tabla_afectada_jja || 'un registro'
  const campo = reg.campo_modificado_jja ? (CAMPO_NOMBRES_jja[reg.campo_modificado_jja] || reg.campo_modificado_jja) : null

  // Si hay descripción personalizada del backend, usarla como base
  if (reg.descripcion_jja && reg.descripcion_jja.trim()) {
    return reg.descripcion_jja
  }

  let desc = ''

  if (reg.accion_jja === 'INSERT') {
    desc = `${usuario} ${accion} un nuevo registro en ${tabla}`
  } else if (reg.accion_jja === 'DELETE') {
    desc = `${usuario} ${accion} un registro de ${tabla}`
  } else if (reg.accion_jja === 'UPDATE') {
    if (campo) {
      const valorAnterior = reg.valor_anterior_jja
      const valorNuevo = reg.valor_nuevo_jja
      if (valorAnterior && valorNuevo) {
        desc = `${usuario} cambió ${campo} de "${valorAnterior}" a "${valorNuevo}" en ${tabla}`
      } else if (valorNuevo) {
        desc = `${usuario} estableció ${campo} a "${valorNuevo}" en ${tabla}`
      } else {
        desc = `${usuario} ${accion} ${campo} en ${tabla}`
      }
    } else {
      desc = `${usuario} ${accion} un registro en ${tabla}`
    }
  } else {
    desc = `${usuario} realizó una operación en ${tabla}`
  }

  return desc
}

// ── Formatea fecha como "hace X minutos", "hoy a las 10:30", etc ──
function formatearTiempoRelativo_jja(fechaStr) {
  if (!fechaStr) return { fecha: 'Fecha no disponible', hora: '' }
  const fecha = new Date(fechaStr)
  if (isNaN(fecha.getTime())) return { fecha: 'Fecha no disponible', hora: '' }

  const ahora = new Date()
  const diff = ahora - fecha
  const mins = Math.floor(diff / 60000)
  const horas = Math.floor(diff / 3600000)
  const dias = Math.floor(diff / 86400000)

  const horaStr = fecha.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
  const fechaCorta = fecha.toLocaleDateString('es-VE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  let relativo = ''
  if (mins < 1) relativo = 'Justo ahora'
  else if (mins < 60) relativo = `Hace ${mins} minuto${mins !== 1 ? 's' : ''}`
  else if (horas < 24) relativo = `Hace ${horas} hora${horas !== 1 ? 's' : ''}`
  else if (dias === 1) relativo = 'Ayer'
  else if (dias < 7) relativo = `Hace ${dias} día${dias !== 1 ? 's' : ''}`
  else relativo = fechaCorta

  return { fecha: relativo, hora: horaStr, fechaCompleta: fechaCorta }
}

// ── Obtiene iniciales del nombre ──
function getIniciales_jja(nombre) {
  if (!nombre || nombre === 'Sistema') return 'SIS'
  return nombre.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

const AuditoriaPage_jja = () => {
  const [registros_jja, setRegistros_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)
  const [busqueda_jja, setBusqueda_jja] = useState('')
  const [filtroAccion_jja, setFiltroAccion_jja] = useState('TODAS')
  const toast_jja = useToast_jja()

  useEffect(() => { cargarDatos_jja() }, [])

  async function cargarDatos_jja() {
    try {
      const resp = await apiRequest('/auditoria')
      const datos = resp?.datos && Array.isArray(resp.datos)
        ? resp.datos
        : Array.isArray(resp) ? resp : []
      setRegistros_jja(datos)
    } catch (err) {
      console.error('Error cargando auditoría:', err)
      toast_jja.error('Error al cargar los registros de auditoría.')
    } finally {
      setCargando_jja(false)
    }
  }

  // Filtrado
  const registrosFiltrados_jja = useMemo(() => {
    let lista = registros_jja
    if (filtroAccion_jja !== 'TODAS') {
      lista = lista.filter(r => r.accion_jja === filtroAccion_jja)
    }
    if (busqueda_jja.trim()) {
      const term = busqueda_jja.toLowerCase()
      lista = lista.filter(r => {
        const desc = generarDescripcion_jja(r).toLowerCase()
        const usr = (r.nombre_usuario_jja || '').toLowerCase()
        const tbl = (TABLA_NOMBRES_jja[r.tabla_afectada_jja] || r.tabla_afectada_jja || '').toLowerCase()
        return desc.includes(term) || usr.includes(term) || tbl.includes(term)
      })
    }
    return lista
  }, [registros_jja, filtroAccion_jja, busqueda_jja])

  // Agrupar por fecha
  const gruposPorFecha_jja = useMemo(() => {
    const grupos = {}
    registrosFiltrados_jja.forEach(reg => {
      const fecha = reg.fecha_accion_jja
        ? new Date(reg.fecha_accion_jja).toLocaleDateString('es-VE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : 'Sin fecha'
      if (!grupos[fecha]) grupos[fecha] = []
      grupos[fecha].push(reg)
    })
    return grupos
  }, [registrosFiltrados_jja])

  // Conteos por acción
  const conteos_jja = useMemo(() => {
    const c = { INSERT: 0, UPDATE: 0, DELETE: 0, TOTAL: registros_jja.length }
    registros_jja.forEach(r => { if (c[r.accion_jja] !== undefined) c[r.accion_jja]++ })
    return c
  }, [registros_jja])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeInAudit_jja 0.4s ease-out' }}>
      <style>{`
        @keyframes fadeInAudit_jja { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInCard_jja { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }
        .audit-card-jja { animation: slideInCard_jja 0.35s ease-out both; transition: all 0.25s ease; }
        .audit-card-jja:hover { transform: translateY(-2px); box-shadow: 0 12px 32px -8px rgba(0,0,0,0.12) !important; }
        .filtro-btn-jja { cursor: pointer; border: 1px solid #e2e8f0; background: #fff; padding: 8px 16px; border-radius: 24px; font-size: 0.82rem; font-weight: 600; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
        .filtro-btn-jja:hover { border-color: #94a3b8; background: #f8fafc; }
        .filtro-btn-jja.activo-jja { background: #0f172a; color: #fff; border-color: #0f172a; }
        .audit-search-jja { border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px 12px 44px; width: 100%; font-size: 0.92rem; background: #fff; transition: all 0.2s; outline: none; font-family: inherit; }
        .audit-search-jja:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .audit-timeline-line-jja { position: absolute; left: 24px; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, #e2e8f0, #f1f5f9); }
        .audit-dot-jja { width: 12px; height: 12px; border-radius: 50%; border: 2.5px solid #fff; position: absolute; left: 19px; top: 20px; z-index: 2; box-shadow: 0 0 0 2px currentColor; }
        .skeleton-audit-jja { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer_jja 1.5s infinite; border-radius: 8px; }
        @keyframes shimmer_jja { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>

      {/* ── Header ── */}
      <div style={estilos_jja.headerBox}>
        <div>
          <h1 style={estilos_jja.titulo}>
            <span style={{ width: 8, height: 28, background: 'linear-gradient(180deg, #8b5cf6, #6366f1)', borderRadius: 4, flexShrink: 0 }}></span>
            Registro de Actividad
          </h1>
          <p style={estilos_jja.subtitulo}>Historial completo de acciones realizadas por los usuarios del sistema</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: '0.85rem' }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Actualizado en tiempo real
        </div>
      </div>

      {/* ── Stats rápidos ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Total Operaciones', value: conteos_jja.TOTAL, color: '#6366f1', bg: '#eef2ff' },
          { label: 'Creaciones', value: conteos_jja.INSERT, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Actualizaciones', value: conteos_jja.UPDATE, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Eliminaciones', value: conteos_jja.DELETE, color: '#ef4444', bg: '#fef2f2' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 14, padding: '20px 24px',
            border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 16,
            animation: `fadeInAudit_jja 0.4s ease-out ${i * 0.1}s both`
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, background: stat.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', fontWeight: 800, color: stat.color
            }}>{stat.value}</div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── Barra de búsqueda y filtros ── */}
      <div style={estilos_jja.toolbarBox}>
        <div style={{ position: 'relative', flex: 1 }}>
          <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            className="audit-search-jja"
            type="text"
            value={busqueda_jja}
            onChange={(e) => setBusqueda_jja(e.target.value)}
            placeholder="Buscar actividad: usuario, acción, módulo..."
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['TODAS', 'INSERT', 'UPDATE', 'DELETE'].map(f => (
            <button
              key={f}
              className={`filtro-btn-jja ${filtroAccion_jja === f ? 'activo-jja' : ''}`}
              onClick={() => setFiltroAccion_jja(f)}
            >
              {f === 'TODAS' && '📋'}
              {f === 'INSERT' && '➕'}
              {f === 'UPDATE' && '✏️'}
              {f === 'DELETE' && '🗑️'}
              {f === 'TODAS' ? 'Todas' : f === 'INSERT' ? 'Creaciones' : f === 'UPDATE' ? 'Actualizaciones' : 'Eliminaciones'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Resultados info ── */}
      <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500, padding: '0 4px' }}>
        {registrosFiltrados_jja.length} actividad{registrosFiltrados_jja.length !== 1 ? 'es' : ''} encontrada{registrosFiltrados_jja.length !== 1 ? 's' : ''}
      </div>

      {/* ── Timeline ── */}
      {cargando_jja ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '20px 24px', background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9' }}>
              <div className="skeleton-audit-jja" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="skeleton-audit-jja" style={{ height: 16, width: '60%' }} />
                <div className="skeleton-audit-jja" style={{ height: 13, width: '40%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : registrosFiltrados_jja.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 24px', background: '#fff',
          borderRadius: 16, border: '1px solid #f1f5f9', color: '#94a3b8'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📭</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#64748b', marginBottom: 4 }}>No hay actividad registrada</div>
          <div style={{ fontSize: '0.9rem' }}>
            {busqueda_jja || filtroAccion_jja !== 'TODAS'
              ? 'Intenta cambiar los filtros de búsqueda'
              : 'Las acciones del sistema aparecerán aquí'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {Object.entries(gruposPorFecha_jja).map(([fecha, items], gIdx) => (
            <div key={fecha}>
              {/* Fecha separador */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
                animation: `fadeInAudit_jja 0.4s ease-out ${gIdx * 0.05}s both`
              }}>
                <div style={{
                  padding: '6px 16px', background: '#f1f5f9', borderRadius: 20,
                  fontSize: '0.82rem', fontWeight: 700, color: '#475569',
                  textTransform: 'capitalize', whiteSpace: 'nowrap'
                }}>
                  📅 {fecha}
                </div>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }}></div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>
                  {items.length} acción{items.length !== 1 ? 'es' : ''}
                </span>
              </div>

              {/* Cards de actividad */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 8 }}>
                {items.map((reg, idx) => {
                  const color = ACCION_COLOR_jja[reg.accion_jja] || ACCION_COLOR_jja.UPDATE
                  const tiempo = formatearTiempoRelativo_jja(reg.fecha_accion_jja)
                  const descripcion = generarDescripcion_jja(reg)
                  const iniciales = getIniciales_jja(reg.nombre_usuario_jja)
                  const esAutomatico = !reg.id_usuario_responsable_jja || reg.nombre_usuario_jja === 'Sistema'

                  return (
                    <div
                      key={reg.id_auditoria_jja || `${gIdx}-${idx}`}
                      className="audit-card-jja"
                      style={{
                        ...estilos_jja.activityCard,
                        borderLeft: `3px solid ${color.badge}`,
                        animationDelay: `${idx * 0.04}s`,
                      }}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                        background: esAutomatico
                          ? 'linear-gradient(135deg, #94a3b8, #64748b)'
                          : `linear-gradient(135deg, ${color.badge}22, ${color.badge}44)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.82rem', fontWeight: 700,
                        color: esAutomatico ? '#fff' : color.badge,
                        border: `2px solid ${esAutomatico ? '#cbd5e1' : color.badge}33`,
                      }}>
                        {esAutomatico ? '⚙️' : iniciales}
                      </div>

                      {/* Contenido */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                          <p style={{
                            margin: 0, fontSize: '0.92rem', color: '#1e293b',
                            lineHeight: 1.5, fontWeight: 400, flex: 1
                          }}>
                            <strong style={{ fontWeight: 700, color: '#0f172a' }}>
                              {esAutomatico ? '⚙️ Sistema' : reg.nombre_usuario_jja}
                            </strong>{' '}
                            {descripcion.replace(reg.nombre_usuario_jja || 'Sistema', '').replace(/^ /, '')}
                          </p>
                          <span style={{
                            padding: '3px 10px', borderRadius: 20,
                            fontSize: '0.72rem', fontWeight: 700,
                            background: color.bg, color: color.text,
                            border: `1px solid ${color.badge}33`,
                            whiteSpace: 'nowrap', flexShrink: 0, textTransform: 'uppercase',
                            letterSpacing: '0.04em'
                          }}>
                            {ACCION_ICONO_jja[reg.accion_jja]} {reg.accion_jja === 'INSERT' ? 'Creación' : reg.accion_jja === 'UPDATE' ? 'Edición' : 'Eliminación'}
                          </span>
                        </div>

                        {/* Detalle del cambio si existe */}
                        {reg.accion_jja === 'UPDATE' && reg.campo_modificado_jja && reg.valor_anterior_jja && reg.valor_nuevo_jja && (
                          <div style={{
                            marginTop: 8, padding: '8px 12px', borderRadius: 8,
                            background: '#f8fafc', border: '1px solid #f1f5f9',
                            fontSize: '0.82rem', color: '#475569', display: 'flex',
                            alignItems: 'center', gap: 8, flexWrap: 'wrap'
                          }}>
                            <span style={{ color: '#ef4444', textDecoration: 'line-through', fontWeight: 500 }}>
                              {reg.valor_anterior_jja}
                            </span>
                            <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            <span style={{ color: '#10b981', fontWeight: 600 }}>
                              {reg.valor_nuevo_jja}
                            </span>
                          </div>
                        )}

                        {/* Meta info */}
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 16, marginTop: 8,
                          fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {tiempo.fecha} {tiempo.hora && `· ${tiempo.hora}`}
                          </span>
                          {reg.rol_usuario_jja && reg.rol_usuario_jja !== 'Sistema' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                              {reg.rol_usuario_jja}
                            </span>
                          )}
                          {reg.tabla_afectada_jja && (
                            <span style={{
                              padding: '2px 8px', background: '#f1f5f9', borderRadius: 6,
                              fontSize: '0.72rem', fontWeight: 600, color: '#64748b'
                            }}>
                              {TABLA_NOMBRES_jja[reg.tabla_afectada_jja] || reg.tabla_afectada_jja}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const estilos_jja = {
  headerBox: {
    background: '#fff', borderRadius: 16, padding: '28px 32px',
    border: '1px solid #f1f5f9',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  titulo: {
    fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0',
    letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 12
  },
  subtitulo: {
    fontSize: '0.95rem', color: '#64748b', margin: 0, paddingLeft: 20
  },
  toolbarBox: {
    display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'
  },
  activityCard: {
    background: '#fff', borderRadius: 14, padding: '18px 24px',
    border: '1px solid #f1f5f9',
    display: 'flex', alignItems: 'flex-start', gap: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
}

export default AuditoriaPage_jja
