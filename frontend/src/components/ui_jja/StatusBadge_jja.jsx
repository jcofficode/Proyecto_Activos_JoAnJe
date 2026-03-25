// ============================================================
// StatusBadge_jja.jsx — Badge de estado con color dinámico
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React from 'react'

// Mapa de estados a etiquetas legibles en español
const ETIQUETAS_JJA = {
  disponible: 'Disponible',
  prestado: 'Prestado',
  en_proceso_prestamo: 'En proceso',
  en_proceso: 'En proceso',
  mantenimiento: 'Mantenimiento',
  dañado: 'Dañado',
  perdido: 'Perdido',
  activo: 'Activo',
  devuelto: 'Devuelto',
  vencido: 'Vencido',
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  cancelada: 'Cancelada',
  aceptada: 'Aceptada',
  completado: 'Completado',
  fallido: 'Fallido',
  reembolsado: 'Reembolsado',
  informativo: 'Info',
  administrador: 'Administrador',
  encargado: 'Encargado',
  cliente: 'Cliente',
}

const StatusBadge_jja = ({ estado, texto, conPunto = true }) => {
  const estadoNorm = (estado || '').toLowerCase().trim()
  const textoMostrar = texto || ETIQUETAS_JJA[estadoNorm] || estado || 'Desconocido'

  return (
    <span className={`badge-jja ${estadoNorm}-jja`}>
      {conPunto && <span className="badge-punto-jja" />}
      {textoMostrar}
    </span>
  )
}

export default StatusBadge_jja
