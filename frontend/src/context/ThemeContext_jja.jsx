// ============================================================
// ThemeContext_jja.jsx — Contexto de personalización visual
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { createContext, useState, useEffect, useCallback } from 'react'

export const ThemeContext_jja = createContext(null)

const STORAGE_KEY = 'joanje_theme_jja'

const DEFAULTS = {
  nombreEmpresa: 'JoAnJe Coders',
  subtitulo: 'Sistema de Gestión de Activos',
  colorPrimario: '#4f46e5',
  colorSecundario: '#0ea5e9',
  colorSidebar: '#1e1b4b',
  logoUrl: null,
}

export const ThemeProvider_jja = ({ children }) => {
  const [tema_jja, setTema_jja] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY)
      return guardado ? { ...DEFAULTS, ...JSON.parse(guardado) } : DEFAULTS
    } catch {
      return DEFAULTS
    }
  })

  // Aplicar CSS custom properties al cambiar tema
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-primario-jja', tema_jja.colorPrimario)
    root.style.setProperty('--color-primario-hover-jja', ajustarColor(tema_jja.colorPrimario, -15))
    root.style.setProperty('--color-primario-light-jja', ajustarColor(tema_jja.colorPrimario, 85, 0.15))
    root.style.setProperty('--color-secundario-jja', tema_jja.colorSecundario)
    root.style.setProperty('--sidebar-bg-jja', tema_jja.colorSidebar)
    root.style.setProperty('--sidebar-bg-hover-jja', ajustarColor(tema_jja.colorSidebar, 10))
  }, [tema_jja])

  const actualizarTema_jja = useCallback((cambios) => {
    setTema_jja(prev => {
      const nuevo = { ...prev, ...cambios }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevo))
      return nuevo
    })
  }, [])

  const resetearTema_jja = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setTema_jja(DEFAULTS)
  }, [])

  const valor = {
    tema: tema_jja,
    actualizarTema: actualizarTema_jja,
    resetearTema: resetearTema_jja,
  }

  return (
    <ThemeContext_jja.Provider value={valor}>
      {children}
    </ThemeContext_jja.Provider>
  )
}

// ── Helper: ajustar brillo de un color hex ──────────────────
function ajustarColor(hex, porcentaje, opacidad = null) {
  if (!hex) return hex
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + porcentaje))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + porcentaje))
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + porcentaje))
  if (opacidad !== null) {
    return `rgba(${r}, ${g}, ${b}, ${opacidad})`
  }
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export default ThemeContext_jja
