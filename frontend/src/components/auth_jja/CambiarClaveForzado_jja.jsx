// ============================================================
// CambiarClaveForzado_jja.jsx — Forzar cambio de clave temporal
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL_JC } from '../../utils/api'
import useAuth_jja from '../../hooks/useAuth_jja'

const CambiarClaveForzado_jja = () => {
  const navigate = useNavigate()
  const { token, logout, login } = useAuth_jja()
  const [formulario, setFormulario] = useState({
    nueva_contrasena: '',
    confirmar_contrasena: ''
  })
  const [estado, setEstado] = useState({ cargando: false, mensaje: '', tipo: '' })

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    
    if (formulario.nueva_contrasena !== formulario.confirmar_contrasena) {
      return setEstado({ cargando: false, mensaje: 'Las contraseñas no coinciden.', tipo: 'error' })
    }

    if (formulario.nueva_contrasena.length < 8) {
      return setEstado({ cargando: false, mensaje: 'La contraseña debe tener al menos 8 caracteres.', tipo: 'error' })
    }

    setEstado({ cargando: true, mensaje: '', tipo: '' })

    try {
      const res = await fetch(`${API_URL_JC}/auth/cambiar-clave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formulario)
      })

      const data = await res.json()

      if (data.exito) {
        setEstado({ cargando: false, mensaje: '✅ Contraseña actualizada correctamente. Redirigiendo...', tipo: 'exito' })
        
        // En lugar de hacer logout, podríamos refetch o simplemente redirigir a login
        // Lo más seguro es obligar a iniciar sesión con la nueva clave para renovar el JWT
        setTimeout(() => {
          logout()
          navigate('/login')
        }, 2000)
      } else {
        setEstado({ cargando: false, mensaje: data.mensaje || 'Error al cambiar la contraseña.', tipo: 'error' })
      }
    } catch (error) {
       setEstado({ cargando: false, mensaje: 'Error de red. Verifica tu conexión.', tipo: 'error' })
    }
  }

  return (
    <div className="login-pagina">
      <div className="login-deco deco-1" aria-hidden="true"></div>
      <div className="login-deco deco-2" aria-hidden="true"></div>

      <div className="login-tarjeta" style={{ maxWidth: '450px' }}>
        <h2 className="login-titulo">¡Bienvenido al Sistema!</h2>
        <p className="login-subtitulo" style={{ color: '#4b5563', marginBottom: '24px' }}>
          Como es tu primer ingreso con una <strong>clave temporal</strong>, por tu seguridad debes establecer una nueva contraseña permanente.
        </p>

        <form onSubmit={manejarEnvio}>
          <div className="login-grupo">
            <label className="login-label">Nueva Contraseña</label>
            <input
              type="password" name="nueva_contrasena"
              value={formulario.nueva_contrasena} onChange={manejarCambio}
              placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
              required disabled={estado.cargando} className="login-input"
            />
          </div>

          <div className="login-grupo">
            <label className="login-label">Confirmar Contraseña</label>
            <input
              type="password" name="confirmar_contrasena"
              value={formulario.confirmar_contrasena} onChange={manejarCambio}
              placeholder="Repite la nueva contraseña"
              required disabled={estado.cargando} className="login-input"
            />
          </div>

          {estado.mensaje && (
            <div className={`login-mensaje login-msg-${estado.tipo}`}>
              {estado.mensaje}
            </div>
          )}

          <button type="submit" disabled={estado.cargando} className="login-boton">
            {estado.cargando ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>

        <div className="login-footer" style={{ marginTop: '20px' }}>
          <button 
             onClick={() => { logout(); navigate('/login') }}
             style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Cancelar y salir
          </button>
        </div>
      </div>
    </div>
  )
}

export default CambiarClaveForzado_jja
