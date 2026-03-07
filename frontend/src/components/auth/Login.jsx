import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { API_URL_JC } from '../../api.config.js'
import imagenlogo_jja from "../../assets/JoanjeCoders.png"

const irA_jc = (destino, datos = null) =>
  window.dispatchEvent(new CustomEvent('navegar_jc', { detail: { destino, datos } }))

const Login = ({ navegarA_jc, onLogin }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formulario_jc, setFormulario_jc] = useState({ correo_jc: '', clave_jc: '' })
  const [estado_jc, setEstado_jc] = useState({ cargando: false, mensaje: '', tipo: '' })

  const manejarCambio_jc = (e) => {
    const { name, value } = e.target
    setFormulario_jc(prev => ({ ...prev, [name]: value }))
  }

  const manejarEnvio_jc = (e) => {
    e.preventDefault()
    setEstado_jc({ cargando: true, mensaje: '', tipo: '' })
    const params_jc = new URLSearchParams({
      accion_jc: 'login',
      correo_jc: formulario_jc.correo_jc,
      clave_jc: formulario_jc.clave_jc,
    })
    fetch('http://localhost:8000/controller/UsuarioControlador_jc.php', {
      method: 'POST',
      body: params_jc
    })
      .then(res => res.json())
      .then(data => {
        if (data.exito) {
          setEstado_jc({ cargando: false, mensaje: '✅ Acceso correcto. Cargando...', tipo: 'exito' })
          setTimeout(() => {
            const usuarioData = { nombre: data.nombre, correo: formulario_jc.correo_jc }
            if (typeof onLogin === 'function') {
              onLogin(usuarioData)
              const next = (location.state && location.state.next) || sessionStorage.getItem('joanje_next') || '/sistema'
              sessionStorage.removeItem('joanje_next')
              navigate(next)
            } else if (typeof navegarA_jc === 'function') {
              navegarA_jc('sistema', usuarioData)
            } else {
              irA_jc('sistema', usuarioData)
            }
          }, 1200)
        } else {
          setEstado_jc({ cargando: false, mensaje: '❌ ' + data.mensaje, tipo: 'error' })
        }
      })
      .catch(() => {
        setEstado_jc({ cargando: false, mensaje: '❌ Error de conexión con el servidor.', tipo: 'error' })
      })
  }

  const volverALanding_jc = (e) => {
    e.preventDefault()
    if (typeof navegarA_jc === 'function') navegarA_jc('landing')
    else irA_jc('landing')
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

        <h2 className="login-titulo">Acceso al Demo</h2>
        <p className="login-subtitulo">Ingresa con tu correo y la clave temporal recibida</p>

        <form onSubmit={manejarEnvio_jc}>

          <div className="login-grupo">
            <label className="login-label">Correo electrónico</label>
            <input
              type="email" name="correo_jc" value={formulario_jc.correo_jc}
              onChange={manejarCambio_jc} placeholder="tu@email.com"
              required disabled={estado_jc.cargando}
              className="login-input"
            />
          </div>

          <div className="login-grupo">
            <label className="login-label">Clave temporal</label>
            <input
              type="text" name="clave_jc" value={formulario_jc.clave_jc}
              onChange={manejarCambio_jc} placeholder="Ej: AB3X9KMN"
              required disabled={estado_jc.cargando}
              className="login-input login-input-mono"
            />
          </div>

          {estado_jc.mensaje && (
            <div className={`login-mensaje login-msg-${estado_jc.tipo}`}>
              {estado_jc.mensaje}
            </div>
          )}

          <button
            type="submit" disabled={estado_jc.cargando}
            className="login-boton"
          >
            {estado_jc.cargando ? 'Verificando...' : 'Entrar al Demo'}
          </button>
        </form>

        <div className="login-footer">
          <a href="#landing" onMouseDown={volverALanding_jc} className="login-volver">
            ← Volver a la landing
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login
