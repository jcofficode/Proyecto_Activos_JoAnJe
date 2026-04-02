// ============================================================
// InventarioPage_jja.jsx — Gestión de Inventario de Activos
// Con códigos QR/NFC visibles y generación de QR
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect } from 'react'
import { apiRequest } from '../../utils/api'
import { API_BASE_JC } from '../../api.config'
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

const ESTADO_COLORES = {
  disponible: '#10b981', prestado: '#3b82f6', mantenimiento: '#8b5cf6',
  dañado: '#ef4444', perdido: '#6b7280', en_proceso_prestamo: '#f59e0b'
}

// ── Generador simple de QR con API pública ───────────────────
const generarUrlQR = (texto, tamaño = 180) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${tamaño}x${tamaño}&data=${encodeURIComponent(texto)}&margin=8&format=svg`

const InventarioPage_jja = () => {
  const [activos_jja, setActivos_jja] = useState([])
  const [tipos_jja, setTipos_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)
  const toast_jja = useToast_jja()
  const [confirmarElim_jja, setConfirmarElim_jja] = useState({ visible: false, fila: null })

  // Modal Crear/Editar
  const [modalVisible_jja, setModalVisible_jja] = useState(false)
  const [editando_jja, setEditando_jja] = useState(null)
  const [form_jja, setForm_jja] = useState({
    nombre: '', id_tipo: '', ubicacion: '', descripcion: '',
    publicado: false, codigo_nfc: '',
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

  // ── Columnas de la tabla ───────────────────────────────────
  const columnas = [
    {
      clave: 'nombre_jja', titulo: 'Activo', render: (val, fila) => {
        let imgUrl = null;
        if (fila.imagenes_jja && Array.isArray(fila.imagenes_jja) && fila.imagenes_jja.length > 0) {
          imgUrl = `${API_BASE_JC}${fila.imagenes_jja[0]}`;
        } else if (typeof fila.imagenes_jja === 'string') {
          // Por si el backend no lo devolvió como array sino como string decodificable
          try {
            const arr = JSON.parse(fila.imagenes_jja);
            if (Array.isArray(arr) && arr.length > 0) imgUrl = `${API_BASE_JC}${arr[0]}`;
            else imgUrl = `${API_BASE_JC}${fila.imagenes_jja}`;
          } catch (e) { imgUrl = `${API_BASE_JC}${fila.imagenes_jja}`; }
        }

        return (
          <div className="datatable-avatar-celda-jja">
            {imgUrl ? (
              <img src={imgUrl} alt={val} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
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
      clave: 'codigo_qr_jja', titulo: 'QR / NFC', ancho: 200, render: (val, fila) => (
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
            {fila.codigo_nfc_jja && (
              <div style={{ fontSize: '0.68rem', color: 'var(--texto-terciario-jja)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" /><path d="M12.91 4.1a15.91 15.91 0 0 1 .01 15.8" /><path d="M16.37 2a20.16 20.16 0 0 1 0 20" /></svg>
                NFC: {fila.codigo_nfc_jja}
              </div>
            )}
          </div>
        </div>
      )
    },
    { clave: 'ubicacion_jja', titulo: 'Ubicación', render: (val) => val || '—' },
    {
      clave: 'estado_jja', titulo: 'Estado', render: (val) => <StatusBadge_jja estado={val} />
    },
    {
      clave: 'publicado_jja', titulo: 'Publicado', render: (val) => (
        <span style={{ color: val ? 'var(--color-exito-jja)' : 'var(--texto-terciario-jja)', fontWeight: 600, fontSize: '0.82rem' }}>
          {val ? 'Sí' : 'No'}
        </span>
      )
    },
  ]

  // ── Handlers de CRUD ──────────────────────────────────────
  const abrirCrear = () => {
    setEditando_jja(null)
    setForm_jja({ nombre: '', id_tipo: '', ubicacion: '', descripcion: '', publicado: false, codigo_nfc: '' })
    setImagenFichero_jja(null)
    setImagenPrevia_jja(null)
    setModalVisible_jja(true)
  }

  const abrirEditar = (fila) => {
    setEditando_jja(fila)
    setForm_jja({
      nombre: fila.nombre_jja || '',
      id_tipo: fila.id_tipo_jja || '',
      ubicacion: fila.ubicacion_jja || '',
      descripcion: fila.descripcion_jja || '',
      publicado: !!fila.publicado_jja,
      codigo_nfc: fila.codigo_nfc_jja || '',
    })
    setImagenFichero_jja(null)
    setImagenPrevia_jja(fila.imagenes_jja ? `${API_BASE_JC}${fila.imagenes_jja}` : null)
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
        codigo_nfc: form_jja.codigo_nfc || null,
      }
      let idActivo = editando_jja?.id_activo_jja;
      if (editando_jja) {
        await apiRequest(`/activos/${idActivo}`, { method: 'PUT', body: JSON.stringify(body) })
      } else {
        const res = await apiRequest('/activos', { method: 'POST', body: JSON.stringify(body) })
        idActivo = res?.datos?.id_activo_jja || editando_jja?.id_activo_jja;
      }

      // Subir imagen si se seleccionó una _jja
      if (imagenFichero_jja && idActivo) {
        const formData = new FormData();
        formData.append('imagen', imagenFichero_jja);
        await apiRequest(`/activos/${idActivo}/imagen`, { method: 'POST', body: formData });
      }

      setModalVisible_jja(false)
      toast_jja.exito(editando_jja ? 'Activo actualizado correctamente.' : 'Activo creado correctamente.')
      cargarDatos()
    } catch (err) { toast_jja.error('Error: ' + err.message) }
    finally { setGuardando_jja(false) }
  }

  const handleEliminar = async (fila) => {
    if (fila.estado_jja === 'prestado' || fila.estado_jja === 'en_proceso_prestamo') {
      setModalAlerta_jja({
        visible: true,
        titulo: 'Acción no permitida',
        mensaje: 'No se puede eliminar un activo que está en proceso de préstamo o está prestado.'
      })
      return
    }
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

  // ── Handlers de Imagen (Drag & Drop) _jja ───────────────────
  const validarImagen_jja = (file) => {
    if (!file) return false;
    const extension = file.name.split('.').pop().toLowerCase();
    const permitidas = ['jpg', 'jpeg', 'png', 'webp'];
    if (!permitidas.includes(extension)) {
      setModalAlerta_jja({ visible: true, titulo: 'Archivo no permitido', mensaje: 'Solo se aceptan imágenes con extensión JPG, PNG o WEBP.' });
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
          <p className="pagina-subtitulo-jja">Gestión completa del inventario institucional con códigos QR y NFC</p>
        </div>
        <div className="pagina-acciones-jja">
          <BotonAccion_jja variante="primario" icono={<IconoPlus_jja />} onClick={abrirCrear}>
            Nuevo Activo
          </BotonAccion_jja>
        </div>
      </div>

      <DataTable_jja
        columnas={columnas}
        datos={activos_jja}
        cargando={cargando_jja}
        placeholderBusqueda="Buscar activo por nombre, código QR, NFC o tipo..."
        acciones={(fila) => (
          <>
            <button className="datatable-accion-btn-jja ver-jja" title="Ver QR / NFC" onClick={() => abrirDetalle(fila)}><IconoQR_jja /></button>
            <button className="datatable-accion-btn-jja editar-jja" title="Editar" onClick={() => abrirEditar(fila)}><IconoEditar_jja /></button>
            <button className="datatable-accion-btn-jja eliminar-jja" title="Eliminar" onClick={() => handleEliminar(fila)}><IconoEliminar_jja /></button>
          </>
        )}
      />

      {/* ══ Modal Crear/Editar ════════════════════════════════ */}
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
        <FormGroup_jja label="Ubicación" nombre="ubicacion" valor={form_jja.ubicacion} onChange={handleCambioForm} placeholder="Ej: Sala de Sistemas, Piso 2" />
        <FormGroup_jja label="Descripción" nombre="descripcion" tipo="textarea" valor={form_jja.descripcion} onChange={handleCambioForm} placeholder="Descripción del activo..." />

        {/* Sección Imagen Drag & Drop _jja */}
        <div
          className="form-grupo-jja"
          style={{ marginBottom: 16 }}
        >
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
                  alt="Previsualización de activo"
                  style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 6, display: 'block' }}
                />
                <button
                  type="button"
                  style={{ position: 'absolute', top: -10, right: -10, background: 'var(--color-peligro-jja)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
                <div style={{ fontSize: '0.85rem', color: 'var(--texto-secundario-jja)' }}>Haz clic para seleccionar o arrastra una imagen aquí</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--texto-terciario-jja)', marginTop: 4 }}>(Formatos permitidos: JPG, PNG, WEBP)</div>
              </div>
            )}
          </div>
        </div>

        {/* Sección QR / NFC */}
        <div style={{ background: 'var(--bg-principal-jja)', borderRadius: 'var(--border-radius-sm-jja)', padding: 16, margin: '12px 0' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--texto-primario-jja)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconoQR_jja style={{ fontSize: '1rem' }} /> Identificación QR / NFC
          </div>

          {editando_jja ? (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--texto-secundario-jja)', marginBottom: 4 }}>Código QR (generado automáticamente)</div>
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
                  <div style={{ fontSize: '0.72rem', color: 'var(--texto-terciario-jja)' }}>Este código no se puede modificar</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.78rem', color: 'var(--texto-secundario-jja)', background: 'var(--color-info-bg-jja)', padding: '8px 12px', borderRadius: 6, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconoQR_jja style={{ fontSize: '0.95rem', color: 'var(--color-info-jja)' }} />
              <span>El código QR se generará automáticamente al crear el activo (formato: ACTV-XXXXXXXX)</span>
            </div>
          )}

          <FormGroup_jja
            label="Código NFC (opcional)"
            nombre="codigo_nfc"
            valor={form_jja.codigo_nfc}
            onChange={handleCambioForm}
            placeholder="Ej: NFC-A1B2C3D4 o ID de etiqueta NFC"
            helper="Introduce el ID de la etiqueta NFC si el activo tiene una"
          />
        </div>

        <div className="form-grupo-jja">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form_jja.publicado} onChange={(e) => handleCambioForm('publicado', e.target.checked)} />
            <span className="form-label-jja" style={{ margin: 0 }}>Publicar en Marketplace</span>
          </label>
        </div>
      </ActionModal_jja>

      {/* ══ Modal Detalle QR/NFC ══════════════════════════════ */}
      <ActionModal_jja
        visible={detalleVisible_jja}
        titulo="Código QR / NFC del Activo"
        onCerrar={() => setDetalleVisible_jja(false)}
        sinFooter
        ancho="440px"
      >
        {activoDetalle_jja && (
          <div style={{ textAlign: 'center' }}>
            {/* Nombre del activo */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{activoDetalle_jja.nombre_jja}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--texto-secundario-jja)' }}>
                {activoDetalle_jja.nombre_tipo_jja} · {activoDetalle_jja.ubicacion_jja || 'Sin ubicación'}
              </div>
              <div style={{ marginTop: 6 }}>
                <StatusBadge_jja estado={activoDetalle_jja.estado_jja} />
              </div>
            </div>

            {/* QR Code visual */}
            <div style={{ background: 'white', display: 'inline-block', padding: 16, borderRadius: 12, border: '2px solid var(--border-color-jja)', boxShadow: 'var(--sombra-md-jja)', marginBottom: 16 }}>
              <img
                src={generarUrlQR(activoDetalle_jja.codigo_qr_jja, 200)}
                alt={`QR: ${activoDetalle_jja.codigo_qr_jja}`}
                style={{ width: 200, height: 200, display: 'block' }}
              />
            </div>

            {/* Código QR texto */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--texto-terciario-jja)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Código QR</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primario-jja)', background: 'var(--color-primario-light-jja)', padding: '6px 16px', borderRadius: 6, display: 'inline-block' }}>
                {activoDetalle_jja.codigo_qr_jja}
              </div>
            </div>

            {/* Código NFC */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--texto-terciario-jja)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Código NFC</div>
              {activoDetalle_jja.codigo_nfc_jja ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 700, color: '#0ea5e9', background: '#e0f2fe', padding: '6px 16px', borderRadius: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" /><path d="M12.91 4.1a15.91 15.91 0 0 1 .01 15.8" /><path d="M16.37 2a20.16 20.16 0 0 1 0 20" /></svg>
                  {activoDetalle_jja.codigo_nfc_jja}
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--texto-terciario-jja)' }}>Sin etiqueta NFC asignada</div>
              )}
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
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
                  toast_jja.exito('Código QR copiado al portapapeles')
                }}
              >
                Copiar Código
              </BotonAccion_jja>
            </div>
          </div>
        )}
      </ActionModal_jja>

      {/* Modal Confirmar Eliminación */}
      <ConfirmModal_jja
        visible={confirmarElim_jja.visible}
        titulo="¿Eliminar activo?"
        mensaje={`Se eliminará "${confirmarElim_jja.fila?.nombre_jja || ''}" permanentemente.`}
        textoConfirmar="Eliminar"
        onConfirmar={ejecutarEliminar_jja}
        onCancelar={() => setConfirmarElim_jja({ visible: false, fila: null })}
      />

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
