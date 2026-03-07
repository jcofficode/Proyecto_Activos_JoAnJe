import React from 'react'
import Reports from '../components/sistema/Reports'
import Card from '../components/ui/Card'

export default function ReportsPage(){
  return (
    <div className="container seccion">
      <div className="page-hero">
        <div>
          <div className="page-title">Reportes</div>
          <div className="page-subtitle">Gráficos y exportaciones para medir tu operación.</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost">Exportar</button>
        </div>
      </div>

      <div className="page-content">
        <div className="content-grid">
          <div>
            <Reports />
          </div>
        </div>
      </div>
    </div>
  )
}
