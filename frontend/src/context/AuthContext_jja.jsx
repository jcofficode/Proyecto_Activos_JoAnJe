// ============================================================
// AuthContext_jja.jsx — Contexto de autenticación
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { createContext, useState, useEffect, useCallback } from 'react'
import { API_URL_JC } from '../api.config.js'

export const AuthContext_jja = createContext(null)

export const AuthProvider_jja = ({ children }) => {
  const [usuario_jja, setUsuario_jja] = useState(null)
  const [cargando_jja, setCargando_jja] = useState(true)
  const [token_jja, setToken_jja] = useState(() => sessionStorage.getItem('token_jja'))

  // Verificar token al inicio
  useEffect(() => {
    if (!token_jja) {
      setCargando_jja(false)
      return
    }

    fetch(`${API_URL_JC}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token_jja}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.exito && data.datos) {
          setUsuario_jja({
            id: data.datos.id_usuario_jja,
            nombre: data.datos.nombre_jja,
            apellido: data.datos.apellido_jja,
            correo: data.datos.correo_jja,
            telefono: data.datos.telefono_jja,
            cedula: data.datos.cedula_jja,
            imagen: data.datos.imagen_jja,
            rol: data.datos.nombre_rol_jja,
            id_rol: data.datos.id_rol_jja,
          })
        } else {
          sessionStorage.removeItem('token_jja')
          setToken_jja(null)
        }
      })
      .catch(() => {
        sessionStorage.removeItem('token_jja')
        setToken_jja(null)
      })
      .finally(() => setCargando_jja(false))
  }, [token_jja])

  const login_jja = useCallback((tokenNuevo, datosUsuario) => {
    sessionStorage.setItem('token_jja', tokenNuevo)
    setToken_jja(tokenNuevo)
    setUsuario_jja({
      id: datosUsuario.id,
      nombre: datosUsuario.nombre,
      apellido: datosUsuario.apellido,
      correo: datosUsuario.correo,
      telefono: datosUsuario.telefono,
      cedula: datosUsuario.cedula,
      imagen: datosUsuario.imagen,
      rol: datosUsuario.rol,
      id_rol: datosUsuario.id_rol,
    })
  }, [])

  const logout_jja = useCallback(() => {
    sessionStorage.removeItem('token_jja')
    localStorage.removeItem('joanje_products')
    localStorage.removeItem('joanje_loans')
    setToken_jja(null)
    setUsuario_jja(null)
  }, [])

  const valor = {
    usuario: usuario_jja,
    token: token_jja,
    cargando: cargando_jja,
    login: login_jja,
    logout: logout_jja,
    estaAutenticado: !!usuario_jja,
    esAdmin: usuario_jja?.rol === 'administrador',
    esEncargado: usuario_jja?.rol === 'encargado',
    esCliente: usuario_jja?.rol === 'cliente',
  }

  return (
    <AuthContext_jja.Provider value={valor}>
      {children}
    </AuthContext_jja.Provider>
  )
}

export default AuthContext_jja
