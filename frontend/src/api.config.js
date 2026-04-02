// ─────────────────────────────────────────────────────────────────
// api.config.js — URL base de la API (EDITAR SOLO AQUÍ)
//
// ⚠️  INSTRUCCIONES DE DESPLIEGUE (Railway / Vercel / Netlify):
//     - La API se consume desde Railway en producción.
//     - Para desarrollo local, cambia VITE_API_URL en .env a tu localhost.
// ─────────────────────────────────────────────────────────────────
const CARPETA_PROYECTO = 'landing_joanje'

export const API_URL_JC =
  import.meta.env.VITE_API_URL ||
  'https://proyectoactivosjoanje-production.up.railway.app/api/v1'

// URL base del backend (sin /api/v1), útil para resolver imágenes/uploads
export const API_BASE_JC = API_URL_JC.replace(/\/api\/v1\/?$/, '')
