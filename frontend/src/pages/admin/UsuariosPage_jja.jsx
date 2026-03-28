// ============================================================
// UsuariosPage_jja.jsx — Gestión de Usuarios
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect } from 'react'
import { apiRequest } from '../../utils/api'
import DataTable_jja from '../../components/ui_jja/DataTable_jja'
import StatusBadge_jja from '../../components/ui_jja/StatusBadge_jja'
import BotonAccion_jja from '../../components/ui_jja/BotonAccion_jja'
import ActionModal_jja from '../../components/ui_jja/ActionModal_jja'
import FormGroup_jja from '../../components/ui_jja/FormGroup_jja'
import { useModal_jja } from '../../context/ModalContext_jja'
import { IconoPlus_jja, IconoEditar_jja, IconoEliminar_jja } from '../../components/ui_jja/Iconos_jja'

const COLORES_ROL = { administrador: '#4f46e5', encargado: '#10b981', cliente: '#f59e0b' }

const UsuariosPage_jja = () => {
  const { mostrarModal } = useModal_jja()
  const [usuarios_jja, setUsuarios_jja] = useState([])
  const [roles_jja, setRoles_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)
  const [modalVisible_jja, setModalVisible_jja] = useState(false)
  const [editando_jja, setEditando_jja] = useState(null)
  const [form_jja, setForm_jja] = useState({ nombre: '', apellido: '', cedula: '', correo: '', telefono: '', contrasena: '', id_rol: '' })
  const [guardando_jja, setGuardando_jja] = useState(false)

  useEffect(() => { cargarDatos() }, [])

  async function cargarDatos() {
    try {
      const [usersResp, rolesResp] = await Promise.all([
        apiRequest('/usuarios'),
        apiRequest('/roles'),
      ])
      setUsuarios_jja(Array.isArray(usersResp) ? usersResp : usersResp?.datos || [])
      setRoles_jja(Array.isArray(rolesResp) ? rolesResp : rolesResp?.datos || [])
    } catch (err) { console.error(err) }
    finally { setCargando_jja(false) }
  }

  const columnas = [
    {
      clave: 'nombre_jja', titulo: 'Usuario', render: (val, fila) => {
        const iniciales = `${(val || '')[0] || ''}${(fila.apellido_jja || '')[0] || ''}`.toUpperCase()
        return (
          <div className="datatable-avatar-celda-jja">
            <div className="datatable-avatar-jja" style={{ background: COLORES_ROL[fila.nombre_rol_jja] || '#94a3b8' }}>{iniciales}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{val} {fila.apellido_jja}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--texto-terciario-jja)' }}>{fila.cedula_jja}</div>
            </div>
          </div>
        )
      }
    },
    { clave: 'correo_jja', titulo: 'Correo' },
    { clave: 'telefono_jja', titulo: 'Teléfono' },
    { clave: 'nombre_rol_jja', titulo: 'Rol', render: (val) => <StatusBadge_jja estado={val} /> },
  ]

  const abrirCrear = () => {
    setEditando_jja(null)
    setForm_jja({ nombre: '', apellido: '', cedula: '', correo: '', telefono: '', contrasena: '', id_rol: '' })
    setModalVisible_jja(true)
  }

  const abrirEditar = (fila) => {
    setEditando_jja(fila)
    setForm_jja({
      nombre: fila.nombre_jja || '', apellido: fila.apellido_jja || '',
      cedula: fila.cedula_jja || '', correo: fila.correo_jja || '',
      telefono: fila.telefono_jja || '', contrasena: '', id_rol: fila.id_rol_jja || '',
    })
    setModalVisible_jja(true)
  }

  const handleGuardar = async () => {
    setGuardando_jja(true)
    try {
      if (editando_jja) {
        await apiRequest(`/usuarios/${editando_jja.id_usuario_jja}`, {
          method: 'PUT',
          body: JSON.stringify({ nombre: form_jja.nombre, apellido: form_jja.apellido, correo: form_jja.correo, telefono: form_jja.telefono, id_rol: Number(form_jja.id_rol) })
        })
      } else {
        await apiRequest('/usuarios', {
          method: 'POST',
          body: JSON.stringify({ ...form_jja, id_rol: Number(form_jja.id_rol) })
        })
      }
      setModalVisible_jja(false)
      cargarDatos()
    } catch (err) { mostrarModal({ mensaje: 'Error: ' + err.message, tipo: 'error' }) }
    finally { setGuardando_jja(false) }
  }

  const handleEliminar = (fila) => {
    mostrarModal({
      titulo: 'Eliminar Usuario',
      mensaje: `¿Eliminar al usuario "${fila.nombre_jja} ${fila.apellido_jja}"?`,
      tipo: 'warning',
      onConfirm: async () => {
        try {
          await apiRequest(`/usuarios/${fila.id_usuario_jja}`, { method: 'DELETE' })
          cargarDatos()
          mostrarModal({ mensaje: 'Usuario eliminado exitosamente', tipo: 'success' })
        } catch (err) { mostrarModal({ mensaje: 'Error: ' + err.message, tipo: 'error' }) }
      }
    })
  }

  const handleCambioForm = (campo, valor) => setForm_jja(prev => ({ ...prev, [campo]: valor }))

  return (
    <div>
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja">Usuarios</h1>
          <p className="pagina-subtitulo-jja">Gestión completa de usuarios del sistema</p>
        </div>
        <div className="pagina-acciones-jja">
          <BotonAccion_jja variante="primario" icono={<IconoPlus_jja />} onClick={abrirCrear}>
            Nuevo Usuario
          </BotonAccion_jja>
        </div>
      </div>

      <DataTable_jja
        columnas={columnas}
        datos={usuarios_jja}
        cargando={cargando_jja}
        placeholderBusqueda="Buscar por nombre, cédula o correo..."
        acciones={(fila) => (
          <>
            <button className="datatable-accion-btn-jja editar-jja" title="Editar" onClick={() => abrirEditar(fila)}><IconoEditar_jja /></button>
            <button className="datatable-accion-btn-jja eliminar-jja" title="Eliminar" onClick={() => handleEliminar(fila)}><IconoEliminar_jja /></button>
          </>
        )}
      />

      <ActionModal_jja
        visible={modalVisible_jja}
        titulo={editando_jja ? 'Editar Usuario' : 'Nuevo Usuario'}
        onCerrar={() => setModalVisible_jja(false)}
        onConfirmar={handleGuardar}
        textoConfirmar={editando_jja ? 'Actualizar' : 'Crear Usuario'}
        cargando={guardando_jja}
      >
        <div className="form-grid-jja">
          <FormGroup_jja label="Nombre" nombre="nombre" valor={form_jja.nombre} onChange={handleCambioForm} requerido />
          <FormGroup_jja label="Apellido" nombre="apellido" valor={form_jja.apellido} onChange={handleCambioForm} requerido />
        </div>
        <div className="form-grid-jja">
          <FormGroup_jja label="Cédula" nombre="cedula" valor={form_jja.cedula} onChange={handleCambioForm} requerido disabled={!!editando_jja} />
          <FormGroup_jja label="Correo" nombre="correo" tipo="email" valor={form_jja.correo} onChange={handleCambioForm} requerido />
        </div>
        <div className="form-grid-jja">
          <FormGroup_jja label="Teléfono" nombre="telefono" valor={form_jja.telefono} onChange={handleCambioForm} />
          <FormGroup_jja
            label="Rol" nombre="id_rol" tipo="select" valor={form_jja.id_rol}
            onChange={handleCambioForm} requerido
            opciones={roles_jja.map(r => ({ valor: r.id_rol_jja, etiqueta: r.nombre_rol_jja }))}
          />
        </div>
        {!editando_jja && (
          <FormGroup_jja label="Contraseña temporal" nombre="contrasena" tipo="password" valor={form_jja.contrasena} onChange={handleCambioForm} requerido helper="El usuario deberá cambiarla al iniciar sesión" />
        )}
      </ActionModal_jja>
    </div>
  )
}

export default UsuariosPage_jja
