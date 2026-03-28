// ============================================================
// PerfilPage_jja.jsx — Perfil del usuario (compartido)
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useRef } from 'react'
import { apiRequest, API_URL_JC } from '../../utils/api'
import useAuth_jja from '../../hooks/useAuth_jja'
import FormGroup_jja from '../../components/ui_jja/FormGroup_jja'
import BotonAccion_jja from '../../components/ui_jja/BotonAccion_jja'
import StatusBadge_jja from '../../components/ui_jja/StatusBadge_jja'
import { useModal_jja } from '../../context/ModalContext_jja'
import { IconoPerfil_jja, IconoCheck_jja } from '../../components/ui_jja/Iconos_jja'

const PerfilPage_jja = () => {
  const { mostrarModal } = useModal_jja()
  const { usuario, token, login } = useAuth_jja()
  const [dragOver_jja, setDragOver_jja] = useState(false)
  const [subiendoImagen_jja, setSubiendoImagen_jja] = useState(false)
  const inputRef_jja = useRef(null)
  const [editando_jja, setEditando_jja] = useState(false)
  const [guardando_jja, setGuardando_jja] = useState(false)
  const [exito_jja, setExito_jja] = useState('')
  const [form_jja, setForm_jja] = useState({
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    correo: usuario?.correo || '',
    telefono: usuario?.telefono || '',
  })
  const [clave_jja, setClave_jja] = useState({ actual: '', nueva: '', confirmar: '' })
  const [errorClave_jja, setErrorClave_jja] = useState('')

  const iniciales = `${(usuario?.nombre || '')[0] || ''}${(usuario?.apellido || '')[0] || ''}`.toUpperCase()

  const handleCambio = (campo, valor) => setForm_jja(prev => ({ ...prev, [campo]: valor }))
  const handleCambioClave = (campo, valor) => { setClave_jja(prev => ({ ...prev, [campo]: valor })); setErrorClave_jja('') }

  const handleGuardarPerfil = async () => {
    setGuardando_jja(true)
    try {
      await apiRequest(`/usuarios/${usuario.id}`, {
        method: 'PUT',
        body: JSON.stringify({ nombre: form_jja.nombre, apellido: form_jja.apellido, correo: form_jja.correo, telefono: form_jja.telefono })
      })
      setEditando_jja(false)
      setExito_jja('Perfil actualizado correctamente')
      setTimeout(() => setExito_jja(''), 3000)
      // Refrescar login context
      login(token, { ...usuario, nombre: form_jja.nombre, apellido: form_jja.apellido, correo: form_jja.correo, telefono: form_jja.telefono })
    } catch (err) { mostrarModal({ mensaje: 'Error: ' + err.message, tipo: 'error' }) }
    finally { setGuardando_jja(false) }
  }

  const handleCambiarClave = async () => {
    if (clave_jja.nueva.length < 6) { setErrorClave_jja('La nueva contraseña debe tener al menos 6 caracteres'); return }
    if (clave_jja.nueva !== clave_jja.confirmar) { setErrorClave_jja('Las contraseñas no coinciden'); return }
    setGuardando_jja(true)
    try {
      await apiRequest(`/usuarios/${usuario.id}/password`, {
        method: 'PATCH',
        body: JSON.stringify({ contrasena_actual: clave_jja.actual, nueva_contrasena: clave_jja.nueva })
      })
      setClave_jja({ actual: '', nueva: '', confirmar: '' })
      setExito_jja('Contraseña cambiada correctamente')
      setTimeout(() => setExito_jja(''), 3000)
    } catch (err) { setErrorClave_jja(err.message) }
    finally { setGuardando_jja(false) }
  }

  const apiUrlBase = API_URL_JC.replace('/api/v1', '')
  const avatarUrl = usuario?.imagen ? `${apiUrlBase}${usuario.imagen}` : null

  const manejarEntradaArrastre_jja = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver_jja(true) }
  const manejarSalidaArrastre_jja = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver_jja(false) }
  const manejarCaida_jja = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragOver_jja(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) subirImagen_jja(e.dataTransfer.files[0])
  }
  const manejarSeleccionImagen_jja = (e) => {
    if (e.target.files && e.target.files.length > 0) subirImagen_jja(e.target.files[0])
  }

  const subirImagen_jja = async (archivo) => {
    setSubiendoImagen_jja(true)
    try {
      const formData = new FormData()
      formData.append('imagen', archivo)
      
      const res = await apiRequest(`/usuarios/${usuario.id}/imagen`, {
        method: 'POST',
        body: formData,
      })
      if (res.exito) {
        setExito_jja('Imagen de perfil actualizada')
        setTimeout(() => setExito_jja(''), 3000)
        const usuarioActualizado = { ...usuario, imagen: res.datos?.imagen || res.imagen }
        login(token, usuarioActualizado)
      }
    } catch (err) { mostrarModal({ mensaje: 'Error al subir imagen: ' + err.message, tipo: 'error' }) }
    finally { setSubiendoImagen_jja(false) }
  }

  return (
    <div>
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja">Mi Perfil</h1>
          <p className="pagina-subtitulo-jja">Administra tu información personal y seguridad</p>
        </div>
      </div>

      {exito_jja && (
        <div style={{ background: 'var(--color-exito-bg-jja)', color: '#065f46', padding: '10px 16px', borderRadius: 'var(--border-radius-sm-jja)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600 }}>
          <IconoCheck_jja /> {exito_jja}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Card de perfil */}
        <div className="card-jja" style={{ textAlign: 'center' }}>
          <div className="card-body-jja" style={{ padding: 28 }}>
            <div 
              style={{ 
                width: 80, height: 80, borderRadius: 16, 
                background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, var(--color-primario-jja), var(--color-secundario-jja))', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', 
                fontSize: '1.5rem', fontWeight: 800, margin: '0 auto 12px',
                cursor: 'pointer', overflow: 'hidden', position: 'relative',
                border: dragOver_jja ? '3px dashed var(--color-primario-jja)' : '3px solid transparent'
              }}
              onClick={() => inputRef_jja.current?.click()}
              onDragEnter={manejarEntradaArrastre_jja}
              onDragOver={manejarEntradaArrastre_jja}
              onDragLeave={manejarSalidaArrastre_jja}
              onDrop={manejarCaida_jja}
              title="Haz clic o arrastra una imagen para cambiar tu foto de perfil"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                iniciales
              )}
              <div style={{
                position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                opacity: (dragOver_jja || subiendoImagen_jja) ? 1 : 0, transition: 'opacity 0.2s ease', 
                pointerEvents: 'none'
              }}>
                {subiendoImagen_jja ? '⏳' : '📷'}
              </div>
            </div>
            <input 
              type="file" 
              ref={inputRef_jja} 
              style={{ display: 'none' }} 
              accept="image/png, image/jpeg, image/webp" 
              onChange={manejarSeleccionImagen_jja}
            />
            <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{usuario?.nombre} {usuario?.apellido}</div>
            <div style={{ color: 'var(--texto-secundario-jja)', fontSize: '0.85rem', margin: '4px 0 8px' }}>{usuario?.correo}</div>
            <StatusBadge_jja estado={usuario?.rol} />
            <div style={{ marginTop: 16, fontSize: '0.78rem', color: 'var(--texto-terciario-jja)' }}>
              Cédula: {usuario?.cedula || '—'}
            </div>
          </div>
        </div>

        {/* Formularios */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Datos personales */}
          <div className="card-jja">
            <div className="card-header-jja">
              <span className="card-titulo-jja"><IconoPerfil_jja style={{ fontSize: '1.1rem' }} /> Información Personal</span>
              {!editando_jja && (
                <BotonAccion_jja variante="ghost" tamaño="sm" onClick={() => setEditando_jja(true)}>Editar</BotonAccion_jja>
              )}
            </div>
            <div className="card-body-jja">
              <div className="form-grid-jja">
                <FormGroup_jja label="Nombre" nombre="nombre" valor={form_jja.nombre} onChange={handleCambio} disabled={!editando_jja} />
                <FormGroup_jja label="Apellido" nombre="apellido" valor={form_jja.apellido} onChange={handleCambio} disabled={!editando_jja} />
              </div>
              <div className="form-grid-jja">
                <FormGroup_jja label="Correo" nombre="correo" tipo="email" valor={form_jja.correo} onChange={handleCambio} disabled={!editando_jja} />
                <FormGroup_jja label="Teléfono" nombre="telefono" valor={form_jja.telefono} onChange={handleCambio} disabled={!editando_jja} />
              </div>
              {editando_jja && (
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                  <BotonAccion_jja variante="ghost" onClick={() => setEditando_jja(false)}>Cancelar</BotonAccion_jja>
                  <BotonAccion_jja variante="primario" onClick={handleGuardarPerfil} cargando={guardando_jja}>Guardar</BotonAccion_jja>
                </div>
              )}
            </div>
          </div>

          {/* Cambiar contraseña */}
          <div className="card-jja">
            <div className="card-header-jja">
              <span className="card-titulo-jja">Cambiar Contraseña</span>
            </div>
            <div className="card-body-jja">
              <FormGroup_jja label="Contraseña actual" nombre="actual" tipo="password" valor={clave_jja.actual} onChange={handleCambioClave} />
              <div className="form-grid-jja">
                <FormGroup_jja label="Nueva contraseña" nombre="nueva" tipo="password" valor={clave_jja.nueva} onChange={handleCambioClave} />
                <FormGroup_jja label="Confirmar nueva contraseña" nombre="confirmar" tipo="password" valor={clave_jja.confirmar} onChange={handleCambioClave} error={errorClave_jja} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <BotonAccion_jja variante="primario" onClick={handleCambiarClave} cargando={guardando_jja} disabled={!clave_jja.actual || !clave_jja.nueva}>
                  Cambiar Contraseña
                </BotonAccion_jja>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerfilPage_jja
