// ============================================================
// Breadcrumb_jja.jsx — Navegación breadcrumb del sistema
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React from 'react'
import { Link } from 'react-router-dom'

const Breadcrumb_jja = ({ items = [] }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumb-jja">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <li className="breadcrumb-separador-jja" aria-hidden="true">/</li>}
            <li>
              {item.to && i < items.length - 1 ? (
                <Link to={item.to} className="breadcrumb-item-jja">{item.label}</Link>
              ) : (
                <span className={`breadcrumb-item-jja ${i === items.length - 1 ? 'activo-jja' : ''}`}>{item.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb_jja
