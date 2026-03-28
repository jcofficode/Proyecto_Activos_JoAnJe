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
  const [mensaje_jja, setMensaje_jja] = useState('')
  const [mensajePassword_jja, setMensajePassword_jja] = useState('')

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
    setMensaje_jja('')
    try {
      await apiRequest(`/usuarios/${usuario.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombre: form_jja.nombre,
          apellido: form_jja.apellido,
          correo: form_jja.correo,
          telefono: form_jja.telefono,
        })
      })
      setMensaje_jja('✅ Perfil actualizado correctamente')
      // Refrescar sesión local para que Sidebar cambie enseguida y la vista
      login(token, { ...usuario, nombre: form_jja.nombre, apellido: form_jja.apellido, correo: form_jja.correo, telefono: form_jja.telefono })
    } catch (err) { setMensaje_jja('❌ Error: ' + err.message) }
    finally { setGuardando_jja(false) }
  }

  const cambiarPassword = async () => {
    setMensajePassword_jja('')
    if (passwordForm_jja.nueva !== passwordForm_jja.confirmar) {
      setMensajePassword_jja('❌ Las contraseñas no coinciden')
      return
    }
    if (passwordForm_jja.nueva.length < 6) {
      setMensajePassword_jja('❌ La contraseña debe tener al menos 6 caracteres')
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
      setMensajePassword_jja('✅ Contraseña actualizada')
      setPasswordForm_jja({ actual: '', nueva: '', confirmar: '' })
    } catch (err) { setMensajePassword_jja('❌ Error: ' + err.message) }
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
        // Al enviar FormData, no debes establecer Content-Type en los headers; 
        // el navegador y fetch se encargan de configurar el límite multipart automático.
      })
      if (res.exito) {
        setMensaje_jja('✅ Imagen de perfil actualizada')
        const usuarioActualizado = { ...usuario, imagen: res.datos?.imagen || res.imagen }
        login(token, usuarioActualizado)
      }
    } catch (err) { setMensaje_jja('❌ Error al subir: ' + err.message) }
    finally { setSubiendoImagen_jja(false) }
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
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
            <FormGroup_jja label="Cédula" nombre="cedula" valor={form_jja.cedula} onChange={() => {}} helper="Solo lectura" />
            <div className="form-grid-jja">
              <FormGroup_jja label="Correo electrónico" nombre="correo" valor={form_jja.correo} onChange={handleCambioForm} />
              <FormGroup_jja label="Teléfono" nombre="telefono" valor={form_jja.telefono} onChange={handleCambioForm} />
            </div>

            {mensaje_jja && (
              <div style={{ fontSize: '0.85rem', marginBottom: 12, padding: '8px 12px', borderRadius: 6, background: mensaje_jja.startsWith('✅') ? 'var(--color-exito-bg-jja)' : 'var(--color-error-bg-jja)' }}>
                {mensaje_jja}
              </div>
            )}

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

            {mensajePassword_jja && (
              <div style={{ fontSize: '0.85rem', marginBottom: 12, padding: '8px 12px', borderRadius: 6, background: mensajePassword_jja.startsWith('✅') ? 'var(--color-exito-bg-jja)' : 'var(--color-error-bg-jja)' }}>
                {mensajePassword_jja}
              </div>
            )}

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
    </div>
  )
}

export default PerfilCompartidoPage_jja
