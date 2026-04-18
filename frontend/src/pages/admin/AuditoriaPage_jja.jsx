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
  'prestamos_jja': 'Prestamos',
  'roles_jja': 'Roles',
  'tipos_activos_jja': 'Tipos de Activos',
  'politicas_prestamo_jja': 'Politicas de Prestamo',
  'notificaciones_jja': 'Notificaciones',
  'lista_negra_jja': 'Sanciones',
  'historial_prestamos_jja': 'Historial de Prestamos',
  'solicitudes_prestamo_activos_jja': 'Solicitudes de Prestamo',
  'solicitudes_devolucion_jja': 'Solicitudes de Devolucion',
  'tokens_invalidos_jja': 'Sesiones',
  'auditoria_jja': 'Auditoria',
}

// ── Campos a nombres legibles ──
const CAMPO_NOMBRES_jja = {
  'estado_jja': 'el estado',
  'estado_prestamo_jja': 'el estado del prestamo',
  'nombre_jja': 'el nombre',
  'apellido_jja': 'el apellido',
  'correo_jja': 'el correo',
  'telefono_jja': 'el telefono',
  'contrasena_jja': 'la contrasena',
  'ubicacion_jja': 'la ubicacion',
  'descripcion_jja': 'la descripcion',
  'estado_registro_jja': 'el estado de registro',
  'publicado_jja': 'la publicacion',
  'activa_jja': 'el estado de la sancion',
  'leida_jja': 'el estado de lectura',
  'imagen_jja': 'la imagen de perfil',
  'id_rol_jja': 'el rol',
  'fecha_devolucion_jja': 'la fecha de devolucion',
  'fecha_limite_jja': 'la fecha limite',
  'observaciones_jja': 'las observaciones',
}

// ── Colores por tipo de accion ──
const ACCION_COLOR_jja = {
  'INSERT': { bg: '#ecfdf5', border: '#10b981', text: '#065f46', badge: '#10b981' },
  'UPDATE': { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af', badge: '#3b82f6' },
  'DELETE': { bg: '#fef2f2', border: '#ef4444', text: '#991b1b', badge: '#ef4444' },
}

// ── Iconos SVG por tipo de accion ──
const IconoCreacion_jja = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
)
const IconoEdicion_jja = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
  </svg>
)
const IconoEliminacion_jja = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
)
const IconoSistema_jja = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

const ACCION_ICONO_COMPONENTE_jja = {
  'INSERT': IconoCreacion_jja,
  'UPDATE': IconoEdicion_jja,
  'DELETE': IconoEliminacion_jja,
}

// ── Genera descripcion en lenguaje natural usando datos resueltos por JOINs ──
function generarDescripcion_jja(reg) {
  const usuario = reg.nombre_usuario_jja || 'Sistema'
  const tabla = reg.tabla_afectada_jja

  // Si hay descripcion personalizada del backend (triggers con lenguaje natural), usarla
  if (reg.descripcion_jja && reg.descripcion_jja.trim()) {
    return reg.descripcion_jja
  }

  // Generar descripcion con los nombres resueltos por los JOINs del SP
  switch (tabla) {
    case 'activos_jja': {
      const activo = reg.nombre_activo_jja || 'un activo'
      if (reg.accion_jja === 'INSERT') return `${usuario} registro un nuevo activo: "${activo}" en el inventario`
      if (reg.accion_jja === 'DELETE') return `${usuario} elimino el activo "${activo}" del inventario`
      if (reg.accion_jja === 'UPDATE') {
        const campo = CAMPO_NOMBRES_jja[reg.campo_modificado_jja] || reg.campo_modificado_jja
        if (reg.valor_anterior_jja && reg.valor_nuevo_jja) {
          return `${usuario} cambio ${campo} de "${activo}" de ${reg.valor_anterior_jja} a ${reg.valor_nuevo_jja}`
        }
        return `${usuario} actualizo ${campo} del activo "${activo}"`
      }
      break
    }
    case 'usuarios_jja': {
      const afectado = reg.nombre_usuario_afectado_jja || 'un usuario'
      if (reg.accion_jja === 'INSERT') return `${usuario} registro al usuario ${afectado} en el sistema`
      if (reg.accion_jja === 'DELETE') return `${usuario} desactivo la cuenta del usuario ${afectado}`
      if (reg.accion_jja === 'UPDATE') {
        const campo = CAMPO_NOMBRES_jja[reg.campo_modificado_jja] || reg.campo_modificado_jja
        return `${usuario} actualizo ${campo} del usuario ${afectado}`
      }
      break
    }
    case 'prestamos_jja': {
      const activo = reg.nombre_activo_prestamo_jja || 'un activo'
      const cliente = reg.nombre_cliente_prestamo_jja || 'un cliente'
      const encargado = reg.nombre_encargado_prestamo_jja || usuario
      if (reg.accion_jja === 'INSERT') return `${encargado} aprobo el prestamo de "${activo}" para el cliente ${cliente}`
      if (reg.accion_jja === 'UPDATE') {
        if (reg.campo_modificado_jja === 'estado_prestamo_jja' && reg.valor_anterior_jja && reg.valor_nuevo_jja) {
          return `El prestamo de "${activo}" para ${cliente} cambio de ${reg.valor_anterior_jja} a ${reg.valor_nuevo_jja}`
        }
        return `${usuario} actualizo el prestamo de "${activo}" para ${cliente}`
      }
      break
    }
    case 'lista_negra_jja': {
      const sancionado = reg.nombre_sancionado_jja || 'un usuario'
      const motivo = reg.motivo_sancion_jja || ''
      if (reg.accion_jja === 'INSERT') {
        return `${usuario} aplico una sancion a ${sancionado}${motivo ? '. Motivo: ' + motivo : ''}`
      }
      if (reg.accion_jja === 'UPDATE') {
        if (reg.campo_modificado_jja === 'activa_jja') {
          const accion = reg.valor_nuevo_jja === '0' ? 'levanto la sancion' : 'reactivo la sancion'
          return `${usuario} ${accion} de ${sancionado}`
        }
        return `${usuario} actualizo la sancion de ${sancionado}`
      }
      break
    }
    case 'solicitudes_prestamo_activos_jja': {
      const clienteSol = reg.nombre_cliente_solicitud_jja || 'un cliente'
      const activoSol = reg.nombre_activo_solicitud_jja || 'un activo'
      if (reg.accion_jja === 'INSERT') return `${clienteSol} solicito el prestamo de "${activoSol}"`
      if (reg.accion_jja === 'UPDATE') return `${usuario} actualizo la solicitud de "${activoSol}" de ${clienteSol}`
      break
    }
    default:
      break
  }

  // Fallback generico
  const tablaLegible = TABLA_NOMBRES_jja[tabla] || tabla || 'un registro'
  if (reg.accion_jja === 'INSERT') return `${usuario} creo un nuevo registro en ${tablaLegible}`
  if (reg.accion_jja === 'DELETE') return `${usuario} elimino un registro de ${tablaLegible}`
  if (reg.accion_jja === 'UPDATE') {
    const campo = reg.campo_modificado_jja ? (CAMPO_NOMBRES_jja[reg.campo_modificado_jja] || reg.campo_modificado_jja) : null
    if (campo && reg.valor_anterior_jja && reg.valor_nuevo_jja) {
      return `${usuario} cambio ${campo} de "${reg.valor_anterior_jja}" a "${reg.valor_nuevo_jja}" en ${tablaLegible}`
    }
    if (campo) return `${usuario} actualizo ${campo} en ${tablaLegible}`
    return `${usuario} actualizo un registro en ${tablaLegible}`
  }
  return `${usuario} realizo una operacion en ${tablaLegible}`
}

// ── Resalta nombres propios en negrita dentro de la descripcion ──
function resaltarNombres_jja(descripcion, reg) {
  const nombres = [
    reg.nombre_usuario_jja,
    reg.nombre_activo_jja,
    reg.nombre_usuario_afectado_jja,
    reg.nombre_activo_prestamo_jja,
    reg.nombre_cliente_prestamo_jja,
    reg.nombre_encargado_prestamo_jja,
    reg.nombre_sancionado_jja,
    reg.nombre_cliente_solicitud_jja,
    reg.nombre_activo_solicitud_jja,
  ].filter(n => n && n.trim() && n !== 'Sistema')

  if (nombres.length === 0) return descripcion

  // Ordenar por longitud desc para evitar reemplazos parciales
  const nombresUnicos = [...new Set(nombres)].sort((a, b) => b.length - a.length)

  const partes = []
  let restante = descripcion

  while (restante.length > 0) {
    let encontrado = false
    for (const nombre of nombresUnicos) {
      const idx = restante.indexOf(nombre)
      if (idx === 0) {
        partes.push(<strong key={partes.length} style={{ fontWeight: 700, color: '#0f172a' }}>{nombre}</strong>)
        restante = restante.slice(nombre.length)
        encontrado = true
        break
      } else if (idx > 0) {
        partes.push(restante.slice(0, idx))
        partes.push(<strong key={partes.length} style={{ fontWeight: 700, color: '#0f172a' }}>{nombre}</strong>)
        restante = restante.slice(idx + nombre.length)
        encontrado = true
        break
      }
    }
    if (!encontrado) {
      partes.push(restante)
      restante = ''
    }
  }

  return partes
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
  else if (dias < 7) relativo = `Hace ${dias} dia${dias !== 1 ? 's' : ''}`
  else relativo = fechaCorta

  return { fecha: relativo, hora: horaStr, fechaCompleta: fechaCorta }
}

// ── Obtiene iniciales del nombre ──
function getIniciales_jja(nombre) {
  if (!nombre || nombre === 'Sistema') return 'SIS'
  return nombre.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

const ITEMS_POR_PAGINA_AUDIT = 20

const AuditoriaPage_jja = () => {
  const [registros_jja, setRegistros_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)
  const [busqueda_jja, setBusqueda_jja] = useState('')
  const [filtroAccion_jja, setFiltroAccion_jja] = useState('TODAS')
  const [fechaDesde_jja, setFechaDesde_jja] = useState('')
  const [fechaHasta_jja, setFechaHasta_jja] = useState('')
  const [orden_jja, setOrden_jja] = useState('reciente')
  const [pagina_jja, setPagina_jja] = useState(1)
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
      console.error('Error cargando auditoria:', err)
      toast_jja.error('Error al cargar los registros de auditoria.')
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
    if (fechaDesde_jja) {
      const desde = new Date(fechaDesde_jja)
      desde.setHours(0, 0, 0, 0)
      lista = lista.filter(r => r.fecha_accion_jja && new Date(r.fecha_accion_jja) >= desde)
    }
    if (fechaHasta_jja) {
      const hasta = new Date(fechaHasta_jja)
      hasta.setHours(23, 59, 59, 999)
      lista = lista.filter(r => r.fecha_accion_jja && new Date(r.fecha_accion_jja) <= hasta)
    }
    // Ordenamiento
    lista = [...lista].sort((a, b) => {
      const fA = new Date(a.fecha_accion_jja || 0)
      const fB = new Date(b.fecha_accion_jja || 0)
      return orden_jja === 'reciente' ? fB - fA : fA - fB
    })
    return lista
  }, [registros_jja, filtroAccion_jja, busqueda_jja, fechaDesde_jja, fechaHasta_jja, orden_jja])

  // Paginación
  const totalPaginas_jja = Math.ceil(registrosFiltrados_jja.length / ITEMS_POR_PAGINA_AUDIT) || 1
  const paginaActual_jja = Math.min(pagina_jja, totalPaginas_jja)
  const inicio_jja = (paginaActual_jja - 1) * ITEMS_POR_PAGINA_AUDIT
  const registrosPagina_jja = registrosFiltrados_jja.slice(inicio_jja, inicio_jja + ITEMS_POR_PAGINA_AUDIT)

  // Reset de pagina al cambiar filtros
  useEffect(() => { setPagina_jja(1) }, [busqueda_jja, filtroAccion_jja, fechaDesde_jja, fechaHasta_jja, orden_jja])

  // Agrupar por fecha (de la página actual)
  const gruposPorFecha_jja = useMemo(() => {
    const grupos = {}
    registrosPagina_jja.forEach(reg => {
      const fecha = reg.fecha_accion_jja
        ? new Date(reg.fecha_accion_jja).toLocaleDateString('es-VE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : 'Sin fecha'
      if (!grupos[fecha]) grupos[fecha] = []
      grupos[fecha].push(reg)
    })
    return grupos
  }, [registrosPagina_jja])

  // Conteos por accion
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
          <p style={estilos_jja.subtitulo}>Historial completo de acciones realizadas en el sistema</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: '0.85rem' }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Actualizado en tiempo real
        </div>
      </div>

      {/* ── Stats rapidos ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Total Operaciones', value: conteos_jja.TOTAL, color: '#6366f1', bg: '#eef2ff', Icono: null },
          { label: 'Creaciones', value: conteos_jja.INSERT, color: '#10b981', bg: '#ecfdf5', Icono: IconoCreacion_jja },
          { label: 'Actualizaciones', value: conteos_jja.UPDATE, color: '#3b82f6', bg: '#eff6ff', Icono: IconoEdicion_jja },
          { label: 'Eliminaciones', value: conteos_jja.DELETE, color: '#ef4444', bg: '#fef2f2', Icono: IconoEliminacion_jja },
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
            }}>
              {stat.Icono ? <stat.Icono size={20} /> : stat.value}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: stat.color }}>{stat.value}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Barra de busqueda y filtros ── */}
      <div style={estilos_jja.toolbarBox}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            className="audit-search-jja"
            type="text"
            value={busqueda_jja}
            onChange={(e) => setBusqueda_jja(e.target.value)}
            placeholder="Buscar actividad: usuario, accion, modulo..."
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { key: 'TODAS', label: 'Todas', Icono: null },
            { key: 'INSERT', label: 'Creaciones', Icono: IconoCreacion_jja },
            { key: 'UPDATE', label: 'Actualizaciones', Icono: IconoEdicion_jja },
            { key: 'DELETE', label: 'Eliminaciones', Icono: IconoEliminacion_jja },
          ].map(f => (
            <button
              key={f.key}
              className={`filtro-btn-jja ${filtroAccion_jja === f.key ? 'activo-jja' : ''}`}
              onClick={() => setFiltroAccion_jja(f.key)}
            >
              {f.Icono && <f.Icono size={14} />}
              {!f.Icono && <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Filtros avanzados: fecha y ordenamiento ── */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>Desde:</label>
          <input
            type="date"
            value={fechaDesde_jja}
            onChange={(e) => setFechaDesde_jja(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0',
              fontSize: '0.85rem', background: '#fff', color: '#1e293b', fontFamily: 'inherit'
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>Hasta:</label>
          <input
            type="date"
            value={fechaHasta_jja}
            onChange={(e) => setFechaHasta_jja(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0',
              fontSize: '0.85rem', background: '#fff', color: '#1e293b', fontFamily: 'inherit'
            }}
          />
        </div>
        <select
          value={orden_jja}
          onChange={(e) => setOrden_jja(e.target.value)}
          style={{
            padding: '8px 14px', borderRadius: 10, border: '1px solid #e2e8f0',
            fontSize: '0.85rem', background: '#fff', color: '#1e293b', cursor: 'pointer', fontFamily: 'inherit'
          }}
        >
          <option value="reciente">Más reciente primero</option>
          <option value="antiguo">Más antiguo primero</option>
        </select>
        {(fechaDesde_jja || fechaHasta_jja) && (
          <button
            onClick={() => { setFechaDesde_jja(''); setFechaHasta_jja('') }}
            style={{
              padding: '8px 14px', borderRadius: 10, border: '1px solid #e2e8f0',
              fontSize: '0.82rem', background: '#fef2f2', color: '#ef4444', cursor: 'pointer',
              fontWeight: 600, fontFamily: 'inherit'
            }}
          >
            Limpiar fechas
          </button>
        )}
      </div>

      {/* ── Resultados info ── */}
      <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500, padding: '0 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{registrosFiltrados_jja.length} actividad{registrosFiltrados_jja.length !== 1 ? 'es' : ''} encontrada{registrosFiltrados_jja.length !== 1 ? 's' : ''}</span>
        {totalPaginas_jja > 1 && (
          <span>Página {paginaActual_jja} de {totalPaginas_jja}</span>
        )}
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
          <svg width="48" height="48" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: 16 }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#64748b', marginBottom: 4 }}>No hay actividad registrada</div>
          <div style={{ fontSize: '0.9rem' }}>
            {busqueda_jja || filtroAccion_jja !== 'TODAS'
              ? 'Intenta cambiar los filtros de busqueda'
              : 'Las acciones del sistema apareceran aqui'}
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
                  textTransform: 'capitalize', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <svg width="14" height="14" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {fecha}
                </div>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }}></div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>
                  {items.length} accion{items.length !== 1 ? 'es' : ''}
                </span>
              </div>

              {/* Cards de actividad */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 8 }}>
                {items.map((reg, idx) => {
                  const color = ACCION_COLOR_jja[reg.accion_jja] || ACCION_COLOR_jja.UPDATE
                  const tiempo = formatearTiempoRelativo_jja(reg.fecha_accion_jja)
                  const descripcionTexto = generarDescripcion_jja(reg)
                  const descripcionJsx = resaltarNombres_jja(descripcionTexto, reg)
                  const iniciales = getIniciales_jja(reg.nombre_usuario_jja)
                  const esAutomatico = !reg.id_usuario_responsable_jja || reg.nombre_usuario_jja === 'Sistema'
                  const IconoAccion = ACCION_ICONO_COMPONENTE_jja[reg.accion_jja] || IconoEdicion_jja

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
                        {esAutomatico ? <IconoSistema_jja size={20} /> : iniciales}
                      </div>

                      {/* Contenido */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                          <p style={{
                            margin: 0, fontSize: '0.92rem', color: '#1e293b',
                            lineHeight: 1.5, fontWeight: 400, flex: 1
                          }}>
                            {descripcionJsx}
                          </p>
                          <span style={{
                            padding: '3px 10px', borderRadius: 20,
                            fontSize: '0.72rem', fontWeight: 700,
                            background: color.bg, color: color.text,
                            border: `1px solid ${color.badge}33`,
                            whiteSpace: 'nowrap', flexShrink: 0, textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            display: 'flex', alignItems: 'center', gap: 4
                          }}>
                            <IconoAccion size={12} />
                            {reg.accion_jja === 'INSERT' ? 'Creacion' : reg.accion_jja === 'UPDATE' ? 'Edicion' : 'Eliminacion'}
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
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                              {CAMPO_NOMBRES_jja[reg.campo_modificado_jja] || reg.campo_modificado_jja}:
                            </span>
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

      {/* ── Paginación ── */}
      {!cargando_jja && totalPaginas_jja > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '20px 0', marginTop: 8
        }}>
          <button
            onClick={() => setPagina_jja(1)}
            disabled={paginaActual_jja === 1}
            style={{
              ...estilos_jja.paginaBtn,
              opacity: paginaActual_jja === 1 ? 0.4 : 1,
              cursor: paginaActual_jja === 1 ? 'default' : 'pointer',
            }}
          >
            «
          </button>
          <button
            onClick={() => setPagina_jja(p => Math.max(1, p - 1))}
            disabled={paginaActual_jja === 1}
            style={{
              ...estilos_jja.paginaBtn,
              opacity: paginaActual_jja === 1 ? 0.4 : 1,
              cursor: paginaActual_jja === 1 ? 'default' : 'pointer',
            }}
          >
            ‹
          </button>
          {Array.from({ length: Math.min(5, totalPaginas_jja) }, (_, i) => {
            let pg
            if (totalPaginas_jja <= 5) {
              pg = i + 1
            } else if (paginaActual_jja <= 3) {
              pg = i + 1
            } else if (paginaActual_jja >= totalPaginas_jja - 2) {
              pg = totalPaginas_jja - 4 + i
            } else {
              pg = paginaActual_jja - 2 + i
            }
            return (
              <button
                key={pg}
                onClick={() => setPagina_jja(pg)}
                style={{
                  ...estilos_jja.paginaBtn,
                  background: pg === paginaActual_jja ? '#6366f1' : '#fff',
                  color: pg === paginaActual_jja ? '#fff' : '#475569',
                  fontWeight: pg === paginaActual_jja ? 700 : 500,
                  borderColor: pg === paginaActual_jja ? '#6366f1' : '#e2e8f0',
                }}
              >
                {pg}
              </button>
            )
          })}
          <button
            onClick={() => setPagina_jja(p => Math.min(totalPaginas_jja, p + 1))}
            disabled={paginaActual_jja === totalPaginas_jja}
            style={{
              ...estilos_jja.paginaBtn,
              opacity: paginaActual_jja === totalPaginas_jja ? 0.4 : 1,
              cursor: paginaActual_jja === totalPaginas_jja ? 'default' : 'pointer',
            }}
          >
            ›
          </button>
          <button
            onClick={() => setPagina_jja(totalPaginas_jja)}
            disabled={paginaActual_jja === totalPaginas_jja}
            style={{
              ...estilos_jja.paginaBtn,
              opacity: paginaActual_jja === totalPaginas_jja ? 0.4 : 1,
              cursor: paginaActual_jja === totalPaginas_jja ? 'default' : 'pointer',
            }}
          >
            »
          </button>
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
  paginaBtn: {
    width: 38, height: 38, borderRadius: 10,
    border: '1px solid #e2e8f0', background: '#fff',
    color: '#475569', fontSize: '0.88rem', fontWeight: 500,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
}

export default AuditoriaPage_jja
