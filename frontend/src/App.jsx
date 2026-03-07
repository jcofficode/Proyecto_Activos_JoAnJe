import React, { useState, useEffect } from 'react'
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

const App = () => {
  // 'landing' | 'login' | 'sistema'
  const [pagina_jc, setPagina_jc]   = useState('landing')
  const [usuario_jc, setUsuario_jc] = useState(null)

  // ── Navega entre páginas ────────────────────────────────────────
  const navegarA_jc = (destino_jc, datos_jc = null) => {
    if (datos_jc) setUsuario_jc(datos_jc)
    setPagina_jc(destino_jc)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Escucha el evento global 'navegar_jc' ───────────────────────
  useEffect(() => {
    const handler_jc = (e) => {
      const { destino, datos } = e.detail || {}
      if (destino) navegarA_jc(destino, datos || null)
    }
    window.addEventListener('navegar_jc', handler_jc)
    return () => window.removeEventListener('navegar_jc', handler_jc)
  }, [])

  if (pagina_jc === 'login') {
    return <Login navegarA_jc={navegarA_jc} />
  }

  if (pagina_jc === 'sistema') {
    return <Sistema usuario_jc={usuario_jc} navegarA_jc={navegarA_jc} />
  }

  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <VideoDemo />
        <ComoFunciona />
        <Politicas />
        <Testimonios />
        <SobreNosotros />
        <Equipo />
        <ContactoUbicacion navegarA_jc={navegarA_jc} />
        <CTASeccion />
      </main>
      <Footer />
    </div>
  )
}

export default App
