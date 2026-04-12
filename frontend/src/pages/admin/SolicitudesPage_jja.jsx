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
import ModalEscaneoQR_jja from '../../components/ui_jja/ModalEscaneoQR_jja'
import { IconoCheck_jja, IconoCerrar_jja } from '../../components/ui_jja/Iconos_jja'

// Helper para resolver URL de imagen de activo
function resolverImgActivo(fila) {
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

// Helper para resolver URL de imagen de usuario/cliente
function resolverImgUsuario(path) {
  return path || null
}

const SolicitudesPage_jja = () => {
  const [tabActivo_jja, setTabActivo_jja] = useState('prestamos')
  const [solicitudes_jja, setSolicitudes_jja] = useState([])
  const [devoluciones_jja, setDevoluciones_jja] = useState([])
  const [devolucionesProd_jja, setDevolucionesProd_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)
  const toast_jja = useToast_jja()

  // ── Confirm modal ──────────────────────────────────────────
  const [confirmar_jja, setConfirmar_jja] = useState({ visible: false, titulo: '', mensaje: '', onConfirmar: null, accion: '' })
  const [motivoRechazo_jja, setMotivoRechazo_jja] = useState('')

  // ── Modal QR (paso 2 de aprobación) ───────────────────────
  const [modalQR_jja, setModalQR_jja] = useState({ visible: false, idActivo: null, nombreActivo: '' })

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

  // ── Aprobar préstamo: paso 1 (avanzar estado) + paso 2 (modal QR) ─
  async function aprobarPrestamo_jja(id, fila) {
    try {
      await apiRequest(`/solicitudes-prestamo/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: 'en_proceso' }),
      })
      setModalQR_jja({
        visible: true,
        idActivo: fila.id_activo_jja,
        nombreActivo: fila.producto_nombre || fila.nombre_activo_jja || `Activo #${fila.id_activo_jja}`,
      })
    } catch (err) {
      toast_jja.error('Error al aprobar solicitud: ' + err.message)
    }
  }

  // ── Rechazar / cambiar estado (devoluciones) ───────────────
  async function cambiarEstado_jja(tipo, id, estado, tipoItemBackend = null, fila = null) {
    // Aprobación de préstamo va por flujo QR
    if (tipo === 'prestamos' && estado === 'aprobada') {
      aprobarPrestamo_jja(id, fila)
      return
    }

    let estadoBackend = estado
    if (tipo === 'devoluciones' && estado === 'aprobada') estadoBackend = 'en_proceso'
    setMotivoRechazo_jja('')

    setConfirmar_jja({
      visible: true,
      titulo: estado === 'aprobada' ? '¿Aprobar solicitud?' : '¿Rechazar solicitud?',
      mensaje: `Esta acción cambiará el estado de la solicitud.`,
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
            body: JSON.stringify({ estado: estadoBackend, tipo: tipoItemBackend, observaciones_jja: motivo })
          })
          toast_jja.exito(`Solicitud ${estado === 'aprobada' ? 'aprobada' : 'rechazada'} correctamente.`)
          cargarDatos_jja()
        } catch (err) {
          toast_jja.error('Error: ' + err.message)
        }
        setConfirmar_jja(prev => ({ ...prev, visible: false }))
      },
    })
  }

  // ── Éxito del escaneo QR ───────────────────────────────────
  function manejarExitoQR_jja(res) {
    const mensaje = res?.datos?.message || res?.mensaje || 'Entrega confirmada.'
    toast_jja.exito(`Entrega confirmada: ${mensaje}`)
    setModalQR_jja({ visible: false, idActivo: null, nombreActivo: '' })
    cargarDatos_jja()
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

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div className="tabs-jja" style={{ marginBottom: 16 }}>
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

      <DataTable_jja
        columnas={colsActivas_jja}
        datos={datosActivos_jja}
        cargando={cargando_jja}
        placeholderBusqueda="Buscar solicitud..."
        acciones={(fila) => (fila.estado_jja || '') === 'pendiente' ? (
          <>
            <button className="datatable-accion-btn-jja aprobar-jja" title="Aprobar" onClick={() => cambiarEstado_jja(tabActivo_jja, fila[keyId_jja], 'aprobada', fila.tipo_jja, fila)}><IconoCheck_jja /></button>
            <button className="datatable-accion-btn-jja eliminar-jja" title="Rechazar" onClick={() => cambiarEstado_jja(tabActivo_jja, fila[keyId_jja], 'rechazada', fila.tipo_jja, fila)}><IconoCerrar_jja /></button>
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

      {/* Modal QR — Paso 2: confirmar entrega física */}
      <ModalEscaneoQR_jja
        visible={modalQR_jja.visible}
        idActivo_jja={modalQR_jja.idActivo}
        nombreActivo_jja={modalQR_jja.nombreActivo}
        onExito={manejarExitoQR_jja}
        onCerrar={() => {
          setModalQR_jja({ visible: false, idActivo: null, nombreActivo: '' })
          cargarDatos_jja()
        }}
      />
    </div>
  )
}

export default SolicitudesPage_jja
