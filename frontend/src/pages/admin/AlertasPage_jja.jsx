// ============================================================
// AlertasPage_jja.jsx — Alertas y Notificaciones
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect } from 'react'
import { apiRequest } from '../../utils/api'
import DataTable_jja from '../../components/ui_jja/DataTable_jja'
import StatusBadge_jja from '../../components/ui_jja/StatusBadge_jja'
import { IconoAlertas_jja } from '../../components/ui_jja/Iconos_jja'

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

  // Filtrar vencidos
  const ahora = new Date()
  const vencidos = prestamos_jja.filter(p => p.estado_prestamo_jja === 'vencido' || (p.estado_prestamo_jja === 'activo' && new Date(p.fecha_limite_jja) < ahora))
  const proximosAVencer = prestamos_jja.filter(p => {
    if (p.estado_prestamo_jja !== 'activo') return false
    const limite = new Date(p.fecha_limite_jja)
    const diff = (limite - ahora) / (1000 * 60 * 60 * 24)
    return diff > 0 && diff <= 3
  })

  const colsPrestamos = [
    { clave: 'id_prestamo_jja', titulo: 'Préstamo #' },
    { clave: 'nombre_usuario_jja', titulo: 'Usuario', render: (v, f) => v || f.usuario_nombre || `ID ${f.id_usuario_jja}` },
    { clave: 'nombre_activo_jja', titulo: 'Activo', render: (v, f) => v || f.activo_nombre || `ID ${f.id_activo_jja}` },
    { clave: 'fecha_limite_jja', titulo: 'Fecha límite', render: (v) => v ? new Date(v).toLocaleDateString('es-VE') : '—' },
    {
      clave: 'dias_retraso', titulo: 'Días', render: (_, f) => {
        const limite = new Date(f.fecha_limite_jja)
        const diff = Math.ceil((ahora - limite) / (1000 * 60 * 60 * 24))
        if (diff > 0) return <span style={{ color: 'var(--color-error-jja)', fontWeight: 700 }}>+{diff} días</span>
        return <span style={{ color: 'var(--color-advertencia-jja)', fontWeight: 600 }}>{Math.abs(diff)} días restantes</span>
      }
    },
    { clave: 'estado_prestamo_jja', titulo: 'Estado', render: (v) => <StatusBadge_jja estado={v} /> },
  ]

  const colsNotificaciones = [
    { clave: 'titulo_jja', titulo: 'Título' },
    { clave: 'mensaje_jja', titulo: 'Mensaje', render: (v) => <span style={{ maxWidth: 300, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span> },
    { clave: 'tipo_notificacion_jja', titulo: 'Tipo', render: (v) => <StatusBadge_jja estado={v === 'vencido' ? 'vencido' : v === 'vencimiento_proximo' ? 'pendiente' : 'info'} texto={v} /> },
    { clave: 'leida_jja', titulo: 'Leída', render: (v) => v ? 'Sí' : 'No' },
    { clave: 'creado_en_jja', titulo: 'Fecha', render: (v) => v ? new Date(v).toLocaleDateString('es-VE') : '—' },
  ]

  const tabs = [
    { clave: 'vencidos', label: 'Préstamos Vencidos', count: vencidos.length },
    { clave: 'proximos', label: 'Próximos a Vencer', count: proximosAVencer.length },
    { clave: 'notificaciones', label: 'Notificaciones', count: notificaciones_jja.length },
  ]

  return (
    <div>
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja">Alertas y Notificaciones</h1>
          <p className="pagina-subtitulo-jja">Monitorea préstamos vencidos y notificaciones del sistema</p>
        </div>
      </div>

      <div className="tabs-jja">
        {tabs.map(t => (
          <button key={t.clave} className={`tab-btn-jja ${tabActivo_jja === t.clave ? 'activo-jja' : ''}`} onClick={() => setTabActivo_jja(t.clave)}>
            {t.label} {t.count > 0 && <span className="sidebar-item-badge-jja" style={{ marginLeft: 6 }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {tabActivo_jja === 'vencidos' && <DataTable_jja columnas={colsPrestamos} datos={vencidos} cargando={cargando_jja} placeholderBusqueda="Buscar préstamo vencido..." />}
      {tabActivo_jja === 'proximos' && <DataTable_jja columnas={colsPrestamos} datos={proximosAVencer} cargando={cargando_jja} placeholderBusqueda="Buscar próximos a vencer..." />}
      {tabActivo_jja === 'notificaciones' && <DataTable_jja columnas={colsNotificaciones} datos={notificaciones_jja} cargando={cargando_jja} placeholderBusqueda="Buscar notificación..." />}
    </div>
  )
}

export default AlertasPage_jja
