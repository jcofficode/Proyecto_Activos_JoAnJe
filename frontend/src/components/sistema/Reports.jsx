import React from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'

export default function Reports(){
  // placeholder charts / stats for demo; integrate real chart lib later
  return (
    <div>
      <h3>Reportes</h3>
      <Card className="p-16">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div className="p-12" style={{background:'#fff',borderRadius:8}}>
            <h4>Resumen mensual</h4>
            <div className="muted">Préstamos totales: 12</div>
          </div>
          <div className="p-12" style={{background:'#fff',borderRadius:8}}>
            <h4>Productos por categoría</h4>
            <div className="muted">Electrónica: 8 • Herramientas: 4</div>
          </div>
        </div>
      </Card>

      <div style={{marginTop:12}}>
        <Card className="p-16">
          <h4>Exportar reportes</h4>
          <div className="muted">Descarga CSV o genera PDF con filtros — demo sin backend.</div>
          <div style={{marginTop:8}}><Button variant="ghost">Exportar CSV</Button></div>
        </Card>
      </div>
    </div>
  )
}
