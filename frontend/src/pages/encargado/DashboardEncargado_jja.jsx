// ============================================================
// DashboardEncargado_jja.jsx — Panel de Control del Encargado
// Mismos cambios que Dashboard Admin (sin usuarios, con vencidos)
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../../utils/api'
import { ThemeContext_jja } from '../../context/ThemeContext_jja'
import { useToast_jja } from '../../context/ToastContext_jja'
import useAuth_jja from '../../hooks/useAuth_jja'
import KpiCard_jja from '../../components/ui_jja/KpiCard_jja'
import StatusBadge_jja from '../../components/ui_jja/StatusBadge_jja'
import BotonAccion_jja from '../../components/ui_jja/BotonAccion_jja'
import {
  IconoInventario_jja, IconoPrestamo_jja, IconoSolicitudes_jja,
  IconoAlertas_jja, IconoQR_jja,
  IconoChevronDer_jja,
} from '../../components/ui_jja/Iconos_jja'

// ── Colores para avatares ────────────────────────────────────
const COLORES_AVATAR = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4']

const DashboardEncargado_jja = () => {
  const navigate = useNavigate()
  const { usuario } = useAuth_jja()
  const { tema } = useContext(ThemeContext_jja)
  const toast_jja = useToast_jja()

  const [kpis_jja, setKpis_jja] = useState({ activosDisponibles: 0, prestamos: 0, solicitudes: 0, vencidos: 0 })
  const [ultimosPrestamos_jja, setUltimosPrestamos_jja] = useState([])
  const [solicitudesRecientes_jja, setSolicitudesRecientes_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)

  useEffect(() => {
    cargarDatos_jja()
  }, [])

  async function cargarDatos_jja() {
    try {
      const [activosResp, prestamosResp, solicitudesResp] = await Promise.allSettled([
        apiRequest('/activos'),
        apiRequest('/prestamos'),
        apiRequest('/solicitudes-prestamo'),
      ])

      const activos = extraerLista_jja(activosResp)
      const prestamos = extraerLista_jja(prestamosResp)
      const solicitudes = extraerLista_jja(solicitudesResp)

      console.log('Dashboard Encargado Data:', { activos, prestamos, solicitudes })

      // Calcular préstamos vencidos
      const hoy = new Date()
      const prestamosVencidos = prestamos.filter(p => {
        if ((p.estado_prestamo_jja || p.estado || '').toLowerCase() !== 'activo') return false
        const fechaLimite = new Date(p.fecha_devolucion_jja || p.fecha_limite_jja)
        return fechaLimite < hoy
      })

      const activosDisp = activos.filter(a => {
        const estado = (a.estado_jja || a.estado || '').toLowerCase()
        return estado === 'disponible'
      }).length

      const prestActivos = prestamos.filter(p => {
        const estado = (p.estado_prestamo_jja || p.estado || '').toLowerCase()
        return estado === 'activo'
      }).length

      const solPendientes = solicitudes.filter(s => {
        const estado = (s.estado_jja || s.estado || '').toLowerCase()
        return estado === 'pendiente' || estado === 'en_proceso'
      }).length

      setKpis_jja({
        activosDisponibles: activosDisp,
        prestamos: prestActivos,
        solicitudes: solPendientes,
        vencidos: prestamosVencidos.length,
      })

      // Últimos préstamos del día
      const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
      const prestamosHoy = prestamos.filter(p => {
        const fecha = new Date(p.creado_en_jja || p.fecha_prestamo_jja)
        return fecha >= inicioHoy
      })

      setUltimosPrestamos_jja(
        prestamosHoy
          .sort((a, b) => new Date(b.creado_en_jja || b.fecha_prestamo_jja) - new Date(a.creado_en_jja || a.fecha_prestamo_jja))
          .slice(0, 5)
      )

      setSolicitudesRecientes_jja(
        solicitudes
          .sort((a, b) => new Date(b.fecha_solicitud_jja || b.creado_en_jja) - new Date(a.fecha_solicitud_jja || a.creado_en_jja))
          .slice(0, 5)
      )
    } catch (err) {
      console.error('Error cargando dashboard encargado:', err)
      toast_jja.error('No se pudieron cargar los datos del panel.')
    } finally {
      setCargando_jja(false)
    }
  }

  function extraerLista_jja(resultado) {
    if (!resultado || resultado.status !== 'fulfilled') return []
    const data = resultado.value
    
    if (data?.datos && !Array.isArray(data.datos)) {
       return [data.datos]
    }
    
    if (data?.datos && Array.isArray(data.datos)) return data.datos
    if (Array.isArray(data)) return data
    if (data?.activos && Array.isArray(data.activos)) return data.activos
    if (data?.prestamos && Array.isArray(data.prestamos)) return data.prestamos
    
    if (data && typeof data === 'object' && !Array.isArray(data) && data.id_usuario_jja) {
      return [data]
    }
    
    return []
  }

  // Fecha formateada
  const fecha = new Date()
  const opcFecha = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  const fechaTexto = fecha.toLocaleDateString('es-VE', opcFecha)
  const fechaCapitalizada = fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1)

  // Utilidades
  const colorAvatar_jja = (nombre) => COLORES_AVATAR[Math.abs(hashStr_jja(nombre || '')) % COLORES_AVATAR.length]
  function hashStr_jja(s) { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i); return h }
  const fechaCorta_jja = (f) => {
    if (!f) return '—'
    return new Date(f).toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }
  const horaCorta_jja = (f) => {
    if (!f) return ''
    return new Date(f).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      {/* Título de página */}
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja">Panel de Control</h1>
          <p className="pagina-subtitulo-jja">
            Bienvenido, {usuario?.nombre} · {fechaCapitalizada}
          </p>
        </div>
      </div>

      {/* KPI Cards — "Activos Disponibles" en vez de "Activos" */}
      <div className="kpi-grid-jja">
        <KpiCard_jja
          icono={<IconoInventario_jja />}
          valor={kpis_jja.activosDisponibles}
          etiqueta="Activos Disponibles"
          color="var(--kpi-1-jja)"
          bgColor="var(--kpi-1-bg-jja)"
        />
        <KpiCard_jja
          icono={<IconoPrestamo_jja />}
          valor={kpis_jja.prestamos}
          etiqueta="Préstamos Activos"
          color="var(--kpi-2-jja)"
          bgColor="var(--kpi-2-bg-jja)"
        />
        <KpiCard_jja
          icono={<IconoSolicitudes_jja />}
          valor={kpis_jja.solicitudes}
          etiqueta="Solicitudes Pendientes"
          color="var(--kpi-3-jja)"
          bgColor="var(--kpi-3-bg-jja)"
        />
        <KpiCard_jja
          icono={<IconoAlertas_jja />}
          valor={kpis_jja.vencidos}
          etiqueta="Préstamos Vencidos"
          color="var(--color-error-jja)"
          bgColor="var(--color-error-bg-jja)"
        />
      </div>

      {/* Botones de Acción Rápida */}
      <div className="acciones-rapidas-jja">
        <BotonAccion_jja variante="primario" icono={<IconoInventario_jja />} onClick={() => navigate('/sistema/inventario')}>
          Control de Activos
        </BotonAccion_jja>
        <BotonAccion_jja variante="exito" icono={<IconoPrestamo_jja />} onClick={() => navigate('/sistema/solicitudes')}>
          Registrar Préstamo
        </BotonAccion_jja>
        <BotonAccion_jja variante="advertencia" icono={<IconoQR_jja />} onClick={() => navigate('/sistema/solicitudes')}>
          Escaneo / Entregas
        </BotonAccion_jja>
        <BotonAccion_jja variante="info" icono={<IconoSolicitudes_jja />} onClick={() => navigate('/sistema/solicitudes')}>
          Ver Solicitudes
        </BotonAccion_jja>
      </div>

      {/* Grid de secciones */}
      <div className="dashboard-grid-jja">
        {/* Últimos Préstamos del Día */}
        <div className="card-jja">
          <div className="card-header-jja">
            <span className="card-titulo-jja">
              <IconoPrestamo_jja style={{ fontSize: '1.1rem' }} /> Últimos Préstamos del Día
            </span>
            <a className="card-link-jja" onClick={() => navigate('/sistema/solicitudes')} style={{ cursor: 'pointer' }}>
              Ver todos <IconoChevronDer_jja />
            </a>
          </div>
          <div className="card-body-jja">
            {cargando_jja ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--texto-terciario-jja)' }}>Cargando...</div>
            ) : ultimosPrestamos_jja.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--texto-terciario-jja)' }}>Sin préstamos registrados hoy</div>
            ) : (
              <ul className="mini-lista-jja">
                {ultimosPrestamos_jja.map((p, i) => (
                  <li key={p.id_prestamo_jja || i} className="mini-lista-item-jja">
                    <div className="mini-lista-izq-jja">
                      <div className="mini-lista-avatar-jja" style={{ background: colorAvatar_jja(p.nombre_usuario_jja || p.usuario_nombre || '') }}>
                        {(p.nombre_usuario_jja || p.usuario_nombre || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="mini-lista-nombre-jja">{p.nombre_usuario_jja || p.usuario_nombre || `Usuario #${p.id_usuario_jja}`}</div>
                        <div className="mini-lista-detalle-jja">{p.nombre_activo_jja || p.activo_nombre || `Activo #${p.id_activo_jja}`}</div>
                      </div>
                    </div>
                    <div className="mini-lista-der-jja">
                      <div className="mini-lista-fecha-jja">{fechaCorta_jja(p.fecha_prestamo_jja)}</div>
                      <div className="mini-lista-hora-jja">{horaCorta_jja(p.fecha_prestamo_jja)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Solicitudes Recientes */}
        <div className="card-jja">
          <div className="card-header-jja">
            <span className="card-titulo-jja">
              <IconoSolicitudes_jja style={{ fontSize: '1.1rem' }} /> Solicitudes Recientes
            </span>
            <a className="card-link-jja" onClick={() => navigate('/sistema/solicitudes')} style={{ cursor: 'pointer' }}>
              Ver todas <IconoChevronDer_jja />
            </a>
          </div>
          <div className="card-body-jja">
            {cargando_jja ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--texto-terciario-jja)' }}>Cargando...</div>
            ) : solicitudesRecientes_jja.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--texto-terciario-jja)' }}>Sin solicitudes</div>
            ) : (
              <ul className="mini-lista-jja">
                {solicitudesRecientes_jja.map((s, i) => (
                  <li key={s.id_solicitud_jja || i} className="mini-lista-item-jja">
                    <div className="mini-lista-izq-jja">
                      <div className="mini-lista-avatar-jja" style={{ background: colorAvatar_jja(s.cliente_nombre || '') }}>
                        {(s.cliente_nombre || 'C')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="mini-lista-nombre-jja">{s.cliente_nombre || `Cliente #${s.id_cliente_jja}`}</div>
                        <div className="mini-lista-detalle-jja">{s.producto_nombre || s.nombre_activo_jja || 'Activo'} · x{s.cantidad_jja || 1}</div>
                      </div>
                    </div>
                    <div className="mini-lista-der-jja">
                      <StatusBadge_jja estado={s.estado_jja} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardEncargado_jja
