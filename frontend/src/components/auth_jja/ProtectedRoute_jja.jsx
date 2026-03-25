// ============================================================
// ProtectedRoute_jja.jsx — Ruta protegida por autenticación y rol
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth_jja from '../../hooks/useAuth_jja'

const ProtectedRoute_jja = ({ children, rolesPermitidos = [], redireccion = '/login' }) => {
  const { usuario, cargando, estaAutenticado } = useAuth_jja()

  // Mostrar loading mientras verifica
  if (cargando) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Verificando sesión...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  // Si no está autenticado, redirigir al login
  if (!estaAutenticado) {
    return <Navigate to={redireccion} replace />
  }

  // Si debe cambiar clave y está intentando acceder a otra ruta, forzar redirección
  if (usuario?.debeCambiarClave && window.location.pathname !== '/cambiar-clave') {
    return <Navigate to="/cambiar-clave" replace />
  }

  // Si hay roles permitidos, verificar
  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario?.rol)) {
    // Redirigir según rol
    if (usuario?.rol === 'cliente') {
      return <Navigate to="/marketplace" replace />
    }
    return <Navigate to="/sistema/dashboard" replace />
  }

  return children
}

export default ProtectedRoute_jja
