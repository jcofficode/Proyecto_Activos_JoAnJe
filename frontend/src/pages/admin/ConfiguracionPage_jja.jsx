// ============================================================
// ConfiguracionPage_jja.jsx — Configuración del Sistema
// CRUD Tipos de Activos + Políticas de Préstamo
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect } from 'react'
import { apiRequest } from '../../utils/api'
import { useToast_jja } from '../../context/ToastContext_jja'
import { useModal_jja } from '../../context/ModalContext_jja'
import DataTable_jja from '../../components/ui_jja/DataTable_jja'
import BotonAccion_jja from '../../components/ui_jja/BotonAccion_jja'
import ActionModal_jja from '../../components/ui_jja/ActionModal_jja'
import FormGroup_jja from '../../components/ui_jja/FormGroup_jja'
import ConfirmModal_jja from '../../components/ui_jja/ConfirmModal_jja'
import { IconoPlus_jja, IconoEditar_jja, IconoEliminar_jja } from '../../components/ui_jja/Iconos_jja'

const ConfiguracionPage_jja = () => {
  const [tabActivo_jja, setTabActivo_jja] = useState('tipos')
  const [tipos_jja, setTipos_jja] = useState([])
  const [politicas_jja, setPoliticas_jja] = useState([])
  const [roles_jja, setRoles_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)
  const [modalVisible_jja, setModalVisible_jja] = useState(false)
  const [editando_jja, setEditando_jja] = useState(null)
  const [form_jja, setForm_jja] = useState({})
  const [guardando_jja, setGuardando_jja] = useState(false)
  const [confirmar_jja, setConfirmar_jja] = useState({ visible: false, titulo: '', mensaje: '', onConfirmar: null })
  const toast_jja = useToast_jja()
  const { mostrarModal } = useModal_jja()

  useEffect(() => { cargarDatos_jja() }, [])

  async function cargarDatos_jja() {
    setCargando_jja(true)
    try {
      const [tResp, pResp, rResp] = await Promise.allSettled([
        apiRequest('/tipos-activos'),
        apiRequest('/politicas'),
        apiRequest('/roles'),
      ])
      setTipos_jja(extraer_jja(tResp))
      setPoliticas_jja(extraer_jja(pResp))
      setRoles_jja(extraer_jja(rResp))
    } catch (e) {
      console.error(e)
      mostrarModal({ mensaje: 'Error al cargar la configuración.', tipo: 'error' })
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

  const handleCambio_jja = (campo, valor) => setForm_jja(prev => ({ ...prev, [campo]: valor }))

  // ── Tipos de Activos ──────────────────────────────────────
  const colsTipos_jja = [
    { clave: 'nombre_tipo_jja', titulo: 'Nombre del Tipo' },
    { clave: 'descripcion_jja', titulo: 'Descripción', render: (v) => v || '—' },
  ]

  // ── Políticas de Préstamo ──────────────────────────────────
  const colsPoliticas_jja = [
    {
      clave: 'id_tipo_jja', titulo: 'Tipo de Activo', render: (v) => {
        const tipo = tipos_jja.find(t => t.id_tipo_jja === v)
        return tipo ? tipo.nombre_tipo_jja : `Tipo #${v}`
      }
    },
    { clave: 'dias_maximo_jja', titulo: 'Días Máximo' },
    { clave: 'max_prestamos_simultaneos_jja', titulo: 'Préstamos Simultáneos' },
    { clave: 'requiere_mismo_dia_jja', titulo: 'Mismo Día', render: (v) => v ? '✓ Sí' : '✕ No' },
  ]

  // ── Roles ──────────────────────────────────────────────────
  const colsRoles_jja = [
    { clave: 'nombre_rol_jja', titulo: 'Nombre del Rol', render: (v) => <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{v}</span> },
    { clave: 'descripcion_jja', titulo: 'Descripción', render: (v) => v || '—' },
  ]

  const abrirCrear_jja = () => {
    setEditando_jja(null)
    if (tabActivo_jja === 'tipos') {
      setForm_jja({ nombre_tipo: '', descripcion: '' })
    } else if (tabActivo_jja === 'politicas') {
      setForm_jja({ id_tipo: '', dias_maximo: '', max_prestamos_simultaneos: '', requiere_mismo_dia: false })
    }
    setModalVisible_jja(true)
  }

  const abrirEditar_jja = (fila) => {
    setEditando_jja(fila)
    if (tabActivo_jja === 'tipos') {
      setForm_jja({ nombre_tipo: fila.nombre_tipo_jja || '', descripcion: fila.descripcion_jja || '' })
    } else if (tabActivo_jja === 'politicas') {
      setForm_jja({
        id_tipo: fila.id_tipo_jja || '',
        dias_maximo: fila.dias_maximo_jja || '',
        max_prestamos_simultaneos: fila.max_prestamos_simultaneos_jja || '',
        requiere_mismo_dia: !!fila.requiere_mismo_dia_jja,
      })
    }
    setModalVisible_jja(true)
  }

  const handleGuardar_jja = async () => {
    setGuardando_jja(true)
    try {
      if (tabActivo_jja === 'tipos') {
        const body = { nombre_tipo: form_jja.nombre_tipo, descripcion: form_jja.descripcion }
        if (editando_jja) {
          await apiRequest(`/tipos-activos/${editando_jja.id_tipo_jja}`, { method: 'PUT', body: JSON.stringify(body) })
          mostrarModal({ mensaje: 'Tipo de activo actualizado correctamente.', tipo: 'success' })
        } else {
          await apiRequest('/tipos-activos', { method: 'POST', body: JSON.stringify(body) })
          mostrarModal({ mensaje: 'Tipo de activo creado correctamente.', tipo: 'success' })
        }
      } else if (tabActivo_jja === 'politicas') {
        const body = {
          id_tipo: Number(form_jja.id_tipo),
          dias_maximo: Number(form_jja.dias_maximo),
          max_prestamos_simultaneos: Number(form_jja.max_prestamos_simultaneos),
          requiere_mismo_dia: form_jja.requiere_mismo_dia,
        }
        if (editando_jja) {
          await apiRequest(`/politicas/${editando_jja.id_politica_jja}`, { method: 'PUT', body: JSON.stringify(body) })
          mostrarModal({ mensaje: 'Política actualizada correctamente.', tipo: 'success' })
        } else {
          await apiRequest('/politicas', { method: 'POST', body: JSON.stringify(body) })
          mostrarModal({ mensaje: 'Política de préstamo creada correctamente.', tipo: 'success' })
        }
      }
      setModalVisible_jja(false)
      cargarDatos_jja()
    } catch (err) {
      mostrarModal({ mensaje: 'Error: ' + err.message, tipo: 'error' })
    }
    finally { setGuardando_jja(false) }
  }

  const confirmarEliminar_jja = (fila) => {
    const estipoTab = tabActivo_jja === 'tipos'
    const nombre = estipoTab ? fila.nombre_tipo_jja : `Política #${fila.id_politica_jja}`
    setConfirmar_jja({
      visible: true,
      titulo: `¿Eliminar ${estipoTab ? 'tipo' : 'política'}?`,
      mensaje: `Se eliminará "${nombre}" permanentemente.`,
      onConfirmar: async () => {
        try {
          const endpoint = estipoTab
            ? `/tipos-activos/${fila.id_tipo_jja}`
            : `/politicas/${fila.id_politica_jja}`
          await apiRequest(endpoint, { method: 'DELETE' })
          cargarDatos_jja()
          mostrarModal({ mensaje: `${estipoTab ? 'Tipo' : 'Política'} eliminado correctamente.`, tipo: 'success' })
        } catch (err) {
          mostrarModal({ mensaje: 'Error: ' + err.message, tipo: 'error' })
        }
        setConfirmar_jja(prev => ({ ...prev, visible: false }))
      },
    })
  }

  const tabs_jja = [
    { clave: 'tipos', label: 'Tipos de Activos' },
    { clave: 'politicas', label: 'Políticas de Préstamo' },
    { clave: 'roles', label: 'Roles del Sistema' },
  ]

  return (
    <div>
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja">Configuración</h1>
          <p className="pagina-subtitulo-jja">Administra los parámetros del sistema</p>
        </div>
        <div className="pagina-acciones-jja">
          {tabActivo_jja !== 'roles' && (
            <BotonAccion_jja variante="primario" icono={<IconoPlus_jja />} onClick={abrirCrear_jja}>
              Nuevo {tabActivo_jja === 'tipos' ? 'Tipo' : 'Política'}
            </BotonAccion_jja>
          )}
        </div>
      </div>

      <div className="tabs-jja">
        {tabs_jja.map(t => (
          <button key={t.clave} className={`tab-btn-jja ${tabActivo_jja === t.clave ? 'activo-jja' : ''}`} onClick={() => setTabActivo_jja(t.clave)}>
            {t.label}
          </button>
        ))}
      </div>

      {tabActivo_jja === 'tipos' && (
        <DataTable_jja columnas={colsTipos_jja} datos={tipos_jja} cargando={cargando_jja} placeholderBusqueda="Buscar tipo..."
          acciones={(fila) => (
            <>
              <button className="datatable-accion-btn-jja editar-jja" title="Editar" onClick={() => abrirEditar_jja(fila)}><IconoEditar_jja /></button>
              <button className="datatable-accion-btn-jja eliminar-jja" title="Eliminar" onClick={() => confirmarEliminar_jja(fila)}><IconoEliminar_jja /></button>
            </>
          )}
        />
      )}
      {tabActivo_jja === 'politicas' && (
        <DataTable_jja columnas={colsPoliticas_jja} datos={politicas_jja} cargando={cargando_jja} placeholderBusqueda="Buscar política..."
          acciones={(fila) => (
            <>
              <button className="datatable-accion-btn-jja editar-jja" title="Editar" onClick={() => abrirEditar_jja(fila)}><IconoEditar_jja /></button>
              <button className="datatable-accion-btn-jja eliminar-jja" title="Eliminar" onClick={() => confirmarEliminar_jja(fila)}><IconoEliminar_jja /></button>
            </>
          )}
        />
      )}
      {tabActivo_jja === 'roles' && <DataTable_jja columnas={colsRoles_jja} datos={roles_jja} cargando={cargando_jja} busqueda={false} />}

      {/* Modal Crear/Editar */}
      <ActionModal_jja
        visible={modalVisible_jja}
        titulo={editando_jja ? 'Editar' : `Crear ${tabActivo_jja === 'tipos' ? 'Tipo de Activo' : 'Política de Préstamo'}`}
        onCerrar={() => setModalVisible_jja(false)}
        onConfirmar={handleGuardar_jja}
        textoConfirmar={editando_jja ? 'Actualizar' : 'Crear'}
        cargando={guardando_jja}
      >
        {tabActivo_jja === 'tipos' && (
          <>
            <FormGroup_jja label="Nombre del tipo" nombre="nombre_tipo" valor={form_jja.nombre_tipo} onChange={handleCambio_jja} placeholder="Ej: Laptop, Proyector" requerido />
            <FormGroup_jja label="Descripción" nombre="descripcion" tipo="textarea" valor={form_jja.descripcion} onChange={handleCambio_jja} placeholder="Descripción del tipo..." />
          </>
        )}
        {tabActivo_jja === 'politicas' && (
          <>
            <FormGroup_jja
              label="Tipo de activo" nombre="id_tipo" tipo="select" valor={form_jja.id_tipo}
              onChange={handleCambio_jja} requerido
              opciones={tipos_jja.map(t => ({ valor: t.id_tipo_jja, etiqueta: t.nombre_tipo_jja }))}
            />
            <div className="form-grid-jja">
              <FormGroup_jja label="Días máximo de préstamo" nombre="dias_maximo" tipo="number" valor={form_jja.dias_maximo} onChange={handleCambio_jja} placeholder="Ej: 7" requerido />
              <FormGroup_jja label="Préstamos simultáneos" nombre="max_prestamos_simultaneos" tipo="number" valor={form_jja.max_prestamos_simultaneos} onChange={handleCambio_jja} placeholder="Ej: 3" requerido />
            </div>
            <div className="form-grupo-jja" style={{ marginTop: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form_jja.requiere_mismo_dia || false} onChange={(e) => handleCambio_jja('requiere_mismo_dia', e.target.checked)} />
                <span className="form-label-jja" style={{ margin: 0 }}>Requiere devolución el mismo día</span>
              </label>
            </div>
          </>
        )}
      </ActionModal_jja>

      {/* Modal Confirmar Eliminación */}
      <ConfirmModal_jja
        visible={confirmar_jja.visible}
        titulo={confirmar_jja.titulo}
        mensaje={confirmar_jja.mensaje}
        textoConfirmar="Eliminar"
        onConfirmar={confirmar_jja.onConfirmar}
        onCancelar={() => setConfirmar_jja(prev => ({ ...prev, visible: false }))}
      />
    </div>
  )
}

export default ConfiguracionPage_jja
