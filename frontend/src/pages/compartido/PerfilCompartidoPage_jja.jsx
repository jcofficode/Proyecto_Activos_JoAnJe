// ============================================================
// PerfilPage_jja.jsx — Perfil del usuario (compartido 3 roles)
// Avatar, formulario, cambio contraseña, estadísticas
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect, useRef } from 'react'
import { apiRequest, API_URL_JC } from '../../utils/api'
import useAuth_jja from '../../hooks/useAuth_jja'
import BotonAccion_jja from '../../components/ui_jja/BotonAccion_jja'
import StatusBadge_jja from '../../components/ui_jja/StatusBadge_jja'
import FormGroup_jja from '../../components/ui_jja/FormGroup_jja'
import KpiCard_jja from '../../components/ui_jja/KpiCard_jja'
import ActionModal_jja from '../../components/ui_jja/ActionModal_jja'
import {
  IconoPerfil_jja, IconoCandado_jja, IconoCheck_jja,
  IconoSolicitudes_jja, IconoPrestamo_jja, IconoDevolucion_jja,
} from '../../components/ui_jja/Iconos_jja'

// Colores avatar
const COLORES = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4']

const PerfilCompartidoPage_jja = () => {
  const { usuario, token, login } = useAuth_jja()
  const [dragOver_jja, setDragOver_jja] = useState(false)
  const [subiendoImagen_jja, setSubiendoImagen_jja] = useState(false)
  const inputRef_jja = useRef(null)

  const [form_jja, setForm_jja] = useState({
    nombre: '', apellido: '', correo: '', telefono: '', cedula: '',
  })
  const [passwordForm_jja, setPasswordForm_jja] = useState({
    actual: '', nueva: '', confirmar: '',
  })
  const [stats_jja, setStats_jja] = useState({ solicitudes: 0, prestamosActivos: 0, devueltos: 0 })
  const [guardando_jja, setGuardando_jja] = useState(false)
  const [guardandoPassword_jja, setGuardandoPassword_jja] = useState(false)
  const [modal_jja, setModal_jja] = useState({ visible: false, titulo: '', mensaje: '', variante: 'exito' })
  const [imagenSeleccionada_jja, setImagenSeleccionada_jja] = useState(null)
  const [imagenVistaPrevia_jja, setImagenVistaPrevia_jja] = useState(null)

  useEffect(() => {
    if (usuario) {
      setForm_jja({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        correo: usuario.correo || '',
        telefono: usuario.telefono || '',
        cedula: usuario.cedula || '',
      })
      cargarEstadisticas()
    }
  }, [usuario])

  async function cargarEstadisticas() {
    try {
      const me = await apiRequest('/auth/me')
      const myId = me.datos?.id_usuario_jja || me.id_usuario_jja || me.datos?.id || me.id
      if (!myId) return

      const [solResp, prestResp] = await Promise.allSettled([
        apiRequest(`/solicitudes-prestamo/cliente/${myId}`),
        apiRequest(`/prestamos/usuario/${myId}`),
      ])

      const solicitudes = extraer(solResp)
      const prestamos = extraer(prestResp)

      setStats_jja({
        solicitudes: solicitudes.length,
        prestamosActivos: prestamos.filter(p => p.estado_prestamo_jja === 'activo').length,
        devueltos: prestamos.filter(p => p.estado_prestamo_jja === 'devuelto').length,
      })
    } catch (err) { console.error(err) }
  }

  function extraer(r) {
    if (r.status !== 'fulfilled') return []
    const d = r.value
    if (Array.isArray(d)) return d
    if (d?.datos && Array.isArray(d.datos)) return d.datos
    if (d?.prestamos && Array.isArray(d.prestamos)) return d.prestamos
    return []
  }

  const handleCambioForm = (campo, valor) => setForm_jja(prev => ({ ...prev, [campo]: valor }))
  const handleCambioPassword = (campo, valor) => setPasswordForm_jja(prev => ({ ...prev, [campo]: valor }))

  const guardarPerfil = async () => {
    setGuardando_jja(true)
    try {
      const rolIdDerivado = usuario.id_rol || (usuario.rol === 'administrador' ? 1 : usuario.rol === 'encargado' ? 2 : 3)

      await apiRequest(`/usuarios/${usuario.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombre: form_jja.nombre,
          apellido: form_jja.apellido,
          cedula: form_jja.cedula,
          correo: form_jja.correo,
          telefono: form_jja.telefono,
          id_rol: rolIdDerivado,
        })
      })

      let urlImagenFinal = usuario.imagen
      if (imagenSeleccionada_jja) {
        setSubiendoImagen_jja(true)
        const formData = new FormData()
        formData.append('imagen', imagenSeleccionada_jja)
        const resImg = await apiRequest(`/usuarios/${usuario.id}/imagen`, {
          method: 'POST',
          body: formData,
        })
        if (resImg.exito) {
          urlImagenFinal = resImg.datos?.imagen || resImg.imagen || usuario.imagen
        }
        setSubiendoImagen_jja(false)
      }

      setModal_jja({ visible: true, titulo: 'Perfil Actualizado', mensaje: 'Los datos de tu perfil se han actualizado exitosamente.', variante: 'exito' })
      login(token, { ...usuario, nombre: form_jja.nombre, apellido: form_jja.apellido, cedula: form_jja.cedula, correo: form_jja.correo, telefono: form_jja.telefono, imagen: urlImagenFinal })
      setImagenSeleccionada_jja(null)
    } catch (err) { 
      setModal_jja({ visible: true, titulo: 'Error al actualizar', mensaje: err.message, variante: 'error' })
      setSubiendoImagen_jja(false) 
    }
    finally { setGuardando_jja(false) }
  }

  const cambiarPassword = async () => {
    if (passwordForm_jja.nueva !== passwordForm_jja.confirmar) {
      setModal_jja({ visible: true, titulo: 'Error', mensaje: 'Las contraseñas no coinciden', variante: 'error' })
      return
    }
    if (passwordForm_jja.nueva.length < 6) {
      setModal_jja({ visible: true, titulo: 'Error', mensaje: 'La contraseña debe tener al menos 6 caracteres', variante: 'error' })
      return
    }
    setGuardandoPassword_jja(true)
    try {
      await apiRequest(`/usuarios/${usuario.id}/password`, {
        method: 'PATCH',
        body: JSON.stringify({
          password_actual: passwordForm_jja.actual,
          password_nueva: passwordForm_jja.nueva,
        })
      })
      setModal_jja({ visible: true, titulo: 'Contraseña Actualizada', mensaje: 'Tu contraseña se ha cambiado correctamente.', variante: 'exito' })
      setPasswordForm_jja({ actual: '', nueva: '', confirmar: '' })
    } catch (err) { 
      setModal_jja({ visible: true, titulo: 'Error al cambiar contraseña', mensaje: err.message, variante: 'error' })
    }
    finally { setGuardandoPassword_jja(false) }
  }

  // Iniciales y color avatar
  const iniciales = `${(usuario?.nombre || '')[0] || ''}${(usuario?.apellido || '')[0] || ''}`.toUpperCase()
  function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i); return h }
  const colorAvatar = COLORES[Math.abs(hashStr(usuario?.nombre || '')) % COLORES.length]
  const apiUrlBase = API_URL_JC.replace('/api/v1', '')
  const avatarUrl = usuario?.imagen ? `${apiUrlBase}${usuario.imagen}` : null

  // Manejo de la subida de imagen de perfil
  const manejarEntradaArrastre_jja = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver_jja(true) }
  const manejarSalidaArrastre_jja = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver_jja(false) }
  const manejarCaida_jja = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragOver_jja(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) procesarArchivoUI_jja(e.dataTransfer.files[0])
  }
  const manejarSeleccionImagen_jja = (e) => {
    if (e.target.files && e.target.files.length > 0) procesarArchivoUI_jja(e.target.files[0])
  }
  const procesarArchivoUI_jja = (archivo) => {
    setImagenSeleccionada_jja(archivo)
    setImagenVistaPrevia_jja(URL.createObjectURL(archivo))
  }



  return (
    <div>
      {/* Header */}
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja">Mi Perfil</h1>
          <p className="pagina-subtitulo-jja">Gestiona tu información personal y seguridad</p>
        </div>
      </div>

      {/* Estadísticas mini */}
      <div className="kpi-grid-jja" style={{ marginBottom: 24 }}>
        <KpiCard_jja
          icono={<IconoSolicitudes_jja />}
          valor={stats_jja.solicitudes}
          etiqueta="Solicitudes"
          color="var(--kpi-1-jja)"
          bgColor="var(--kpi-1-bg-jja)"
        />
        <KpiCard_jja
          icono={<IconoPrestamo_jja />}
          valor={stats_jja.prestamosActivos}
          etiqueta="Préstamos Activos"
          color="var(--kpi-2-jja)"
          bgColor="var(--kpi-2-bg-jja)"
        />
        <KpiCard_jja
          icono={<IconoDevolucion_jja />}
          valor={stats_jja.devueltos}
          etiqueta="Devueltos"
          color="var(--kpi-4-jja)"
          bgColor="var(--kpi-4-bg-jja)"
        />
      </div>

      <div className="dashboard-grid-jja">
        {/* Datos personales */}
        <div className="card-jja">
          <div className="card-header-jja">
            <span className="card-titulo-jja">
              <IconoPerfil_jja style={{ fontSize: '1.1rem' }} /> Datos Personales
            </span>
            <StatusBadge_jja estado={usuario?.rol} />
          </div>
          <div className="card-body-jja">
            {/* Avatar */}
            <div className="perfil-avatar-seccion-jja">
              <div 
                className={`perfil-avatar-grande-jja ${dragOver_jja ? 'drag-over-jja' : ''} ${subiendoImagen_jja ? 'subiendo-jja' : ''}`}
                style={{ 
                  background: avatarUrl ? 'transparent' : `linear-gradient(135deg, ${colorAvatar}, ${colorAvatar}cc)`,
                  cursor: 'pointer',
                  border: dragOver_jja ? '3px dashed var(--color-primario-jja)' : '3px solid transparent',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => inputRef_jja.current?.click()}
                onDragEnter={manejarEntradaArrastre_jja}
                onDragOver={manejarEntradaArrastre_jja}
                onDragLeave={manejarSalidaArrastre_jja}
                onDrop={manejarCaida_jja}
                title="Haz clic o arrastra una imagen para cambiar tu foto de perfil"
              >
                {imagenVistaPrevia_jja || avatarUrl ? (
                  <img src={imagenVistaPrevia_jja || avatarUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  iniciales || 'U'
                )}
                {/* Overlay semi-transparente en hover para indicar accion */}
                <div style={{
                  position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
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
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{usuario?.nombre} {usuario?.apellido}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--texto-secundario-jja)' }}>{usuario?.correo}</div>
                <div style={{ fontSize: '0.75rem', marginTop: 4, color: 'var(--color-primario-jja)' }}>
                  Haz clic o arrastra una imagen para actualizar tu foto.
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="form-grid-jja">
              <FormGroup_jja label="Nombre" nombre="nombre" valor={form_jja.nombre} onChange={handleCambioForm} />
              <FormGroup_jja label="Apellido" nombre="apellido" valor={form_jja.apellido} onChange={handleCambioForm} />
            </div>
            <FormGroup_jja label="Cédula" nombre="cedula" valor={form_jja.cedula} onChange={handleCambioForm} />
            <div className="form-grid-jja">
              <FormGroup_jja label="Correo electrónico" nombre="correo" valor={form_jja.correo} onChange={handleCambioForm} />
              <FormGroup_jja label="Teléfono" nombre="telefono" valor={form_jja.telefono} onChange={handleCambioForm} />
            </div>

            <BotonAccion_jja
              variante="primario"
              icono={<IconoCheck_jja />}
              onClick={guardarPerfil}
              cargando={guardando_jja}
            >
              Guardar Cambios
            </BotonAccion_jja>
          </div>
        </div>

        {/* Cambio de contraseña */}
        <div className="card-jja">
          <div className="card-header-jja">
            <span className="card-titulo-jja">
              <IconoCandado_jja style={{ fontSize: '1.1rem' }} /> Cambiar Contraseña
            </span>
          </div>
          <div className="card-body-jja">
            <FormGroup_jja
              label="Contraseña actual"
              nombre="actual"
              tipo="password"
              valor={passwordForm_jja.actual}
              onChange={handleCambioPassword}
              placeholder="Tu contraseña actual"
            />
            <FormGroup_jja
              label="Nueva contraseña"
              nombre="nueva"
              tipo="password"
              valor={passwordForm_jja.nueva}
              onChange={handleCambioPassword}
              placeholder="Mínimo 6 caracteres"
            />
            <FormGroup_jja
              label="Confirmar nueva contraseña"
              nombre="confirmar"
              tipo="password"
              valor={passwordForm_jja.confirmar}
              onChange={handleCambioPassword}
              placeholder="Repite la nueva contraseña"
            />

            <BotonAccion_jja
              variante="advertencia"
              icono={<IconoCandado_jja />}
              onClick={cambiarPassword}
              cargando={guardandoPassword_jja}
            >
              Actualizar Contraseña
            </BotonAccion_jja>
          </div>
        </div>
      </div>

      <ActionModal_jja
        visible={modal_jja.visible}
        titulo={modal_jja.titulo}
        variante={modal_jja.variante}
        textoCancelar="Aceptar"
        sinFooter={true} 
        onCerrar={() => setModal_jja(prev => ({ ...prev, visible: false }))}
      >
        <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '1.05rem' }}>
          {modal_jja.mensaje}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <button 
            className={`btn-jja btn-${modal_jja.variante}-jja`} 
            onClick={() => setModal_jja(prev => ({ ...prev, visible: false }))}
            style={{ width: '100%' }}
          >
            Aceptar
          </button>
        </div>
      </ActionModal_jja>
    </div>
  )
}

export default PerfilCompartidoPage_jja
