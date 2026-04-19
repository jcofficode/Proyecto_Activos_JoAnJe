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

// Credenciales de demostración
const CREDENCIALES_DEMO_jja = [
  { rol: 'Administrador', correo: 'admin@activoscontroljoanje.com', clave: 'JoAnJe2026!', color: 'admin' },
  { rol: 'Encargado',     correo: 'encargado@demo.com',            clave: 'Encargado2026!', color: 'encargado' },
  { rol: 'Cliente',       correo: 'cliente@demo.com',              clave: 'Cliente2026!', color: 'cliente' },
]

const Login = ({ onLogin }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formulario_jja, setFormulario_jja] = useState({
    correo_jja: '',
    clave_jja: ''
  })
  const [estado_jja, setEstado_jja] = useState({ cargando: false, mensaje: '', tipo: '' })
  const [copiado_jja, setCopiado_jja] = useState('')

  const copiarAlPortapapeles_jja = async (valor, clave) => {
    try {
      await navigator.clipboard.writeText(valor)
      setCopiado_jja(clave)
      setTimeout(() => setCopiado_jja(''), 1400)
    } catch { /* silenciar */ }
  }

  const rellenarCredenciales_jja = (c) => {
    setFormulario_jja({ correo_jja: c.correo, clave_jja: c.clave })
  }

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
      <div className="login-split">

        {/* ── Panel lateral decorativo ── */}
        <aside className="login-panel-marca" aria-hidden="true">
          <div className="login-marca-deco login-marca-deco-1"></div>
          <div className="login-marca-deco login-marca-deco-2"></div>
          <div className="login-marca-deco login-marca-deco-3"></div>

          <div className="login-marca-contenido">
            <div className="login-marca-logo">
              <img src={imagenlogo_jja} alt="JoAnJe Coders" />
            </div>
            <h1 className="login-marca-titulo">Bienvenido a<br/>JoAnJe Coders</h1>
            <p className="login-marca-lema">
              Gestión inteligente de activos institucionales.<br/>
              Seguimiento y préstamos de activos.
            </p>
            <div className="login-marca-firma">
              <span className="login-marca-punto"></span>
              <span>Sistema de Préstamos de Activos · 2026</span>
            </div>
          </div>

          <svg className="login-marca-ondas" viewBox="0 0 120 800" preserveAspectRatio="none" aria-hidden="true">
            <path d="M60,0 C20,200 100,400 60,800 L120,800 L120,0 Z" fill="rgba(255,255,255,0.08)" />
            <path d="M80,0 C40,200 120,400 80,800 L120,800 L120,0 Z" fill="rgba(255,255,255,0.12)" />
            <path d="M100,0 C60,200 140,400 100,800 L120,800 L120,0 Z" fill="rgba(255,255,255,0.16)" />
          </svg>
        </aside>

        {/* ── Panel principal (formulario) ── */}
        <section className="login-panel-form">
          <div className="login-form-wrapper">

            <div className="login-form-encabezado">
              <h2 className="login-titulo">Acceso al Sistema</h2>
              <p className="login-subtitulo">Ingresa con tu correo y contraseña para continuar</p>
            </div>

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

            {/* Credenciales de prueba — lista compacta */}
            <div className="login-demo">
              <span className="login-demo-titulo">Credenciales de prueba</span>
              <ul className="login-demo-lista">
                {CREDENCIALES_DEMO_jja.map((c) => (
                  <li key={c.rol} className="login-demo-fila">
                    <button
                      type="button"
                      className={`login-demo-rol login-demo-${c.color}`}
                      onClick={() => rellenarCredenciales_jja(c)}
                      title="Autocompletar formulario"
                    >
                      {c.rol}
                    </button>
                    <span className="login-demo-correo" title={c.correo}>{c.correo}</span>
                    <button
                      type="button"
                      className={`login-demo-icono ${copiado_jja === c.rol + '-correo' ? 'copiado' : ''}`}
                      onClick={() => copiarAlPortapapeles_jja(c.correo, c.rol + '-correo')}
                      title="Copiar correo"
                    >
                      {copiado_jja === c.rol + '-correo' ? '✓' : '⧉'}
                    </button>
                    <button
                      type="button"
                      className={`login-demo-icono ${copiado_jja === c.rol + '-clave' ? 'copiado' : ''}`}
                      onClick={() => copiarAlPortapapeles_jja(c.clave, c.rol + '-clave')}
                      title="Copiar contraseña"
                    >
                      {copiado_jja === c.rol + '-clave' ? '✓' : '🔒'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>
      </div>
    </div>
  )
}

export default Login
