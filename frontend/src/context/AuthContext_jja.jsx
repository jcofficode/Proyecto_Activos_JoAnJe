// ============================================================
// AuthContext_jja.jsx — Contexto de autenticación
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { createContext, useState, useEffect, useCallback, useRef } from 'react'
import { API_URL_JC } from '../api.config.js'

export const AuthContext_jja = createContext(null)

// Función auxiliar segura para decodificar JWT
const parseJwt_jja = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

export const AuthProvider_jja = ({ children }) => {
  const [usuario_jja, setUsuario_jja] = useState(null)
  const [cargando_jja, setCargando_jja] = useState(true)
  const [token_jja, setToken_jja] = useState(() => sessionStorage.getItem('token_jja'))

  // Ref para evitar que el useEffect sobreescriba el usuario recién establecido por login
  const loginReciente_ref = useRef(false)

  // Verificar token al inicio (solo si no fue un login reciente)
  useEffect(() => {
    if (!token_jja) {
      setCargando_jja(false)
      setUsuario_jja(null)
      return
    }

    // Si acabamos de hacer login, ya tenemos el usuario — no llamar a /auth/me
    if (loginReciente_ref.current) {
      loginReciente_ref.current = false
      setCargando_jja(false)
      return
    }

    fetch(`${API_URL_JC}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token_jja}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        // Guardar el status HTTP para diferenciar tipos de error
        return res.json().then(data => ({ status: res.status, data }))
      })
      .then(({ status, data }) => {
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
        } else if (status === 401) {
          // Solo limpiar sesión en errores de autenticación reales (token inválido/expirado)
          sessionStorage.removeItem('token_jja')
          setToken_jja(null)
          setUsuario_jja(null)
        } else if (status === 403 && data.debe_cambiar_clave) {
          // Extraemos los datos básicos del JWT para mantener la sesión viva
          const payload_jja = parseJwt_jja(token_jja)
          setUsuario_jja({
            id: payload_jja?.id || null,
            nombre: payload_jja?.nombre || 'Usuario',
            correo: payload_jja?.correo || '',
            rol: payload_jja?.rol || 'cliente',
            debeCambiarClave: true
          })
        } else {
          // Otros errores (500, 403 genéricos, etc.) — no cerrar sesión automáticamente
          console.warn('Error en /auth/me:', status, data.mensaje)
        }
      })
      .catch((err) => {
        // Error de red — no cerrar sesión
        console.warn('Error de red en /auth/me:', err)
      })
      .finally(() => setCargando_jja(false))
  }, [token_jja])

  const login_jja = useCallback((tokenNuevo, datosUsuario) => {
    // Marcar que fue un login para que el useEffect no sobreescriba
    loginReciente_ref.current = true
    sessionStorage.setItem('token_jja', tokenNuevo)
    setToken_jja(tokenNuevo)
    setUsuario_jja({
      id: datosUsuario.id,
      nombre: datosUsuario.nombre,
      apellido: datosUsuario.apellido || '',
      correo: datosUsuario.correo,
      telefono: datosUsuario.telefono || '',
      cedula: datosUsuario.cedula || '',
      imagen: datosUsuario.imagen || null,
      rol: datosUsuario.rol,
      id_rol: datosUsuario.id_rol,
      debeCambiarClave: datosUsuario.debeCambiarClave || false
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

