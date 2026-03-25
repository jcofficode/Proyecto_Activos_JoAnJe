// ============================================================
// BotonAccion_jja.jsx — Botón reutilizable con variantes
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React from 'react'

const BotonAccion_jja = ({
  children,
  variante = 'primario', // primario | exito | error | advertencia | info | ghost
  tamaño = 'md', // sm | md | lg
  icono,
  block = false,
  disabled = false,
  cargando = false,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) => {
  const claseTamaño = tamaño === 'sm' ? 'btn-sm-jja' : tamaño === 'lg' ? 'btn-lg-jja' : ''
  const claseBlock = block ? 'btn-block-jja' : ''

  return (
    <button
      type={type}
      className={`btn-jja btn-${variante}-jja ${claseTamaño} ${claseBlock} ${className}`}
      disabled={disabled || cargando}
      onClick={onClick}
      {...rest}
    >
      {cargando ? (
        <>
          <span className="skeleton-jja" style={{ width: 16, height: 16, borderRadius: '50%' }} />
          Procesando...
        </>
      ) : (
        <>
          {icono && <span style={{ fontSize: '1.1em', display: 'flex' }}>{icono}</span>}
          {children}
        </>
      )}
    </button>
  )
}

export default BotonAccion_jja
