// ============================================================
// App.jsx — Punto de entrada de la aplicación
// Sistema JoAnJe Coders — Actualizado con roles Encargado/Cliente
// ============================================================
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider_jja, AuthContext_jja } from './context/AuthContext_jja'
import { ThemeProvider_jja } from './context/ThemeContext_jja'
import { ToastProvider_jja } from './context/ToastContext_jja'
import { NotificacionProvider_jja } from './context/NotificacionContext_jja'
import { ModalProvider_jja } from './context/ModalContext_jja'
import GlobalModal_jja from './components/ui_jja/GlobalModal_jja'
import ProtectedRoute_jja from './components/auth_jja/ProtectedRoute_jja'
import LayoutSistema_jja from './components/layout_jja/LayoutSistema_jja'

// ── Landing y Login ──────────────────────────────────────────
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
import CambiarClaveForzado_jja from './components/auth_jja/CambiarClaveForzado_jja'

// ── Páginas Admin ────────────────────────────────────────────
import Dashboard_jja from './pages/admin/Dashboard_jja'
import InventarioPage_jja from './pages/admin/InventarioPage_jja'
import UsuariosPage_jja from './pages/admin/UsuariosPage_jja'
import SolicitudesPage_jja from './pages/admin/SolicitudesPage_jja'
import ReportesPage_jja from './pages/admin/ReportesPage_jja'
import AlertasPage_jja from './pages/admin/AlertasPage_jja'
import ConfiguracionPage_jja from './pages/admin/ConfiguracionPage_jja'
import PersonalizacionPage_jja from './pages/admin/PersonalizacionPage_jja'
import AuditoriaPage_jja from './pages/admin/AuditoriaPage_jja'
import ListaNegraPage_jja from './pages/admin/ListaNegraPage_jja'
import PrestamosPage_jja from './pages/admin/PrestamosPage_jja'

// ── Página Encargado ─────────────────────────────────────────
import DashboardEncargado_jja from './pages/encargado/DashboardEncargado_jja'

// ── Páginas Cliente ──────────────────────────────────────────
import MarketplacePage_jja from './pages/cliente/MarketplacePage_jja'
import MisSolicitudesPage_jja from './pages/cliente/MisSolicitudesPage_jja'
import MisPrestamosPage_jja from './pages/cliente/MisPrestamosPage_jja'

// ── Páginas Compartidas ──────────────────────────────────────
import PerfilCompartidoPage_jja from './pages/compartido/PerfilCompartidoPage_jja'
import NotificacionesPage_jja from './pages/compartido/NotificacionesPage_jja'

// ══════════════════════════════════════════════════════════════
// Landing Page (pública)
// ══════════════════════════════════════════════════════════════
const LandingPage_jja = () => (
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
)

// ══════════════════════════════════════════════════════════════
// Dashboard Selector — renderiza según rol
// ══════════════════════════════════════════════════════════════
const DashboardSelector_jja = () => {
  const auth = React.useContext(AuthContext_jja)
  if (auth?.esAdmin) return <Dashboard_jja />
  return <DashboardEncargado_jja />
}

// ══════════════════════════════════════════════════════════════
// Rutas de la aplicación
// ══════════════════════════════════════════════════════════════
const AppRoutes_jja = () => {
  const auth = React.useContext(AuthContext_jja)

  const handleLogin = (datos) => {
    const tokenGuardado = sessionStorage.getItem('token_jja')
    if (tokenGuardado && auth?.login) {
      auth.login(tokenGuardado, {
        id: datos.id,
        nombre: datos.nombre,
        apellido: datos.apellido || '',
        cedula: datos.cedula || '',
        correo: datos.correo,
        telefono: datos.telefono || '',
        imagen: datos.imagen || null,
        rol: datos.rol,
        id_rol: datos.id_rol,
        debeCambiarClave: datos.debeCambiarClave
      })
    }
  }

  const handleLogout = () => { auth?.logout() }

  // Loading global
  if (auth?.cargando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Inter, Poppins, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Verificando sesión...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* ── Rutas públicas ───────────────────────────────── */}
      <Route path="/" element={
        <div className="app" style={{ paddingTop: 'var(--header-height)' }}>
          <Header usuario_jc={auth?.usuario ? { nombre: auth.usuario.nombre, correo: auth.usuario.correo, rol: auth.usuario.rol } : null} onLogout={handleLogout} />
          <main><LandingPage_jja /></main>
          <Footer />
        </div>
      } />

      <Route path="/login" element={
        auth?.estaAutenticado && !auth?.usuario?.debeCambiarClave ? (
          <Navigate to={auth.esCliente ? '/marketplace' : '/sistema/dashboard'} replace />
        ) : (
          <div className="app">
            <main><Login onLogin={handleLogin} /></main>
          </div>
        )
      } />

      <Route path="/cambiar-clave" element={
        <div className="app">
          <main><CambiarClaveForzado_jja /></main>
        </div>
      } />

      {/* ── Rutas del Sistema (Admin + Encargado) ────────── */}
      <Route path="/sistema" element={
        <ProtectedRoute_jja rolesPermitidos={['administrador', 'encargado']}>
          <LayoutSistema_jja />
        </ProtectedRoute_jja>
      }>
        <Route index element={<Navigate to="/sistema/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardSelector_jja />} />
        <Route path="inventario" element={<InventarioPage_jja />} />
        <Route path="usuarios" element={
          <ProtectedRoute_jja rolesPermitidos={['administrador']}>
            <UsuariosPage_jja />
          </ProtectedRoute_jja>
        } />
        <Route path="solicitudes" element={<SolicitudesPage_jja />} />
        <Route path="prestamos" element={<PrestamosPage_jja />} />
        <Route path="reportes" element={<ReportesPage_jja />} />
        <Route path="alertas" element={<AlertasPage_jja />} />
        <Route path="lista-negra" element={<ListaNegraPage_jja />} />
        <Route path="configuracion" element={
          <ProtectedRoute_jja rolesPermitidos={['administrador']}>
            <ConfiguracionPage_jja />
          </ProtectedRoute_jja>
        } />
        <Route path="personalizacion" element={
          <ProtectedRoute_jja rolesPermitidos={['administrador']}>
            <PersonalizacionPage_jja />
          </ProtectedRoute_jja>
        } />
        <Route path="auditoria" element={
          <ProtectedRoute_jja rolesPermitidos={['administrador']}>
            <AuditoriaPage_jja />
          </ProtectedRoute_jja>
        } />
        <Route path="perfil" element={<PerfilCompartidoPage_jja />} />
        <Route path="notificaciones" element={<NotificacionesPage_jja />} />
      </Route>

      {/* ── Rutas del Cliente ──────────────────────────────── */}
      <Route path="/marketplace" element={
        <ProtectedRoute_jja><LayoutSistema_jja /></ProtectedRoute_jja>
      }>
        <Route index element={<MarketplacePage_jja />} />
      </Route>

      <Route path="/mis-solicitudes" element={
        <ProtectedRoute_jja><LayoutSistema_jja /></ProtectedRoute_jja>
      }>
        <Route index element={<MisSolicitudesPage_jja />} />
      </Route>

      <Route path="/mis-prestamos" element={
        <ProtectedRoute_jja><LayoutSistema_jja /></ProtectedRoute_jja>
      }>
        <Route index element={<MisPrestamosPage_jja />} />
      </Route>

      <Route path="/perfil" element={
        <ProtectedRoute_jja><LayoutSistema_jja /></ProtectedRoute_jja>
      }>
        <Route index element={<PerfilCompartidoPage_jja />} />
      </Route>

      <Route path="/notificaciones" element={
        <ProtectedRoute_jja><LayoutSistema_jja /></ProtectedRoute_jja>
      }>
        <Route index element={<NotificacionesPage_jja />} />
      </Route>

      {/* ── Catch-all ─────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// ══════════════════════════════════════════════════════════════
// App Root
// ══════════════════════════════════════════════════════════════
const App = () => (
  <BrowserRouter>
    <AuthProvider_jja>
      <ThemeProvider_jja>
        <ToastProvider_jja>
          <NotificacionProvider_jja>
            <ModalProvider_jja>
              <AppRoutes_jja />
              <GlobalModal_jja />
            </ModalProvider_jja>
          </NotificacionProvider_jja>
        </ToastProvider_jja>
      </ThemeProvider_jja>
    </AuthProvider_jja>
  </BrowserRouter>
)

export default App
