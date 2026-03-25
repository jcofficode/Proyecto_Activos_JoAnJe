// ============================================================
// useAuth_jja.js — Hook que consume AuthContext_jja
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import { useContext } from 'react'
import { AuthContext_jja } from '../context/AuthContext_jja'

const useAuth_jja = () => {
  const contexto = useContext(AuthContext_jja)
  if (!contexto) {
    throw new Error('useAuth_jja debe usarse dentro de AuthProvider_jja')
  }
  return contexto
}

export default useAuth_jja
