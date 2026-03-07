// ─────────────────────────────────────────────────────────────────
// api.config.js — URL base de la API (EDITAR SOLO AQUÍ)
//
// ⚠️  INSTRUCCIÓN PARA EL PROFESOR:
//     Solo cambie el nombre de la carpeta abajo si es diferente.
//     Ejemplo: si copió el proyecto en www/mi_proyecto/
//     entonces cambie 'proyecto_final' por 'mi_proyecto'
// ─────────────────────────────────────────────────────────────────
const CARPETA_PROYECTO = 'landing_joanje'

// Durante desarrollo local preferimos el servidor PHP integrado en :8000
// Para producción / despliegue, establece `VITE_API_URL` en el entorno.
export const API_URL_JC =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000/controller/UsuarioControlador_jc.php'
