// ============================================================
// InventarioPage_jja.jsx — Gestion de Inventario de Activos
// Con codigos QR visibles y generacion de QR
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect } from 'react'
import { apiRequest } from '../../utils/api'
import { useToast_jja } from '../../context/ToastContext_jja'
import DataTable_jja from '../../components/ui_jja/DataTable_jja'
import StatusBadge_jja from '../../components/ui_jja/StatusBadge_jja'
import BotonAccion_jja from '../../components/ui_jja/BotonAccion_jja'
import ActionModal_jja from '../../components/ui_jja/ActionModal_jja'
import FormGroup_jja from '../../components/ui_jja/FormGroup_jja'
import {
  IconoPlus_jja, IconoEditar_jja, IconoEliminar_jja,
  IconoVer_jja, IconoQR_jja, IconoExportar_jja,
} from '../../components/ui_jja/Iconos_jja'
import ConfirmModal_jja from '../../components/ui_jja/ConfirmModal_jja'

// ── Icono de inhabilitar (prohibido/círculo con barra) ──
const IconoInhabilitar_jja = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
)
const IconoHabilitar_jja = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const ESTADO_COLORES = {
  disponible: '#10b981', prestado: '#3b82f6', mantenimiento: '#8b5cf6',
  dañado: '#ef4444', perdido: '#6b7280', en_proceso_prestamo: '#f59e0b'
}

// Estados que bloquean edicion/eliminacion
const ESTADOS_BLOQUEADOS = ['prestado', 'en_proceso_prestamo']

// ── Generador simple de QR con API publica ───────────────────
const generarUrlQR = (texto, tamaño = 180) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${tamaño}x${tamaño}&data=${encodeURIComponent(texto)}&margin=8&format=svg`

const InventarioPage_jja = () => {
  const [activos_jja, setActivos_jja] = useState([])
  const [tipos_jja, setTipos_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)
  const toast_jja = useToast_jja()
  const [confirmarElim_jja, setConfirmarElim_jja] = useState({ visible: false, fila: null })

  // Filtro por estado
  const [filtroEstado_jja, setFiltroEstado_jja] = useState('')

  // Modal Crear/Editar
  const [modalVisible_jja, setModalVisible_jja] = useState(false)
  const [editando_jja, setEditando_jja] = useState(null)
  const [form_jja, setForm_jja] = useState({
    nombre: '', id_tipo: '', ubicacion: '', descripcion: '',
    publicado: false,
  })
  const [guardando_jja, setGuardando_jja] = useState(false)

  // Estados de Imagen
  const [imagenFichero_jja, setImagenFichero_jja] = useState(null)
  const [imagenPrevia_jja, setImagenPrevia_jja] = useState(null)
  const [arrastrando_jja, setArrastrando_jja] = useState(false)
  const [modalAlerta_jja, setModalAlerta_jja] = useState({ visible: false, titulo: '', mensaje: '' })

  // Modal Detalle QR
  const [detalleVisible_jja, setDetalleVisible_jja] = useState(false)
  const [activoDetalle_jja, setActivoDetalle_jja] = useState(null)

  // Modal Inhabilitar/Habilitar
  const [modalInhabilitar_jja, setModalInhabilitar_jja] = useState({ visible: false, fila: null })
  const [motivoInhabilitar_jja, setMotivoInhabilitar_jja] = useState('dañado')
  const [procesandoInhabilitar_jja, setProcesandoInhabilitar_jja] = useState(false)

  useEffect(() => { cargarDatos() }, [])

  async function cargarDatos() {
    try {
      const [activosResp, tiposResp] = await Promise.all([
        apiRequest('/activos'),
        apiRequest('/tipos-activos'),
      ])
      setActivos_jja(Array.isArray(activosResp) ? activosResp : activosResp?.datos || [])
      setTipos_jja(Array.isArray(tiposResp) ? tiposResp : tiposResp?.datos || [])
    } catch (err) {
      console.error(err)
      toast_jja.error('Error al cargar el inventario.')
    }
    finally { setCargando_jja(false) }
  }

  // Filtrar por estado
  const activosFiltrados_jja = filtroEstado_jja
    ? activos_jja.filter(a => (a.estado_jja || '').toLowerCase() === filtroEstado_jja)
    : activos_jja

  // ── Columnas de la tabla ───────────────────────────────────
  const columnas = [
    {
      clave: 'nombre_jja', titulo: 'Activo', render: (val, fila) => {
        let imgUrl = null;
        if (Array.isArray(fila.imagenes_jja) && fila.imagenes_jja.length > 0) {
          imgUrl = fila.imagenes_jja[0];
        }

        return (
          <div className="datatable-avatar-celda-jja">
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={val}
                className="datatable-avatar-jja"
                style={{ objectFit: 'contain', border: '2px solid var(--border-color-jja)', background: '#f1f5f9' }}
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex') }}
              />
            ) : null}
            {!imgUrl && (
              <div className="datatable-avatar-jja" style={{ background: ESTADO_COLORES[fila.estado_jja] || '#94a3b8' }}>
                {(val || '?')[0].toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 600 }}>{val}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--texto-terciario-jja)' }}>{fila.nombre_tipo_jja}</div>
            </div>
          </div>
        )
      }
    },
    {
      clave: 'codigo_qr_jja', titulo: 'Código QR', ancho: 200, sortable: false, render: (val, fila) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Mini QR */}
          <img
            src={generarUrlQR(val || 'N/A', 36)}
            alt="QR"
            style={{ width: 36, height: 36, borderRadius: 4, border: '1px solid var(--border-color-jja)', background: 'white', padding: 2, flexShrink: 0 }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, fontFamily: 'monospace', color: 'var(--color-primario-jja)' }}>
              {val || '—'}
            </div>
          </div>
        </div>
      )
    },
    { clave: 'ubicacion_jja', titulo: 'Ubicacion', render: (val) => val || '—' },
    {
      clave: 'estado_jja', titulo: 'Estado', render: (val) => <StatusBadge_jja estado={val} />
    },
    {
      clave: 'publicado_jja', titulo: 'Publicado', render: (val) => (
        <span style={{ color: val ? 'var(--color-exito-jja)' : 'var(--texto-terciario-jja)', fontWeight: 600, fontSize: '0.82rem' }}>
          {val ? 'Si' : 'No'}
        </span>
      )
    },
  ]

  // ── Handlers de CRUD ──────────────────────────────────────
  const abrirCrear = () => {
    setEditando_jja(null)
    setForm_jja({ nombre: '', id_tipo: '', ubicacion: '', descripcion: '', publicado: false })
    setImagenFichero_jja(null)
    setImagenPrevia_jja(null)
    setModalVisible_jja(true)
  }

  const abrirEditar = (fila) => {
    if (ESTADOS_BLOQUEADOS.includes(fila.estado_jja)) return
    setEditando_jja(fila)
    setForm_jja({
      nombre: fila.nombre_jja || '',
      id_tipo: fila.id_tipo_jja || '',
      ubicacion: fila.ubicacion_jja || '',
      descripcion: fila.descripcion_jja || '',
      publicado: !!fila.publicado_jja,
    })
    setImagenFichero_jja(null)
    setImagenPrevia_jja(Array.isArray(fila.imagenes_jja) && fila.imagenes_jja.length > 0 ? fila.imagenes_jja[0] : null)
    setModalVisible_jja(true)
  }

  const abrirDetalle = (fila) => {
    setActivoDetalle_jja(fila)
    setDetalleVisible_jja(true)
  }

  const handleGuardar = async () => {
    setGuardando_jja(true)
    try {
      const body = {
        nombre: form_jja.nombre,
        id_tipo: Number(form_jja.id_tipo),
        ubicacion: form_jja.ubicacion,
        descripcion: form_jja.descripcion,
        publicado: form_jja.publicado ? 1 : 0,
      }
      let idActivo = editando_jja?.id_activo_jja;
      if (editando_jja) {
        await apiRequest(`/activos/${idActivo}`, { method: 'PUT', body: JSON.stringify(body) })
      } else {
        const res = await apiRequest('/activos', { method: 'POST', body: JSON.stringify(body) })
        idActivo = res?.datos?.id_activo_jja || editando_jja?.id_activo_jja;
      }

      // Subir imagen si se selecciono una _jja
      if (imagenFichero_jja && idActivo) {
        const formData = new FormData();
        formData.append('imagen', imagenFichero_jja);
        await apiRequest(`/archivos/activo/${idActivo}`, { method: 'POST', body: formData });
      }

      setModalVisible_jja(false)
      toast_jja.exito(editando_jja ? 'Activo actualizado correctamente.' : 'Activo creado correctamente.')
      cargarDatos()
    } catch (err) { toast_jja.error('Error: ' + err.message) }
    finally { setGuardando_jja(false) }
  }

  const handleEliminar = async (fila) => {
    if (ESTADOS_BLOQUEADOS.includes(fila.estado_jja)) return
    setConfirmarElim_jja({ visible: true, fila })
  }

  const ejecutarEliminar_jja = async () => {
    const fila = confirmarElim_jja.fila
    if (!fila) return
    try {
      await apiRequest(`/activos/${fila.id_activo_jja}`, { method: 'DELETE' })
      toast_jja.exito('Activo eliminado correctamente.')
      cargarDatos()
    } catch (err) { toast_jja.error('Error: ' + err.message) }
    setConfirmarElim_jja({ visible: false, fila: null })
  }

  const handleCambioForm = (campo, valor) => setForm_jja(prev => ({ ...prev, [campo]: valor }))

  // ── Inhabilitar / Habilitar activo ──
  const abrirInhabilitar_jja = (fila) => {
    if (ESTADOS_BLOQUEADOS.includes(fila.estado_jja)) return
    const estaInhabilitado = ['dañado', 'perdido', 'mantenimiento'].includes(fila.estado_jja)
    setMotivoInhabilitar_jja(estaInhabilitado ? 'disponible' : 'dañado')
    setModalInhabilitar_jja({ visible: true, fila })
  }

  const ejecutarInhabilitar_jja = async () => {
    const fila = modalInhabilitar_jja.fila
    if (!fila) return
    setProcesandoInhabilitar_jja(true)
    try {
      await apiRequest(`/activos/${fila.id_activo_jja}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: motivoInhabilitar_jja }),
      })
      const mensaje = motivoInhabilitar_jja === 'disponible'
        ? 'Activo habilitado correctamente.'
        : 'Activo inhabilitado correctamente.'
      toast_jja.exito(mensaje)
      setModalInhabilitar_jja({ visible: false, fila: null })
      cargarDatos()
    } catch (err) { toast_jja.error('Error: ' + err.message) }
    finally { setProcesandoInhabilitar_jja(false) }
  }

  // ── Handlers de Imagen (Drag & Drop) _jja ───────────────────
  const validarImagen_jja = (file) => {
    if (!file) return false;
    const extension = file.name.split('.').pop().toLowerCase();
    const permitidas = ['jpg', 'jpeg', 'png', 'webp'];
    if (!permitidas.includes(extension)) {
      setModalAlerta_jja({ visible: true, titulo: 'Archivo no permitido', mensaje: 'Solo se aceptan imagenes con extension JPG, PNG o WEBP.' });
      return false;
    }
    return true;
  }

  const manejarSeleccionImagen_jja = (e) => {
    const file = e.target.files[0];
    if (validarImagen_jja(file)) {
      setImagenFichero_jja(file);
      setImagenPrevia_jja(URL.createObjectURL(file));
    }
  }

  const manejarArrastre_jja = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setArrastrando_jja(true);
    } else if (e.type === 'dragleave') {
      setArrastrando_jja(false);
    }
  }

  const manejarSoltar_jja = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setArrastrando_jja(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validarImagen_jja(file)) {
        setImagenFichero_jja(file);
        setImagenPrevia_jja(URL.createObjectURL(file));
      }
    }
  }

  // ── Descargar QR como imagen ────────────────────────────────
  const descargarQR = (codigoQR, nombreActivo) => {
    const enlace = document.createElement('a')
    enlace.href = generarUrlQR(codigoQR, 400)
    enlace.download = `QR_${nombreActivo}_${codigoQR}.svg`
    enlace.target = '_blank'
    enlace.click()
  }

  return (
    <div>
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja">Inventario de Activos</h1>
          <p className="pagina-subtitulo-jja">Gestion completa del inventario institucional con codigos QR</p>
        </div>
        <div className="pagina-acciones-jja">
          <BotonAccion_jja variante="primario" icono={<IconoPlus_jja />} onClick={abrirCrear}>
            Nuevo Activo
          </BotonAccion_jja>
        </div>
      </div>

      <DataTable_jja
        columnas={columnas}
        datos={activosFiltrados_jja}
        cargando={cargando_jja}
        placeholderBusqueda="Buscar activo por nombre, codigo QR o tipo..."
        filtros={
          <select
            className="datatable-filtro-select-jja"
            value={filtroEstado_jja}
            onChange={(e) => setFiltroEstado_jja(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="prestado">Prestado</option>
            <option value="en_proceso_prestamo">En proceso</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="dañado">Dañado</option>
            <option value="perdido">Perdido</option>
          </select>
        }
        acciones={(fila) => {
          const bloqueado = ESTADOS_BLOQUEADOS.includes(fila.estado_jja)
          const inhabilitado = ['dañado', 'perdido', 'mantenimiento'].includes(fila.estado_jja)
          return (
            <>
              <button className="datatable-accion-btn-jja ver-jja" title="Ver QR" onClick={() => abrirDetalle(fila)}><IconoQR_jja /></button>
              <button
                className={`datatable-accion-btn-jja editar-jja`}
                title={bloqueado ? 'No se puede editar: activo en prestamo' : 'Editar'}
                onClick={() => abrirEditar(fila)}
                disabled={bloqueado}
              ><IconoEditar_jja /></button>
              <button
                className="datatable-accion-btn-jja"
                style={{ color: inhabilitado ? '#10b981' : '#f59e0b' }}
                title={bloqueado
                  ? 'No se puede inhabilitar: activo en préstamo'
                  : (inhabilitado ? 'Habilitar activo' : 'Inhabilitar activo (dañado/perdido)')}
                onClick={() => abrirInhabilitar_jja(fila)}
                disabled={bloqueado}
              >
                {inhabilitado ? <IconoHabilitar_jja /> : <IconoInhabilitar_jja />}
              </button>
              <button
                className={`datatable-accion-btn-jja eliminar-jja`}
                title={bloqueado ? 'No se puede eliminar: activo en prestamo' : 'Eliminar'}
                onClick={() => handleEliminar(fila)}
                disabled={bloqueado}
              ><IconoEliminar_jja /></button>
            </>
          )
        }}
      />

      {/* Modal Crear/Editar */}
      <ActionModal_jja
        visible={modalVisible_jja}
        titulo={editando_jja ? 'Editar Activo' : 'Nuevo Activo'}
        onCerrar={() => setModalVisible_jja(false)}
        onConfirmar={handleGuardar}
        textoConfirmar={editando_jja ? 'Actualizar' : 'Crear Activo'}
        cargando={guardando_jja}
        ancho="620px"
      >
        <div className="form-grid-jja">
          <FormGroup_jja label="Nombre del activo" nombre="nombre" valor={form_jja.nombre} onChange={handleCambioForm} placeholder="Ej: Laptop Dell #3" requerido />
          <FormGroup_jja
            label="Tipo de activo" nombre="id_tipo" tipo="select" valor={form_jja.id_tipo}
            onChange={handleCambioForm} requerido
            opciones={tipos_jja.map(t => ({ valor: t.id_tipo_jja, etiqueta: t.nombre_tipo_jja }))}
          />
        </div>
        <FormGroup_jja label="Ubicacion" nombre="ubicacion" valor={form_jja.ubicacion} onChange={handleCambioForm} placeholder="Ej: Sala de Sistemas, Piso 2" />
        <FormGroup_jja label="Descripcion" nombre="descripcion" tipo="textarea" valor={form_jja.descripcion} onChange={handleCambioForm} placeholder="Descripcion del activo..." />

        {/* Seccion Imagen Drag & Drop _jja */}
        <div className="form-grupo-jja" style={{ marginBottom: 16 }}>
          <label className="form-label-jja">Imagen del activo</label>
          <div
            style={{
              border: `2px dashed ${arrastrando_jja ? 'var(--color-primario-jja)' : 'var(--border-color-jja)'}`,
              borderRadius: 'var(--border-radius-sm-jja)',
              padding: 24,
              textAlign: 'center',
              background: arrastrando_jja ? 'var(--color-primario-light-jja)' : 'var(--bg-principal-jja)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
            onDragEnter={manejarArrastre_jja}
            onDragOver={manejarArrastre_jja}
            onDragLeave={manejarArrastre_jja}
            onDrop={manejarSoltar_jja}
            onClick={() => document.getElementById('input-imagen-jja').click()}
          >
            <input
              id="input-imagen-jja"
              type="file"
              accept="image/jpeg, image/png, image/webp"
              style={{ display: 'none' }}
              onChange={manejarSeleccionImagen_jja}
            />
            {imagenPrevia_jja ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={imagenPrevia_jja}
                  alt="Previsualizacion de activo"
                  style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 6, display: 'block' }}
                />
                <button
                  type="button"
                  style={{ position: 'absolute', top: -10, right: -10, background: 'var(--color-error-jja)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={(e) => { e.stopPropagation(); setImagenFichero_jja(null); setImagenPrevia_jja(null); document.getElementById('input-imagen-jja').value = ''; }}
                >
                  &times;
                </button>
              </div>
            ) : (
              <div>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--texto-terciario-jja)', marginBottom: 8, margin: '0 auto' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <div style={{ fontSize: '0.85rem', color: 'var(--texto-secundario-jja)' }}>Haz clic para seleccionar o arrastra una imagen aqui</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--texto-terciario-jja)', marginTop: 4 }}>(Formatos permitidos: JPG, PNG, WEBP)</div>
              </div>
            )}
          </div>
        </div>

        {/* Seccion QR */}
        <div style={{ background: 'var(--bg-principal-jja)', borderRadius: 'var(--border-radius-sm-jja)', padding: 16, margin: '12px 0' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--texto-primario-jja)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconoQR_jja style={{ fontSize: '1rem' }} /> Identificacion QR
          </div>

          {editando_jja ? (
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--texto-secundario-jja)', marginBottom: 4 }}>Codigo QR (generado automaticamente)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={generarUrlQR(editando_jja.codigo_qr_jja, 64)}
                  alt="QR"
                  style={{ width: 64, height: 64, borderRadius: 6, border: '1px solid var(--border-color-jja)', background: 'white', padding: 3 }}
                />
                <div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primario-jja)' }}>
                    {editando_jja.codigo_qr_jja}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--texto-terciario-jja)' }}>Este codigo no se puede modificar</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.78rem', color: 'var(--texto-secundario-jja)', background: 'var(--color-info-bg-jja)', padding: '8px 12px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconoQR_jja style={{ fontSize: '0.95rem', color: 'var(--color-info-jja)' }} />
              <span>El codigo QR se generara automaticamente al crear el activo (formato: ACTV-XXXXXXXX)</span>
            </div>
          )}
        </div>

        <div className="form-grupo-jja">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form_jja.publicado} onChange={(e) => handleCambioForm('publicado', e.target.checked)} />
            <span className="form-label-jja" style={{ margin: 0 }}>Publicar en Marketplace</span>
          </label>
        </div>
      </ActionModal_jja>

      {/* Modal Detalle QR */}
      <ActionModal_jja
        visible={detalleVisible_jja}
        titulo="Codigo QR del Activo"
        onCerrar={() => setDetalleVisible_jja(false)}
        sinFooter
        ancho="440px"
      >
        {activoDetalle_jja && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{activoDetalle_jja.nombre_jja}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--texto-secundario-jja)' }}>
                {activoDetalle_jja.nombre_tipo_jja} · {activoDetalle_jja.ubicacion_jja || 'Sin ubicacion'}
              </div>
              <div style={{ marginTop: 6 }}>
                <StatusBadge_jja estado={activoDetalle_jja.estado_jja} />
              </div>
            </div>

            <div style={{ background: 'white', display: 'inline-block', padding: 16, borderRadius: 12, border: '2px solid var(--border-color-jja)', boxShadow: 'var(--sombra-md-jja)', marginBottom: 16 }}>
              <img
                src={generarUrlQR(activoDetalle_jja.codigo_qr_jja, 200)}
                alt={`QR: ${activoDetalle_jja.codigo_qr_jja}`}
                style={{ width: 200, height: 200, display: 'block' }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--texto-terciario-jja)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Codigo QR</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primario-jja)', background: 'var(--color-primario-light-jja)', padding: '6px 16px', borderRadius: 6, display: 'inline-block' }}>
                {activoDetalle_jja.codigo_qr_jja}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
              <BotonAccion_jja
                variante="primario"
                icono={<IconoExportar_jja />}
                onClick={() => descargarQR(activoDetalle_jja.codigo_qr_jja, activoDetalle_jja.nombre_jja)}
              >
                Descargar QR
              </BotonAccion_jja>
              <BotonAccion_jja
                variante="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(activoDetalle_jja.codigo_qr_jja)
                  toast_jja.exito('Codigo QR copiado al portapapeles')
                }}
              >
                Copiar Codigo
              </BotonAccion_jja>
            </div>
          </div>
        )}
      </ActionModal_jja>

      {/* Modal Confirmar Eliminacion */}
      <ConfirmModal_jja
        visible={confirmarElim_jja.visible}
        titulo="Eliminar activo?"
        mensaje={`Se eliminara "${confirmarElim_jja.fila?.nombre_jja || ''}" permanentemente.`}
        textoConfirmar="Eliminar"
        onConfirmar={ejecutarEliminar_jja}
        onCancelar={() => setConfirmarElim_jja({ visible: false, fila: null })}
      />

      {/* Modal Inhabilitar/Habilitar */}
      <ActionModal_jja
        visible={modalInhabilitar_jja.visible}
        titulo={
          ['dañado', 'perdido', 'mantenimiento'].includes(modalInhabilitar_jja.fila?.estado_jja)
            ? 'Habilitar activo'
            : 'Inhabilitar activo'
        }
        onCerrar={() => setModalInhabilitar_jja({ visible: false, fila: null })}
        onConfirmar={ejecutarInhabilitar_jja}
        textoConfirmar={motivoInhabilitar_jja === 'disponible' ? 'Habilitar' : 'Inhabilitar'}
        cargando={procesandoInhabilitar_jja}
        variante={motivoInhabilitar_jja === 'disponible' ? 'primario' : 'peligro'}
        ancho="460px"
      >
        {modalInhabilitar_jja.fila && (
          <div>
            <p style={{ marginTop: 0, color: 'var(--texto-secundario-jja)', fontSize: '0.9rem' }}>
              Activo: <strong>{modalInhabilitar_jja.fila.nombre_jja}</strong>
            </p>
            <FormGroup_jja
              label="Selecciona el nuevo estado"
              nombre="motivo"
              tipo="select"
              valor={motivoInhabilitar_jja}
              onChange={(_, v) => setMotivoInhabilitar_jja(v)}
              opciones={[
                { valor: 'disponible', etiqueta: 'Disponible (habilitar)' },
                { valor: 'dañado', etiqueta: 'Dañado' },
                { valor: 'perdido', etiqueta: 'Perdido' },
                { valor: 'mantenimiento', etiqueta: 'En mantenimiento' },
              ]}
            />
            <p style={{ fontSize: '0.82rem', color: 'var(--texto-terciario-jja)', marginBottom: 0 }}>
              {motivoInhabilitar_jja === 'disponible'
                ? 'El activo volverá a estar disponible y visible en el catálogo.'
                : 'El activo no se mostrará en el catálogo del marketplace hasta que se vuelva a habilitar.'}
            </p>
          </div>
        )}
      </ActionModal_jja>

      {/* Modal Alerta de Tipo de Archivo _jja */}
      <ActionModal_jja
        visible={modalAlerta_jja.visible}
        titulo={modalAlerta_jja.titulo || 'Alerta'}
        onCerrar={() => setModalAlerta_jja({ visible: false, titulo: '', mensaje: '' })}
        onConfirmar={() => setModalAlerta_jja({ visible: false, titulo: '', mensaje: '' })}
        textoConfirmar="Aceptar"
        sinCancelar
        ancho="400px"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#fee2e2', color: '#ef4444', minWidth: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
          <div style={{ fontSize: '0.95rem', color: 'var(--texto-primario-jja)' }}>
            {modalAlerta_jja.mensaje}
          </div>
        </div>
      </ActionModal_jja>
    </div>
  )
}

export default InventarioPage_jja
