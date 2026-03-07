import React, { useEffect, useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'

const LOANS_KEY = 'joanje_loans'

function loadLoans(){
  try { return JSON.parse(localStorage.getItem(LOANS_KEY) || '[]') } catch(e){return []}
}

export default function Alerts(){
  const [loans, setLoans] = useState(loadLoans)

  useEffect(()=>{
    const id = setInterval(()=> setLoans(loadLoans()), 2000)
    return ()=>clearInterval(id)
  },[])

  const overdue = loans.filter(l => !l.devuelto && new Date(l.dueAt) < new Date())

  return (
    <div>
      <h3>Alertas</h3>
      <Card className="p-16">
        <div className="mb-8">Alertas de préstamos</div>
        <div className="muted">Préstamos activos: {loans.length}</div>
      </Card>

      <div style={{marginTop:12}}>
        <h4>Vencidos</h4>
        {overdue.length===0 && <Card className="p-12 muted">No hay alertas críticas.</Card>}
        {overdue.map(o=> (
          <Card key={o.id} className="p-12" style={{display:'flex',justifyContent:'space-between'}}>
            <div>
              <strong>{o.nombre}</strong>
              <div className="muted">Solicitado por: {o.quien}</div>
              <div className="muted">Venció: {new Date(o.dueAt).toLocaleString()}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <Button variant="ghost">Notificar</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
