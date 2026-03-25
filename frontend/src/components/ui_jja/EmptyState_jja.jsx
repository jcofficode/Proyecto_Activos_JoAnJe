// ============================================================
// EmptyState_jja.jsx — Estado vacío reutilizable
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React from 'react'
import BotonAccion_jja from './BotonAccion_jja'

const EmptyState_jja = ({ icono, titulo = 'Sin datos', descripcion, textoBoton, onAccion, iconoBoton }) => {
  return (
    <div className="empty-state-jja">
      {icono && <div className="empty-state-icono-jja">{icono}</div>}
      <div className="empty-state-titulo-jja">{titulo}</div>
      {descripcion && <div className="empty-state-desc-jja">{descripcion}</div>}
      {textoBoton && onAccion && (
        <BotonAccion_jja variante="primario" icono={iconoBoton} onClick={onAccion}>
          {textoBoton}
        </BotonAccion_jja>
      )}
    </div>
  )
}

export default EmptyState_jja
