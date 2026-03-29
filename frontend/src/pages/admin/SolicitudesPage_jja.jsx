// ============================================================
// SolicitudesPage_jja.jsx — Gestión de Solicitudes + Escaneo
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect } from 'react'
import { apiRequest } from '../../utils/api'
import { useToast_jja } from '../../context/ToastContext_jja'
import DataTable_jja from '../../components/ui_jja/DataTable_jja'
import StatusBadge_jja from '../../components/ui_jja/StatusBadge_jja'
import ConfirmModal_jja from '../../components/ui_jja/ConfirmModal_jja'
import { IconoCheck_jja, IconoCerrar_jja, IconoQR_jja } from '../../components/ui_jja/Iconos_jja'

const API_BASE = 'http://localhost:8000'

// Helper para resolver URL de imagen de activo
function resolverImgActivo(fila) {
  if (fila.imagenes_jja && Array.isArray(fila.imagenes_jja) && fila.imagenes_jja.length > 0) {
    return `${API_BASE}${fila.imagenes_jja[0]}`
  }
  if (typeof fila.imagenes_jja === 'string') {
    try {
      const arr = JSON.parse(fila.imagenes_jja)
      if (Array.isArray(arr) && arr.length > 0) return `${API_BASE}${arr[0]}`
      return `${API_BASE}${fila.imagenes_jja}`
    } catch { return `${API_BASE}${fila.imagenes_jja}` }
  }
  return null
}

// Helper para resolver URL de imagen de usuario/cliente
function resolverImgUsuario(path) {
  if (!path) return null
  return `${API_BASE}${path}`
}

const SolicitudesPage_jja = () => {
  const [tabActivo_jja, setTabActivo_jja] = useState('prestamos')
  const [solicitudes_jja, setSolicitudes_jja] = useState([])
  const [devoluciones_jja, setDevoluciones_jja] = useState([])
  const [devolucionesProd_jja, setDevolucionesProd_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)
  const toast_jja = useToast_jja()

  // ── Escaneo ─────────────────────────────────────────────────
  const [escaneoId_jja, setEscaneoId_jja] = useState('')
  const [escaneando_jja, setEscaneando_jja] = useState(false)

  // ── Confirm modal ──────────────────────────────────────────
  const [confirmar_jja, setConfirmar_jja] = useState({ visible: false, titulo: '', mensaje: '', onConfirmar: null, accion: '' })
  const [motivoRechazo_jja, setMotivoRechazo_jja] = useState('')

  useEffect(() => { cargarDatos_jja() }, [])

  async function cargarDatos_jja() {
    setCargando_jja(true)
    try {
      const [solResp, devResp, devProdResp] = await Promise.allSettled([
        apiRequest('/solicitudes-prestamo'),
        apiRequest('/solicitudes-devolucion'),
        apiRequest('/solicitudes-devolucion-productos'),
      ])
      setSolicitudes_jja(extraer_jja(solResp))
      setDevoluciones_jja(extraer_jja(devResp))
      setDevolucionesProd_jja(extraer_jja(devProdResp))
    } catch (err) {
      console.error(err)
      toast_jja.error('Error al cargar las solicitudes.')
    }
    finally { setCargando_jja(false) }
  }

  function extraer_jja(r) {
    if (r.status !== 'fulfilled') return []
    const d = r.value
    if (d?.datos && Array.isArray(d.datos)) return d.datos
    if (Array.isArray(d)) return d
    return []
  }

  // ── Cambiar estado (Aprobar/Rechazar) ──────────────────────
  async function cambiarEstado_jja(tipo, id, estado, tipoItemBackend = null) {
    let estadoBackend = estado;
    if ((tipo === 'prestamos' || tipo === 'devoluciones') && estado === 'aprobada') {
      estadoBackend = 'en_proceso';
    }
    const accion = estado === 'aprobada' ? 'aprobar' : 'rechazar'
    if (estado !== 'aprobada') setMotivoRechazo_jja('')

    setConfirmar_jja({
      visible: true,
      titulo: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} solicitud?`,
      mensaje: `Esta acción cambiará el estado de la solicitud a "${estado}".`,
      accion: estado,
      onConfirmar: async (motivo) => {
        try {
          const endpoints = {
            prestamos: `/solicitudes-prestamo/${id}/estado`,
            devoluciones: `/solicitudes-devolucion/${id}/estado`,
            devolucionesProd: `/solicitudes-devolucion-productos/${id}/estado`,
          }
          await apiRequest(endpoints[tipo], {
            method: 'PATCH',
            body: JSON.stringify({
              estado: estadoBackend,
              tipo: tipoItemBackend,
              observaciones_jja: motivo
            })
          })
          toast_jja.exito(`Solicitud de ${tipo === 'prestamos' ? 'préstamo' : 'devolución'} enviada a ${estadoBackend === 'en_proceso' ? 'proceso' : estado}.`)
          cargarDatos_jja()
        } catch (err) {
          toast_jja.error('Error: ' + err.message)
        }
        setConfirmar_jja(prev => ({ ...prev, visible: false }))
      },
    })
  }

  // ── Escaneo de activo ──────────────────────────────────────
  const manejarEscaneo_jja = async (e) => {
    if (e.key !== 'Enter' || !escaneoId_jja.trim()) return
    setEscaneando_jja(true)
    try {
      const respuesta = await apiRequest('/escaneo', {
        method: 'POST',
        body: JSON.stringify({ id_activo: escaneoId_jja.trim() }),
      })

      const accion = respuesta?.datos?.action || respuesta?.action || 'procesado'
      const mensaje = respuesta?.datos?.message || respuesta?.mensaje || 'Operación realizada.'

      if (respuesta?.exito || respuesta?.status === 'success') {
        toast_jja.exito(`✅ ${mensaje} (${accion === 'entrega' ? 'Entrega' : accion === 'devolucion' ? 'Devolución' : accion})`)
        cargarDatos_jja()
      } else {
        toast_jja.error(mensaje)
      }
    } catch (err) {
      toast_jja.error('Error al escanear: ' + err.message)
    } finally {
      setEscaneoId_jja('')
      setEscaneando_jja(false)
    }
  }

  // Formato fecha/hora
  const formatFechaHora = (v) => {
    if (!v) return '—'
    const d = new Date(v)
    const fecha = d.toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
    const hora = d.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
    return { fecha, hora }
  }

  // ── Columnas ───────────────────────────────────────────────
  const colsSolicitudes_jja = [
    {
      clave: 'producto_nombre', titulo: 'Producto', render: (v, f) => {
        const imgUrl = resolverImgActivo(f)
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {imgUrl ? (
              <img src={imgUrl} alt="Activo" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '2px solid var(--borde-jja)' }} />
            ) : (
              <div className="datatable-avatar-jja" style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: '0.9rem' }}>
                {(v || f.nombre_activo_jja || f.activo_nombre || 'A')[0].toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{v || f.nombre_activo_jja || f.activo_nombre || `Activo #${f.id_activo_jja || '—'}`}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--texto-terciario-jja)', marginTop: 2 }}>
                ID: {f.id_activo_jja || '—'}
                {f.tipo_solicitud_jja && ` · ${f.tipo_solicitud_jja}`}
              </div>
            </div>
          </div>
        )
      }
    },
    {
      clave: 'cliente_nombre', titulo: 'Cliente', render: (v, f) => {
        const clienteImg = resolverImgUsuario(f.cliente_imagen)
        const nombre = v || `Cliente #${f.id_cliente_jja || '—'}`
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {clienteImg ? (
              <img src={clienteImg} alt="Cliente" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--borde-jja)' }} />
            ) : (
              <div className="datatable-avatar-jja" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '0.75rem' }}>
                {nombre[0].toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{nombre}</div>
              {f.cliente_correo && <div style={{ fontSize: '0.7rem', color: 'var(--texto-terciario-jja)' }}>{f.cliente_correo}</div>}
              {f.cliente_cedula && <div style={{ fontSize: '0.68rem', color: 'var(--texto-terciario-jja)' }}>CI: {f.cliente_cedula}</div>}
            </div>
          </div>
        )
      }
    },
    { clave: 'cantidad_jja', titulo: 'Cant.', render: (v) => <span style={{ fontWeight: 600, color: 'var(--color-primario-jja)' }}>x{v || 1}</span> },
    {
      clave: 'fecha_solicitud_jja', titulo: 'Fecha / Hora', render: (v) => {
        const fh = formatFechaHora(v)
        if (fh === '—') return '—'
        return (
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{fh.fecha}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--texto-terciario-jja)' }}>{fh.hora}</div>
          </div>
        )
      }
    },
    { clave: 'estado_jja', titulo: 'Estado', render: (v) => <StatusBadge_jja estado={v} /> },
  ]

  const colsDevoluciones_jja = [
    {
      clave: 'id_prestamo_jja', titulo: 'Producto / Préstamo', render: (v, f) => {
        const imgUrl = resolverImgActivo(f)
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {imgUrl ? (
              <img src={imgUrl} alt="Activo" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '2px solid var(--borde-jja)' }} />
            ) : (
              <div className="datatable-avatar-jja" style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: '0.9rem' }}>
                {(f.activo_nombre || f.producto_nombre || 'P')[0].toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{f.activo_nombre || f.producto_nombre || `Préstamo #${v}`}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--texto-terciario-jja)', marginTop: 2 }}>Devolución · Préstamo #{v}</div>
            </div>
          </div>
        )
      }
    },
    {
      clave: 'solicitante_nombre', titulo: 'Solicitante', render: (v, f) => {
        const nombre = v || `ID ${f.id_usuario_solicitante_jja}`
        const solImg = resolverImgUsuario(f.solicitante_imagen)
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {solImg ? (
              <img src={solImg} alt="Solicitante" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--borde-jja)' }} />
            ) : (
              <div className="datatable-avatar-jja" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '0.75rem' }}>
                {nombre[0].toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{nombre}</div>
              {f.solicitante_apellido && <div style={{ fontSize: '0.7rem', color: 'var(--texto-terciario-jja)' }}>{f.solicitante_apellido}</div>}
            </div>
          </div>
        )
      }
    },
    { clave: 'observaciones_jja', titulo: 'Observaciones', render: (v) => <span style={{ fontSize: '0.82rem', maxWidth: 150, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v || '—'}</span> },
    {
      clave: 'creado_en_jja', titulo: 'Fecha / Hora', render: (v) => {
        const fh = formatFechaHora(v)
        if (fh === '—') return '—'
        return (
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{fh.fecha}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--texto-terciario-jja)' }}>{fh.hora}</div>
          </div>
        )
      }
    },
    { clave: 'estado_jja', titulo: 'Estado', render: (v) => <StatusBadge_jja estado={v} /> },
  ]

  const tabs_jja = [
    { clave: 'prestamos', label: 'Solicitudes de Préstamo', count: solicitudes_jja.filter(s => (s.estado_jja || '') === 'pendiente').length },
    { clave: 'devoluciones', label: 'Devoluciones Activos', count: devoluciones_jja.filter(d => (d.estado_jja || '') === 'pendiente').length },
  ]

  const datosActivos_jja = tabActivo_jja === 'prestamos' ? solicitudes_jja : tabActivo_jja === 'devoluciones' ? devoluciones_jja : devolucionesProd_jja
  const colsActivas_jja = tabActivo_jja === 'prestamos' ? colsSolicitudes_jja : colsDevoluciones_jja

  const keyId_jja = tabActivo_jja === 'prestamos' ? 'id_solicitud_jja' : tabActivo_jja === 'devoluciones' ? 'id_solicitud_devolucion_jja' : 'id_solicitud_devolucion_producto_jja'

  return (
    <div>
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja">Solicitudes</h1>
          <p className="pagina-subtitulo-jja">Revisa y responde solicitudes de préstamo y devolución</p>
        </div>
      </div>

      {/* ── Input de Escaneo + Tabs ───────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div className="tabs-jja" style={{ marginBottom: 0 }}>
          {tabs_jja.map(t => (
            <button
              key={t.clave}
              className={`tab-btn-jja ${tabActivo_jja === t.clave ? 'activo-jja' : ''}`}
              onClick={() => setTabActivo_jja(t.clave)}
            >
              {t.label} {t.count > 0 && <span className="sidebar-item-badge-jja" style={{ marginLeft: 6 }}>{t.count}</span>}
            </button>
          ))}
        </div>

        {/* Input de Escaneo */}
        <div className="escaneo-input-wrapper-jja">
          <span className="escaneo-icono-jja"><IconoQR_jja /></span>
          <input
            type="text"
            placeholder="Escanear activo (ID)..."
            value={escaneoId_jja}
            onChange={(e) => setEscaneoId_jja(e.target.value)}
            onKeyDown={manejarEscaneo_jja}
            disabled={escaneando_jja}
            autoComplete="off"
          />
        </div>
      </div>

      <DataTable_jja
        columnas={colsActivas_jja}
        datos={datosActivos_jja}
        cargando={cargando_jja}
        placeholderBusqueda="Buscar solicitud..."
        acciones={(fila) => (fila.estado_jja || '') === 'pendiente' ? (
          <>
            <button className="datatable-accion-btn-jja aprobar-jja" title="Aprobar" onClick={() => cambiarEstado_jja(tabActivo_jja, fila[keyId_jja], 'aprobada', fila.tipo_jja)}><IconoCheck_jja /></button>
            <button className="datatable-accion-btn-jja eliminar-jja" title="Rechazar" onClick={() => cambiarEstado_jja(tabActivo_jja, fila[keyId_jja], 'rechazada', fila.tipo_jja)}><IconoCerrar_jja /></button>
          </>
        ) : <StatusBadge_jja estado={fila.estado_jja} conPunto={false} />}
      />

      {/* Modal Confirmar */}
      <ConfirmModal_jja
        visible={confirmar_jja.visible}
        titulo={confirmar_jja.titulo}
        mensaje={confirmar_jja.mensaje}
        textoConfirmar="Confirmar"
        variante="advertencia"
        onConfirmar={() => confirmar_jja.onConfirmar(motivoRechazo_jja)}
        onCancelar={() => setConfirmar_jja(prev => ({ ...prev, visible: false }))}
      >
        {confirmar_jja.accion === 'rechazada' && (
          <div className="form-grupo-jja" style={{ marginTop: 16, textAlign: 'left' }}>
            <label className="form-label-jja" style={{ fontWeight: 600 }}>Motivo de rechazo (Opcional)</label>
            <textarea
              className="form-input-jja form-textarea-jja"
              placeholder="Escribe aquí el motivo del rechazo..."
              value={motivoRechazo_jja}
              onChange={(e) => setMotivoRechazo_jja(e.target.value)}
              rows="3"
              style={{ minHeight: '80px', marginTop: '8px', fontSize: '0.9rem' }}
            />
          </div>
        )}
      </ConfirmModal_jja>
    </div>
  )
}

export default SolicitudesPage_jja
