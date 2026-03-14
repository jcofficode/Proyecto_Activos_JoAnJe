import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/layout/Header'
import Hero from './components/landing/Hero'
import VideoDemo from './components/landing/VideoDemo'
import ComoFunciona from './components/landing/ComoFunciona'
import Politicas from './components/landing/Politicas'
import Testimonios from './components/landing/Testimonios'
import SobreNosotros from './components/landing/SobreNosotros'
import Equipo from './components/landing/Equipo'
import ContactoUbicacion from './components/landing/ContactoUbicacion'
import CTASeccion from './components/landing/CTASeccion'
import Footer from './components/layout/Footer'
import Login from './components/auth/Login'
import Sistema from './components/sistema/Sistema'
import InventoryPage from './pages/InventoryPage'
import AlertsPage from './pages/AlertsPage'
import ReportsPage from './pages/ReportsPage'
import UsersPage from './pages/UsersPage'
import MarketplacePage from './pages/MarketplacePage'
import MyLoansPage from './pages/MyLoansPage'
import MyRequestsPage from './pages/MyRequestsPage'
import RequestsPage from './pages/RequestsPage'
import ProfilePage from './pages/ProfilePage'
import { apiRequest, API_URL_JC } from './utils/api'

const App = () => {
  const [usuario_jc, setUsuario_jc] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar autenticación al inicio
  useEffect(() => {
    console.log('🚀 APP: Iniciando aplicación')
    const token = sessionStorage.getItem('token_jja')
    console.log('🔑 APP: Token en sessionStorage:', token ? 'PRESENTE' : 'AUSENTE')
    
    if (token) {
      console.log('🔍 APP: Verificando token con /auth/me...')
      // Verificar token
      fetch(`${API_URL_JC}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        console.log('📡 APP: Respuesta de /auth/me - Status:', res.status)
        return res.json()
      })
      .then(data => {
        console.log('📋 APP: Datos de /auth/me:', data)
        if (data.exito && data.datos) {
          console.log('✅ APP: Token válido, configurando usuario:', data.datos.nombre_jja)
          setUsuario_jc({
            nombre: data.datos.nombre_jja,
            correo: data.datos.correo_jja,
            rol: data.datos.nombre_rol_jja
          })
        } else {
          console.log('❌ APP: Datos inválidos, limpiando token')
          sessionStorage.removeItem('token_jja')
        }
      })
      .catch(error => {
        console.log('💥 APP: Error al verificar token:', error.message)
        sessionStorage.removeItem('token_jja')
      })
      .finally(() => {
        console.log('🏁 APP: Finalizando verificación, setting loading=false')
        setLoading(false)
      })
    } else {
      console.log('🚫 APP: No hay token, setting loading=false')
      setLoading(false)
    }
  }, [])

  const handleLogin = (datos) => {
    setUsuario_jc(datos)
    setLoading(false)
  }

  const handleLogout = () => {
    setUsuario_jc(null)
    sessionStorage.removeItem('token_jja')
    localStorage.removeItem('auth_verified_jja')
  }

  // Mostrar loading solo durante la verificación inicial
  if (loading) {
    return (
      <div className="app">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Verificando sesión...</div>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="app">
        {console.log('🎨 APP: Render - usuario_jc:', usuario_jc, 'loading:', loading)}
        <Header usuario_jc={usuario_jc} onLogout={handleLogout} />
        <main>
          <Routes>
          <Route path="/" element={(
            <>
              <Hero />
              <VideoDemo />
              <ComoFunciona />
              <Politicas />
              <Testimonios />
              <SobreNosotros />
              <Equipo />
              <ContactoUbicacion />
              <CTASeccion />
            </>
          )} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/sistema" element={
            usuario_jc ? (usuario_jc.rol !== 'cliente' ? <Sistema usuario_jc={usuario_jc} /> : <Navigate to="/marketplace" />) : <Navigate to="/login" />
          } />
          <Route path="/sistema/inventario" element={
            usuario_jc ? (usuario_jc.rol !== 'cliente' ? <InventoryPage /> : <Navigate to="/marketplace" />) : <Navigate to="/login" />
          } />
          <Route path="/marketplace" element={
            usuario_jc ? <MarketplacePage /> : <Navigate to="/login" />
          } />
          <Route path="/mis-prestamos" element={
            usuario_jc ? <MyLoansPage /> : <Navigate to="/login" />
          } />
          <Route path="/mis-solicitudes" element={
            usuario_jc ? <MyRequestsPage /> : <Navigate to="/login" />
          } />
          <Route path="/sistema/alertas" element={
            usuario_jc ? (usuario_jc.rol !== 'cliente' ? <AlertsPage /> : <Navigate to="/marketplace" />) : <Navigate to="/login" />
          } />
          <Route path="/sistema/reportes" element={
            usuario_jc ? (usuario_jc.rol !== 'cliente' ? <ReportsPage /> : <Navigate to="/marketplace" />) : <Navigate to="/login" />
          } />
          <Route path="/sistema/usuarios" element={
            usuario_jc ? ((usuario_jc.rol === 'administrador') ? <UsersPage /> : <Navigate to="/sistema" />) : <Navigate to="/login" />
          } />
          <Route path="/sistema/solicitudes" element={
            usuario_jc ? (usuario_jc.rol !== 'cliente' ? <RequestsPage /> : <Navigate to="/marketplace" />) : <Navigate to="/login" />
          } />
          <Route path="/perfil" element={
            usuario_jc ? <ProfilePage /> : <Navigate to="/login" />
          } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
