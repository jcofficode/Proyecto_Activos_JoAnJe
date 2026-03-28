// ============================================================
// Login.jsx — Página de acceso al sistema
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { API_URL_JC } from '../../api.config.js'
import imagenlogo_jja from "../../assets/JoanjeCoders.png"

// ── Mapa de errores DB → mensajes amigables ─────────────────
const traducirError_jja = (mensaje) => {
  if (!mensaje) return 'Ocurrió un error inesperado. Intenta de nuevo.'
  const msg = mensaje.toLowerCase()
  if (msg.includes('credenciales') || msg.includes('contraseña') || msg.includes('password'))
    return 'El correo o la contraseña son incorrectos. Verifica tus datos.'
  if (msg.includes('no encontr') || msg.includes('not found'))
    return 'No se encontró una cuenta con ese correo electrónico.'
  if (msg.includes('inactiv') || msg.includes('bloqueado') || msg.includes('desactivad'))
    return 'Tu cuenta está desactivada. Contacta al administrador.'
  if (msg.includes('token') || msg.includes('expirad'))
    return 'Tu sesión ha expirado. Inicia sesión nuevamente.'
  if (msg.includes('conexi') || msg.includes('connection') || msg.includes('timeout'))
    return 'No se pudo conectar con el servidor. Verifica tu conexión.'
  if (msg.includes('sqlstate') || msg.includes('pdo') || msg.includes('mysql'))
    return 'Error interno del sistema. Por favor intenta más tarde.'
  if (msg.includes('sancion') || msg.includes('lista negra'))
    return 'Tu cuenta tiene una sanción activa. Contacta al administrador.'
  return mensaje
}

const Login = ({ onLogin }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formulario_jja, setFormulario_jja] = useState({
    correo_jja: 'admin@activoscontroljoanje.com',
    clave_jja: 'JoAnJe2026!'
  })
  const [estado_jja, setEstado_jja] = useState({ cargando: false, mensaje: '', tipo: '' })

  const manejarCambio_jja = (e) => {
    const { name, value } = e.target
    setFormulario_jja(prev => ({ ...prev, [name]: value }))
  }

  const manejarEnvio_jja = (e) => {
    e.preventDefault()
    setEstado_jja({ cargando: true, mensaje: '', tipo: '' })
    const body_jja = {
      correo: formulario_jja.correo_jja,
      contrasena: formulario_jja.clave_jja
    }
    fetch(`${API_URL_JC}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body_jja)
    })
      .then(res => res.json())
      .then(data => {
        if (data.exito) {
          const tokenGuardar = data.datos?.token || data.token
          sessionStorage.setItem('token_jja', tokenGuardar)
          setEstado_jja({ cargando: false, mensaje: '✅ Acceso correcto. Cargando...', tipo: 'exito' })
          setTimeout(() => {
            const usuarioData = {
              id: data.datos.usuario.id,
              nombre: data.datos.usuario.nombre,
              apellido: data.datos.usuario.apellido,
              cedula: data.datos.usuario.cedula,
              correo: data.datos.usuario.correo,
              telefono: data.datos.usuario.telefono,
              imagen: data.datos.usuario.imagen,
              rol: data.datos.usuario.rol,
              id_rol: data.datos.usuario.id_rol,
              debeCambiarClave: data.datos.debe_cambiar_clave === true
            }
            if (typeof onLogin === 'function') {
              onLogin(usuarioData)
              
              // Si debe cambiar clave, ignoramos cualquier ruta previa guardada
              const next = usuarioData.debeCambiarClave 
                ? '/cambiar-clave' 
                : (location.state?.next || sessionStorage.getItem('joanje_next') || (usuarioData.rol === 'cliente' ? '/marketplace' : '/sistema'))
              
              sessionStorage.removeItem('joanje_next')
              navigate(next)
            }
          }, 1200)
        } else {
          const mensajeAmigable_jja = traducirError_jja(data.mensaje)
          setEstado_jja({ cargando: false, mensaje: mensajeAmigable_jja, tipo: 'error' })
        }
      })
      .catch(() => {
        setEstado_jja({ cargando: false, mensaje: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.', tipo: 'error' })
      })
  }

  return (
    <div className="login-pagina">
      {/* Decoración geométrica */}
      <div className="login-deco deco-1" aria-hidden="true"></div>
      <div className="login-deco deco-2" aria-hidden="true"></div>

      <div className="login-tarjeta">

        {/* Logo */}
        <div className="login-logo">
          <img src={imagenlogo_jja} alt="JoAnJe Coders" style={{ height: '70px', objectFit: 'contain' }} />
        </div>

        <h2 className="login-titulo">Acceso al Sistema</h2>
        <p className="login-subtitulo">Ingresa con tu correo y contraseña</p>

        <form onSubmit={manejarEnvio_jja}>

          <div className="login-grupo">
            <label className="login-label">Correo electrónico</label>
            <input
              type="email" name="correo_jja" value={formulario_jja.correo_jja}
              onChange={manejarCambio_jja} placeholder="tu@email.com"
              required disabled={estado_jja.cargando}
              className="login-input"
            />
          </div>

          <div className="login-grupo">
            <label className="login-label">Contraseña</label>
            <input
              type="password" name="clave_jja" value={formulario_jja.clave_jja}
              onChange={manejarCambio_jja} placeholder="••••••••"
              required disabled={estado_jja.cargando}
              className="login-input"
            />
          </div>

          {estado_jja.mensaje && (
            <div className={`login-mensaje login-msg-${estado_jja.tipo}`}>
              {estado_jja.mensaje}
            </div>
          )}

          <button
            type="submit" disabled={estado_jja.cargando}
            className="login-boton"
          >
            {estado_jja.cargando ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate('/') }}
            className="login-volver"
          >
            ← Ir a Inicio
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login
