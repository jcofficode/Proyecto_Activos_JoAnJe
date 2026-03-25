// ============================================================
// FormGroup_jja.jsx — Grupo de formulario reutilizable
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React from 'react'

const FormGroup_jja = ({
  label,
  nombre,
  tipo = 'text', // text | email | password | number | select | textarea | color | file
  valor,
  onChange,
  placeholder = '',
  error,
  helper,
  requerido = false,
  disabled = false,
  opciones = [], // Para select: [{valor, etiqueta}]
  children, // Para contenido personalizado
  className = '',
}) => {
  const inputId = `input-${nombre}-jja`

  const renderInput = () => {
    const propsBase = {
      id: inputId,
      name: nombre,
      value: valor,
      onChange: (e) => onChange?.(nombre, e.target.value),
      placeholder,
      required: requerido,
      disabled,
    }

    if (tipo === 'select') {
      return (
        <select {...propsBase} className="form-input-jja form-select-jja">
          <option value="">{placeholder || 'Seleccionar...'}</option>
          {opciones.map(op => (
            <option key={op.valor} value={op.valor}>{op.etiqueta}</option>
          ))}
        </select>
      )
    }

    if (tipo === 'textarea') {
      return <textarea {...propsBase} className="form-input-jja form-textarea-jja" />
    }

    if (tipo === 'color') {
      return (
        <div className="color-picker-jja">
          <input {...propsBase} type="color" className="color-picker-input-jja" />
          <span className="color-picker-hex-jja">{valor}</span>
        </div>
      )
    }

    if (tipo === 'file') {
      return (
        <input
          id={inputId}
          name={nombre}
          type="file"
          onChange={(e) => onChange?.(nombre, e.target.files[0])}
          disabled={disabled}
          className="form-input-jja"
          accept="image/*"
        />
      )
    }

    return <input {...propsBase} type={tipo} className="form-input-jja" />
  }

  return (
    <div className={`form-grupo-jja ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label-jja">
          {label} {requerido && <span style={{ color: 'var(--color-error-jja)' }}>*</span>}
        </label>
      )}
      {children || renderInput()}
      {error && <div className="form-error-jja">{error}</div>}
      {helper && !error && <div className="form-helper-jja">{helper}</div>}
    </div>
  )
}

export default FormGroup_jja
