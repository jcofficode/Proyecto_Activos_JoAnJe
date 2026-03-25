// ============================================================
// ReportesPage_jja.jsx — Reportes y estadísticas mejorado
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect } from 'react'
import { apiRequest } from '../../utils/api'
import { useToast_jja } from '../../context/ToastContext_jja'
import KpiCard_jja from '../../components/ui_jja/KpiCard_jja'
import { IconoPrestamo_jja, IconoInventario_jja, IconoUsuarios_jja, IconoCheck_jja, IconoExportar_jja, IconoAlertas_jja } from '../../components/ui_jja/Iconos_jja'
import BotonAccion_jja from '../../components/ui_jja/BotonAccion_jja'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler)

const ReportesPage_jja = () => {
  const [datos_jja, setDatos_jja] = useState({ activos: [], prestamos: [], usuarios: [] })
  const [cargando_jja, setCargando_jja] = useState(true)
  const toast_jja = useToast_jja()

  useEffect(() => { cargarDatos_jja() }, [])

  async function cargarDatos_jja() {
    try {
      const [a, p, u] = await Promise.allSettled([
        apiRequest('/activos'), apiRequest('/prestamos'), apiRequest('/usuarios'),
      ])
      setDatos_jja({
        activos: extraer_jja(a), prestamos: extraer_jja(p), usuarios: extraer_jja(u),
      })
    } catch (e) {
      console.error(e)
      toast_jja.error('Error al cargar los reportes.')
    }
    finally { setCargando_jja(false) }
  }

  function extraer_jja(r) {
    if (r.status !== 'fulfilled') return []
    const d = r.value
    if (d?.datos && Array.isArray(d.datos)) return d.datos
    if (Array.isArray(d)) return d
    return d?.activos || d?.prestamos || []
  }

  // ── Métricas de activos ─────────────────────────────────────
  const activosDisponibles_jja = datos_jja.activos.filter(a => (a.estado_jja || '').toLowerCase() === 'disponible').length
  const activosEnPrestamo_jja = datos_jja.activos.filter(a =>
    ['prestado', 'en_proceso_prestamo'].includes((a.estado_jja || '').toLowerCase())
  ).length

  // ── Métricas de préstamos ───────────────────────────────────
  const totalPrestamos_jja = datos_jja.prestamos.length
  const prestamosActivos_jja = datos_jja.prestamos.filter(p => (p.estado_prestamo_jja || '').toLowerCase() === 'activo').length
  const devueltos_jja = datos_jja.prestamos.filter(p => (p.estado_prestamo_jja || '').toLowerCase() === 'devuelto').length
  const vencidos_jja = datos_jja.prestamos.filter(p => (p.estado_prestamo_jja || '').toLowerCase() === 'vencido').length
  const tasa_jja = totalPrestamos_jja > 0 ? Math.round((devueltos_jja / totalPrestamos_jja) * 100) : 0

  // ── Métricas de usuarios ────────────────────────────────────
  const totalUsuarios_jja = datos_jja.usuarios.length
  const hoy_jja = new Date()
  const usuariosConPrestamosVigentes_jja = new Set(
    datos_jja.prestamos
      .filter(p => (p.estado_prestamo_jja || '').toLowerCase() === 'activo')
      .map(p => p.id_usuario_jja)
  ).size
  const usuariosConPrestamosVencidos_jja = new Set(
    datos_jja.prestamos
      .filter(p => {
        if ((p.estado_prestamo_jja || '').toLowerCase() !== 'activo') return false
        const fechaLimite = new Date(p.fecha_devolucion_jja || p.fecha_limite_jja)
        return fechaLimite < hoy_jja
      })
      .map(p => p.id_usuario_jja)
  ).size

  // ── Distribución de activos por estado ──────────────────────
  const estadosActivos_jja = datos_jja.activos.reduce((acc, a) => { acc[a.estado_jja] = (acc[a.estado_jja] || 0) + 1; return acc }, {})
  const labelsEstados_jja = Object.keys(estadosActivos_jja)
  const datosEstados_jja = Object.values(estadosActivos_jja)
  const coloresEstados_jja = labelsEstados_jja.map(e => ({ disponible: '#10b981', prestado: '#3b82f6', mantenimiento: '#8b5cf6', dañado: '#ef4444', perdido: '#6b7280', en_proceso_prestamo: '#f59e0b' }[e] || '#94a3b8'))

  // ── Usuarios por rol (sin "empresa") ────────────────────────
  const rolesCont_jja = datos_jja.usuarios.reduce((acc, u) => {
    const rol = (u.nombre_rol_jja || '').toLowerCase()
    if (rol !== 'empresa') {
      acc[u.nombre_rol_jja || 'Sin rol'] = (acc[u.nombre_rol_jja || 'Sin rol'] || 0) + 1
    }
    return acc
  }, {})

  return (
    <div>
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja">Reportes</h1>
          <p className="pagina-subtitulo-jja">Estadísticas y métricas del sistema</p>
        </div>
        <div className="pagina-acciones-jja">
          <BotonAccion_jja variante="ghost" icono={<IconoExportar_jja />}>Exportar</BotonAccion_jja>
        </div>
      </div>

      {/* KPIs resumen — 5 tarjetas solicitadas */}
      <div className="kpi-grid-jja">
        <KpiCard_jja icono={<IconoInventario_jja />} valor={activosDisponibles_jja} etiqueta="Activos Disponibles" color="var(--kpi-1-jja)" bgColor="var(--kpi-1-bg-jja)" />
        <KpiCard_jja icono={<IconoPrestamo_jja />} valor={activosEnPrestamo_jja} etiqueta="Activos en Préstamo" color="var(--kpi-2-jja)" bgColor="var(--kpi-2-bg-jja)" />
        <KpiCard_jja icono={<IconoUsuarios_jja />} valor={totalUsuarios_jja} etiqueta="Total Usuarios" color="var(--kpi-4-jja)" bgColor="var(--kpi-4-bg-jja)" />
        <KpiCard_jja icono={<IconoCheck_jja />} valor={usuariosConPrestamosVigentes_jja} etiqueta="Usuarios con Préstamos Vigentes" color="var(--kpi-3-jja)" bgColor="var(--kpi-3-bg-jja)" />
        <KpiCard_jja icono={<IconoAlertas_jja />} valor={usuariosConPrestamosVencidos_jja} etiqueta="Usuarios con Préstamos Vencidos" color="var(--color-error-jja)" bgColor="var(--color-error-bg-jja)" />
      </div>

      {/* Métricas adicionales */}
      <div className="kpi-grid-jja" style={{ marginBottom: 24 }}>
        <KpiCard_jja icono={<IconoPrestamo_jja />} valor={totalPrestamos_jja} etiqueta="Total Préstamos" color="var(--kpi-1-jja)" bgColor="var(--kpi-1-bg-jja)" />
        <KpiCard_jja icono={<IconoCheck_jja />} valor={`${tasa_jja}%`} etiqueta="Tasa de Devolución" color="var(--kpi-3-jja)" bgColor="var(--kpi-3-bg-jja)" />
      </div>

      {/* Gráficos */}
      <div className="dashboard-grid-jja">
        <div className="card-jja">
          <div className="card-header-jja"><span className="card-titulo-jja">Estado de Préstamos</span></div>
          <div className="card-body-jja" style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!cargando_jja && (
              <Bar
                data={{
                  labels: ['Activos', 'Devueltos', 'Vencidos'],
                  datasets: [{ label: 'Préstamos', data: [prestamosActivos_jja, devueltos_jja, vencidos_jja], backgroundColor: ['#4f46e5', '#10b981', '#ef4444'], borderRadius: 6, maxBarThickness: 50 }]
                }}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }}
              />
            )}
          </div>
        </div>
        <div className="card-jja">
          <div className="card-header-jja"><span className="card-titulo-jja">Distribución de Activos</span></div>
          <div className="card-body-jja" style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!cargando_jja && labelsEstados_jja.length > 0 && (
              <Doughnut
                data={{
                  labels: labelsEstados_jja.map(e => e.charAt(0).toUpperCase() + e.slice(1).replace(/_/g, ' ')),
                  datasets: [{ data: datosEstados_jja, backgroundColor: coloresEstados_jja, borderWidth: 2, borderColor: '#fff' }]
                }}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyle: 'circle' } } } }}
              />
            )}
          </div>
        </div>
        <div className="card-jja full-width-jja">
          <div className="card-header-jja"><span className="card-titulo-jja">Usuarios por Rol</span></div>
          <div className="card-body-jja">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
              {Object.entries(rolesCont_jja).map(([rol, count]) => (
                <div key={rol} style={{ textAlign: 'center', padding: 16, background: 'var(--bg-principal-jja)', borderRadius: 'var(--border-radius-sm-jja)' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primario-jja)' }}>{count}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--texto-secundario-jja)', textTransform: 'capitalize', fontWeight: 600 }}>{rol}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportesPage_jja
