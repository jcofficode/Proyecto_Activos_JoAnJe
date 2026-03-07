import React from 'react'
import Alerts from '../components/sistema/Alerts'
import Card from '../components/ui/Card'

export default function AlertsPage(){
  return (
    <div className="container seccion">
      <div className="page-hero">
        <div>
          <div className="page-title">Alertas</div>
          <div className="page-subtitle">Monitorea préstamos vencidos y notificaciones.</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost">Configurar alertas</button>
        </div>
      </div>

      <div className="page-content">
        <div className="content-grid">
          <div>
            <Alerts />
          </div>
        </div>
      </div>
    </div>
  )
}
