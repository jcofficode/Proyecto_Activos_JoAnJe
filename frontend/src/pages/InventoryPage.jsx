import React from 'react'
import Inventory from '../components/sistema/Inventory'
import Card from '../components/ui/Card'

export default function InventoryPage(){
  return (
    <div className="container seccion">
      <div className="page-hero">
        <div>
          <div className="page-title">Inventario</div>
          <div className="page-subtitle">Administra tus productos, genera y escanea QR, y registra préstamos.</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary">Nuevo producto</button>
        </div>
      </div>

      <div className="page-content">
        <div className="content-grid">
          <div>
            <Inventory />
          </div>
        </div>
      </div>
    </div>
  )
}
