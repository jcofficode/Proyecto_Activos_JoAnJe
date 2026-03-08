// ─────────────────────────────────────────────────────────────────
// api.config.js — URL base de la API (EDITAR SOLO AQUÍ)
//
// ⚠️  INSTRUCCIONES DE DESPLIEGUE (Railway / Vercel / Netlify):
//     - En desarrollo local usará: http://localhost:8000/api/v1
//     - Para producción, crea una variable de entorno en tu plataforma
//       de Frontend (ej: configuraciones de Vercel/Netlify) llamada
//       `VITE_API_URL` con la URL de tu backend en Railway.
//       Ejemplo: VITE_API_URL=https://joanje-backend-production.up.railway.app/api/v1
// ─────────────────────────────────────────────────────────────────
const CARPETA_PROYECTO = 'landing_joanje'

export const API_URL_JC =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000/api/v1'
