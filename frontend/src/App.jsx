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

const App = () => {
  const [usuario_jc, setUsuario_jc] = useState(() => {
    try {
      const raw = localStorage.getItem('joanje_user')
      return raw ? JSON.parse(raw) : null
    } catch (e) { return null }
  })

  const handleLogin = (datos) => {
    setUsuario_jc(datos)
    try { localStorage.setItem('joanje_user', JSON.stringify(datos)) } catch (e) { }
  }

  const handleLogout = () => {
    setUsuario_jc(null)
    try { localStorage.removeItem('joanje_user') } catch (e) { }
  }

  return (
    <BrowserRouter>
      <div className="app">
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
          <Route path="/sistema" element={usuario_jc ? <Sistema usuario_jc={usuario_jc} /> : <Navigate to="/login" />} />
          <Route path="/sistema/inventario" element={usuario_jc ? <InventoryPage /> : <Navigate to="/login" />} />
          <Route path="/sistema/alertas" element={usuario_jc ? <AlertsPage /> : <Navigate to="/login" />} />
          <Route path="/sistema/reportes" element={usuario_jc ? <ReportsPage /> : <Navigate to="/login" />} />
          <Route path="/sistema/usuarios" element={usuario_jc ? <UsersPage /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
