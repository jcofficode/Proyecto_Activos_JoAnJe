import React, {useEffect, useState} from 'react'
import {apiRequest} from '../utils/api'
import Card from '../components/ui/Card'

export default function MyLoansPage(){
  const [loans,setLoans] = useState([])
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState('')

  useEffect(()=>{ load() },[])

  async function load(){
    try{
      // Obtener prestamos tradicionales y prestamos de productos
      const me = await apiRequest('/auth/me')
      const prestamosResp = await apiRequest(`/prestamos/usuario/${me.id}`)
      const prestamosProductosResp = await apiRequest(`/prestamos-productos/usuario/${me.id}`)
      const prestamos = prestamosResp.prestamos || prestamosResp || []
      const prestamosProd = prestamosProductosResp || []
      // Normalizar y combinar para mostrar
      const normal = (
        prestamos.map(p => ({
          tipo: 'activo',
          id: p.id_prestamo_jja,
          nombre: p.nombre_activo_jja || p.nombre_jja || '',
          estado: p.estado_prestamo_jja,
          fecha: p.fecha_prestamo_jja
        }))
      ).concat(
        prestamosProd.map(pp => ({
          tipo: 'producto',
          id: pp.id_prestamo_producto_jja,
          nombre: pp.producto_nombre,
          estado: pp.estado_jja,
          fecha: pp.fecha_prestamo_jja
        }))
      )
      setLoans(normal)
    }catch(err){ setError(err.message) }
    finally{ setLoading(false) }
  }

  if(loading) return <div>Cargando tus préstamos...</div>
  if(error) return <div className="error">{error}</div>

  return (
    <div className="container seccion">
      <div className="page-hero">
        <div>
          <div className="page-title">Mis préstamos</div>
          <div className="page-subtitle">Historial y estado de tus préstamos.</div>
        </div>
      </div>

      <div className="page-content">
        <div style={{display:'grid',gap:12}}>
          {loans.length===0 && <Card className="p-16 muted">No hay préstamos.</Card>}
          {loans.map(l=> (
            <Card key={l.tipo+"-"+l.id}>
              <strong>{l.tipo==='activo' ? `Préstamo #${l.id}` : `Préstamo producto #${l.id}`}</strong>
              <div className="muted">{l.nombre}</div>
              <div className="muted">Estado: {l.estado}</div>
              <div style={{marginTop:8}}>
                  {l.estado==='activo' && <button className="btn" onClick={()=>solicitarDevolucion(l.id, l.tipo)}>Solicitar devolución</button>}
                  {l.tipo==='producto' && l.estado==='activo' && <button className="btn" onClick={()=>solicitarDevolucion(l.id, l.tipo)}>Solicitar devolución</button>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  async function solicitarDevolucion(id, tipo){
    try{
      if (tipo === 'activo') {
        await apiRequest(`/prestamos/${id}/solicitud-devolucion`, { method: 'POST', body: JSON.stringify({ observaciones: 'Solicito devolución desde la app.' }) })
      } else if (tipo === 'producto') {
        await apiRequest(`/prestamos-productos/${id}/solicitud-devolucion`, { method: 'POST', body: JSON.stringify({ observaciones: 'Solicito devolución del producto desde la app.' }) })
      }
      alert('Solicitud de devolución enviada')
      load()
    } catch(err) { alert('Error: ' + err.message) }
  }
                {l.estado==='activo' && <button className="btn" onClick={()=>solicitarDevolucion(l.id, l.tipo)}>Solicitar devolución</button>}
                {l.estado==='producto' && <button className="btn" onClick={()=>solicitarDevolucion(l.id, l.tipo)}>Solicitar devolución</button>}
}
