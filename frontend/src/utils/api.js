// utils/api.js — Helper para llamadas API con JWT
export const API_URL_JC = 'http://localhost:8000/api/v1'

export const apiRequest = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem('token_jja')
  console.log('API Request:', endpoint, 'Token exists:', !!token)
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL_JC}${endpoint}`, {
    ...options,
    headers
  })

  console.log('API Response status:', response.status)

  const data = await response.json()

  if (!response.ok) {
    console.log('API Error:', data)
    // Solo hacer logout automático para errores de autenticación específicos
    if (response.status === 401 || 
        (data.mensaje && (data.mensaje.toLowerCase().includes('token') && 
                         (data.mensaje.toLowerCase().includes('inválido') || 
                          data.mensaje.toLowerCase().includes('expirado') || 
                          data.mensaje.toLowerCase().includes('no válido'))))) {
      logout()
      window.location.href = '/'
      throw new Error('Sesión expirada. Redirigiendo al login...')
    }
    throw new Error(data.mensaje || 'Error en la solicitud')
  }

  return data
}

export const getUsuario = () => {
  // Ya no guardamos usuario en storage, se maneja en estado de React
  return null
}

export const logout = () => {
  sessionStorage.removeItem('token_jja')
  // Limpiar datos antiguos si existen
  localStorage.removeItem('joanje_products')
  localStorage.removeItem('joanje_loans')
}

export const forceLogout = () => {
  logout()
  window.location.href = '/'
}