// ============================================================
// Iconos_jja.jsx — Biblioteca de iconos SVG profesionales
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React from 'react'

const base_jja = { width: '1em', height: '1em', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

// ── Dashboard ────────────────────────────────────────────────
export const IconoDashboard_jja = (props) => (
  <svg {...base_jja} {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
)

// ── Inventario / Caja ────────────────────────────────────────
export const IconoInventario_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
)

// ── Usuarios ─────────────────────────────────────────────────
export const IconoUsuarios_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
)

// ── Solicitudes / Clipboard ──────────────────────────────────
export const IconoSolicitudes_jja = (props) => (
  <svg {...base_jja} {...props}><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
)

// ── Reportes / Gráfico ───────────────────────────────────────
export const IconoReportes_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
)

// ── Alertas / Campana ────────────────────────────────────────
export const IconoAlertas_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
)

// ── Configuración / Engranaje ────────────────────────────────
export const IconoConfiguracion_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
)

// ── Personalización / Paleta ─────────────────────────────────
export const IconoPersonalizacion_jja = (props) => (
  <svg {...base_jja} {...props}><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
)

// ── Auditoría / Escudo ───────────────────────────────────────
export const IconoAuditoria_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
)

// ── Perfil / Usuario ─────────────────────────────────────────
export const IconoPerfil_jja = (props) => (
  <svg {...base_jja} {...props}><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
)

// ── Cerrar sesión ────────────────────────────────────────────
export const IconoLogout_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
)

// ── Plus / Agregar ───────────────────────────────────────────
export const IconoPlus_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
)

// ── Editar / Lápiz ───────────────────────────────────────────
export const IconoEditar_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
)

// ── Eliminar / Papelera ──────────────────────────────────────
export const IconoEliminar_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
)

// ── Check / Aprobar ──────────────────────────────────────────
export const IconoCheck_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M20 6 9 17l-5-5"/></svg>
)

// ── X / Cerrar / Rechazar ────────────────────────────────────
export const IconoCerrar_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
)

// ── Buscar / Lupa ────────────────────────────────────────────
export const IconoBuscar_jja = (props) => (
  <svg {...base_jja} {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
)

// ── Chevron izquierdo ────────────────────────────────────────
export const IconoChevronIzq_jja = (props) => (
  <svg {...base_jja} {...props}><path d="m15 18-6-6 6-6"/></svg>
)

// ── Chevron derecho ──────────────────────────────────────────
export const IconoChevronDer_jja = (props) => (
  <svg {...base_jja} {...props}><path d="m9 18 6-6-6-6"/></svg>
)

// ── Menú hamburguesa ─────────────────────────────────────────
export const IconoMenu_jja = (props) => (
  <svg {...base_jja} {...props}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
)

// ── Online / Punto estado ────────────────────────────────────
export const IconoOnline_jja = (props) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}><circle cx="12" cy="12" r="6"/></svg>
)

// ── Ojo / Ver ────────────────────────────────────────────────
export const IconoVer_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
)

// ── QR Code ──────────────────────────────────────────────────
export const IconoQR_jja = (props) => (
  <svg {...base_jja} {...props}><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
)

// ── Filtrar ──────────────────────────────────────────────────
export const IconoFiltrar_jja = (props) => (
  <svg {...base_jja} {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
)

// ── Exportar / Descargar ─────────────────────────────────────
export const IconoExportar_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
)

// ── Sanción / Prohibido ──────────────────────────────────────
export const IconoSancion_jja = (props) => (
  <svg {...base_jja} {...props}><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
)

// ── Calendario ───────────────────────────────────────────────
export const IconoCalendario_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
)

// ── Flecha arriba (tendencia positiva) ───────────────────────
export const IconoTendenciaArriba_jja = (props) => (
  <svg {...base_jja} {...props}><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>
)

// ── Flecha abajo (tendencia negativa) ────────────────────────
export const IconoTendenciaAbajo_jja = (props) => (
  <svg {...base_jja} {...props}><path d="m22 17-8.5-8.5-5 5L2 7"/><path d="M16 17h6v-6"/></svg>
)

// ── Préstamo / Intercambio ────────────────────────────────────
export const IconoPrestamo_jja = (props) => (
  <svg {...base_jja} {...props}><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
)

// ── Marketplace / Tienda ─────────────────────────────────────
export const IconoMarketplace_jja = (props) => (
  <svg {...base_jja} {...props}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/></svg>
)

// ── Subir imagen ─────────────────────────────────────────────
export const IconoSubir_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
)

// ── Notificación / Campana con punto ─────────────────────────
export const IconoNotificacion_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><circle cx="18" cy="4" r="3" fill="currentColor" stroke="none"/></svg>
)

// ── Reloj / Tiempo ───────────────────────────────────────────
export const IconoReloj_jja = (props) => (
  <svg {...base_jja} {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
)

// ── Cancelar / Prohibir ──────────────────────────────────────
export const IconoCancelar_jja = (props) => (
  <svg {...base_jja} {...props}><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
)

// ── Devolución / Regresar ────────────────────────────────────
export const IconoDevolucion_jja = (props) => (
  <svg {...base_jja} {...props}><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
)

// ── Carrito ──────────────────────────────────────────────────
export const IconoCarrito_jja = (props) => (
  <svg {...base_jja} {...props}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
)

// ── Estrella ─────────────────────────────────────────────────
export const IconoEstrella_jja = (props) => (
  <svg {...base_jja} {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
)

// ── Imagen / Foto ────────────────────────────────────────────
export const IconoImagen_jja = (props) => (
  <svg {...base_jja} {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
)

// ── Candado / Seguridad ──────────────────────────────────────
export const IconoCandado_jja = (props) => (
  <svg {...base_jja} {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
)

// ── Alerta Triangulo ─────────────────────────────────────────
export const IconoAlertaTriangulo_jja = (props) => (
  <svg {...base_jja} {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
)
