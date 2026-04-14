// ============================================================
// MarketplacePage_jja.jsx — Marketplace profesional para Cliente
// Grid e-commerce, filtros, modal solicitud, paginación
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
import ModalSancion_jja from '../../components/ui_jja/ModalSancion_jja'
import {
  IconoBuscar_jja, IconoMarketplace_jja, IconoCarrito_jja,
  IconoFiltrar_jja, IconoChevronIzq_jja, IconoChevronDer_jja,
  IconoImagen_jja,
} from '../../components/ui_jja/Iconos_jja'


const ITEMS_POR_PAGINA = 12

const MarketplacePage_jja = () => {
  const { mostrarModal } = useModal_jja()
  const [productos_jja, setProductos_jja] = useState([])
  const [tipos_jja, setTipos_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)
  const [busqueda_jja, setBusqueda_jja] = useState('')
  const [tipoFiltro_jja, setTipoFiltro_jja] = useState('')
  const [orden_jja, setOrden_jja] = useState('nombre_asc')
  const [pagina_jja, setPagina_jja] = useState(1)

  // Modal de solicitud
  const [modalVisible_jja, setModalVisible_jja] = useState(false)
  const [productoSeleccionado_jja, setProductoSeleccionado_jja] = useState(null)
  const [observaciones_jja, setObservaciones_jja] = useState('')
  const [enviando_jja, setEnviando_jja] = useState(false)
  const [errorMotivo_jja, setErrorMotivo_jja] = useState('')

  // Modal de sanción bloqueante
  const [modalSancion_jja, setModalSancion_jja] = useState({ visible: false, motivo: '' })

  useEffect(() => { cargarDatos() }, [])

  async function cargarDatos() {
    try {
      const [activosResp, tiposResp] = await Promise.allSettled([
        apiRequest('/activos'),
        apiRequest('/tipos-activos'),
      ])
      // Solo activos publicados (Mostrar todos los estados para que el cliente sepa qué está prestado)
      const activos = extraerLista(activosResp)
      const publicados = activos.filter(a =>
        a.publicado_jja || a.publicado_jja === 1
      )
      setProductos_jja(publicados)
      setTipos_jja(extraerLista(tiposResp))
    } catch (err) { console.error(err) }
    finally { setCargando_jja(false) }
  }

  function extraerLista(r) {
    if (r.status !== 'fulfilled') return []
    const d = r.value
    if (Array.isArray(d)) return d
    if (d?.datos && Array.isArray(d.datos)) return d.datos
    if (d?.activos && Array.isArray(d.activos)) return d.activos
    return []
  }

  // Extraer imagen del activo
  function obtenerImagen(activo) {
    try {
      if (!activo.imagenes_jja) return null
      let imgs = activo.imagenes_jja
      if (typeof imgs === 'string') imgs = JSON.parse(imgs)
      if (Array.isArray(imgs) && imgs.length > 0) return imgs[0]
    } catch (e) { /* silenciar */ }
    return null
  }

  // ── Verificar sanción antes de solicitar ──
  async function verificarSancionAntesDeSolicitar_jja(producto) {
    try {
      const resp_jja = await apiRequest('/lista-negra/verificar')
      const datos_jja = resp_jja?.datos || resp_jja
      if (datos_jja?.tiene_sancion_activa === 1 || datos_jja?.tiene_sancion_activa === '1') {
        // Usuario sancionado — mostrar modal rojo
        setModalSancion_jja({ visible: true, motivo: datos_jja?.motivo || '' })
        return
      }
    } catch (err) {
      // Si falla la verificación, permitir continuar
      console.warn('Error al verificar sanción:', err)
    }
    // No está sancionado — abrir modal de solicitud
    setProductoSeleccionado_jja(producto)
    setObservaciones_jja('')
    setErrorMotivo_jja('')
    setModalVisible_jja(true)
  }

  // Solicitar préstamo
  const abrirSolicitud = (producto) => {
    verificarSancionAntesDeSolicitar_jja(producto)
  }

  const enviarSolicitud = async () => {
    if (!productoSeleccionado_jja) return
    if (!observaciones_jja.trim()) {
      setErrorMotivo_jja('El motivo de la solicitud es obligatorio.')
      return
    }
    setErrorMotivo_jja('')
    setEnviando_jja(true)
    try {
      await apiRequest(`/activos/${productoSeleccionado_jja.id_activo_jja}/solicitudes`, {
        method: 'POST',
        body: JSON.stringify({ observaciones: observaciones_jja.trim() })
      })
      setModalVisible_jja(false)
      // Mostrar confirmación visual y recargar la cuadrícula para actualizar el estado
      mostrarModal({ mensaje: 'Solicitud de préstamo enviada exitosamente', tipo: 'success' })
      cargarDatos()
    } catch (err) {
      mostrarModal({ mensaje: 'Error: ' + err.message, tipo: 'error' })
    } finally {
      setEnviando_jja(false)
    }
  }

  // Filtrado
  const productosFiltrados_jja = useMemo(() => {
    let resultado = productos_jja
    if (busqueda_jja.trim()) {
      const termino = busqueda_jja.toLowerCase()
      resultado = resultado.filter(p =>
        (p.nombre_jja || '').toLowerCase().includes(termino) ||
        (p.descripcion_jja || '').toLowerCase().includes(termino) ||
        (p.nombre_tipo_jja || '').toLowerCase().includes(termino)
      )
    }
    if (tipoFiltro_jja) {
      resultado = resultado.filter(p => String(p.id_tipo_jja) === tipoFiltro_jja)
    }
    // Ordenamiento
    resultado = [...resultado].sort((a, b) => {
      switch (orden_jja) {
        case 'nombre_asc': return (a.nombre_jja || '').localeCompare(b.nombre_jja || '')
        case 'nombre_desc': return (b.nombre_jja || '').localeCompare(a.nombre_jja || '')
        case 'reciente': return new Date(b.creado_en_jja || 0) - new Date(a.creado_en_jja || 0)
        case 'antiguo': return new Date(a.creado_en_jja || 0) - new Date(b.creado_en_jja || 0)
        case 'disponible': {
          const prioridad = { 'disponible': 0, 'prestado': 1, 'mantenimiento': 2, 'inactivo': 3 }
          return (prioridad[a.estado_jja] ?? 9) - (prioridad[b.estado_jja] ?? 9)
        }
        default: return 0
      }
    })
    return resultado
  }, [productos_jja, busqueda_jja, tipoFiltro_jja, orden_jja])

  // Paginación
  const totalPaginas = Math.ceil(productosFiltrados_jja.length / ITEMS_POR_PAGINA) || 1
  const paginaActual = Math.min(pagina_jja, totalPaginas)
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA
  const productosPagina = productosFiltrados_jja.slice(inicio, inicio + ITEMS_POR_PAGINA)

  return (
    <div>
      {/* Header */}
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja">Marketplace</h1>
          <p className="pagina-subtitulo-jja">Explora y solicita activos disponibles para préstamo</p>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="marketplace-filtros-jja">
        <div className="marketplace-buscar-jja">
          <span className="marketplace-buscar-icono-jja"><IconoBuscar_jja /></span>
          <input
            type="text"
            value={busqueda_jja}
            onChange={(e) => { setBusqueda_jja(e.target.value); setPagina_jja(1) }}
            placeholder="Buscar activos por nombre, tipo o descripción..."
          />
        </div>
        <div className="marketplace-filtro-tipo-jja">
          <IconoFiltrar_jja style={{ fontSize: '0.9rem', color: 'var(--texto-terciario-jja)' }} />
          <select
            value={tipoFiltro_jja}
            onChange={(e) => { setTipoFiltro_jja(e.target.value); setPagina_jja(1) }}
          >
            <option value="">Todos los tipos</option>
            {tipos_jja.map(t => (
              <option key={t.id_tipo_jja} value={t.id_tipo_jja}>{t.nombre_tipo_jja}</option>
            ))}
          </select>
        </div>
        <div className="marketplace-filtro-tipo-jja">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--texto-terciario-jja)' }}>
            <path d="M11 5h10"/><path d="M11 9h7"/><path d="M11 13h4"/><path d="M3 17l3 3 3-3"/><path d="M6 18V4"/>
          </svg>
          <select
            value={orden_jja}
            onChange={(e) => { setOrden_jja(e.target.value); setPagina_jja(1) }}
          >
            <option value="nombre_asc">Nombre A-Z</option>
            <option value="nombre_desc">Nombre Z-A</option>
            <option value="reciente">Más reciente</option>
            <option value="antiguo">Más antiguo</option>
            <option value="disponible">Disponibles primero</option>
          </select>
        </div>
      </div>

      {/* Grid de productos */}
      {cargando_jja ? (
        <div className="marketplace-grid-jja">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="marketplace-card-jja marketplace-card-skeleton-jja">
              <div className="marketplace-card-img-jja skeleton-jja" style={{ height: 180 }} />
              <div className="marketplace-card-body-jja">
                <div className="skeleton-jja" style={{ height: 20, width: '70%', marginBottom: 8 }} />
                <div className="skeleton-jja" style={{ height: 14, width: '40%', marginBottom: 12 }} />
                <div className="skeleton-jja" style={{ height: 36, width: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : productosPagina.length === 0 ? (
        <EmptyState_jja
          icono={<IconoMarketplace_jja style={{ fontSize: '3rem' }} />}
          titulo="No hay activos disponibles"
          descripcion={busqueda_jja || tipoFiltro_jja
            ? 'No se encontraron activos con los filtros aplicados. Intenta otra búsqueda.'
            : 'No hay activos publicados en el marketplace en este momento.'}
        />
      ) : (
        <>
          <div className="marketplace-grid-jja">
            {productosPagina.map(p => {
              const imgSrc = obtenerImagen(p)
              return (
                <div key={p.id_activo_jja} className="marketplace-card-jja">
                  {/* Imagen */}
                  <div className="marketplace-card-img-jja">
                    {imgSrc ? (
                      <img src={imgSrc} alt={p.nombre_jja} />
                    ) : (
                      <div className="marketplace-card-placeholder-jja">
                        <IconoImagen_jja style={{ fontSize: '2.5rem' }} />
                      </div>
                    )}
                    <div className="marketplace-card-badge-jja">
                      <StatusBadge_jja estado={p.estado_jja} conPunto={false} />
                    </div>
                  </div>

                  {/* Cuerpo */}
                  <div className="marketplace-card-body-jja">
                    <div className="marketplace-card-tipo-jja">
                      {p.nombre_tipo_jja || 'Sin tipo'}
                    </div>
                    <h3 className="marketplace-card-nombre-jja">{p.nombre_jja}</h3>
                    <p className="marketplace-card-desc-jja">
                      {p.descripcion_jja
                        ? p.descripcion_jja.length > 80
                          ? p.descripcion_jja.substring(0, 80) + '...'
                          : p.descripcion_jja
                        : 'Sin descripción disponible'}
                    </p>
                    {p.ubicacion_jja && (
                      <div className="marketplace-card-ubicacion-jja">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {p.ubicacion_jja}
                      </div>
                    )}
                    <BotonAccion_jja
                      variante={p.estado_jja === 'disponible' ? 'primario' : 'secundario'}
                      block
                      disabled={p.estado_jja !== 'disponible'}
                      icono={<IconoCarrito_jja />}
                      onClick={() => p.estado_jja === 'disponible' && abrirSolicitud(p)}
                      title={p.estado_jja !== 'disponible' ? 'Este activo no está disponible actualmente' : ''}
                    >
                      {p.estado_jja === 'disponible' ? 'Solicitar Préstamo' : 'No Disponible'}
                    </BotonAccion_jja>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="marketplace-paginacion-jja">
              <button
                className="datatable-paginar-btn-jja"
                onClick={() => setPagina_jja(p => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
              >
                <IconoChevronIzq_jja />
              </button>
              <span className="marketplace-paginacion-info-jja">
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                className="datatable-paginar-btn-jja"
                onClick={() => setPagina_jja(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaActual === totalPaginas}
              >
                <IconoChevronDer_jja />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de solicitud */}
      <ActionModal_jja
        visible={modalVisible_jja}
        titulo="Solicitar Préstamo"
        onCerrar={() => setModalVisible_jja(false)}
        onConfirmar={enviarSolicitud}
        textoConfirmar="Confirmar Solicitud"
        cargando={enviando_jja}
        variante="primario"
        ancho="500px"
      >
        {productoSeleccionado_jja && (
          <div>
            {/* Info del activo */}
            <div className="marketplace-modal-activo-jja">
              <div className="marketplace-modal-img-jja">
                {obtenerImagen(productoSeleccionado_jja) ? (
                  <img src={obtenerImagen(productoSeleccionado_jja)} alt={productoSeleccionado_jja.nombre_jja} />
                ) : (
                  <div className="marketplace-card-placeholder-jja" style={{ height: 80, borderRadius: 8 }}>
                    <IconoImagen_jja />
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>
                  {productoSeleccionado_jja.nombre_jja}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <StatusBadge_jja estado={productoSeleccionado_jja.estado_jja} />
                  <span style={{ fontSize: '0.78rem', color: 'var(--texto-secundario-jja)' }}>
                    {productoSeleccionado_jja.nombre_tipo_jja}
                  </span>
                </div>
              </div>
            </div>

            {/* Motivo (obligatorio) */}
            <FormGroup_jja
              label="Motivo de la solicitud"
              nombre="observaciones"
              tipo="textarea"
              valor={observaciones_jja}
              onChange={(_, v) => { setObservaciones_jja(v); if (v.trim()) setErrorMotivo_jja('') }}
              placeholder="Describe el motivo de tu solicitud..."
              helper="Obligatorio: explica para qué necesitas este activo"
              requerido
              error={errorMotivo_jja}
            />
          </div>
        )}
      </ActionModal_jja>

      {/* Modal de sanción — se muestra al intentar solicitar estando sancionado */}
      <ModalSancion_jja
        visible={modalSancion_jja.visible}
        motivo={modalSancion_jja.motivo}
        onCerrar={() => setModalSancion_jja({ visible: false, motivo: '' })}
      />
    </div>
  )
}

export default MarketplacePage_jja
