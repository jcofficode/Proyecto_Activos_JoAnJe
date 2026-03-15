import React, {useEffect, useState} from 'react'
import {apiRequest} from '../utils/api'
import Card from '../components/ui/Card'

export default function RequestsPage(){
  const [reqs,setReqs] = useState({ solicitudes: [], devoluciones_productos: [], devoluciones_prestamos: [] })
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState('')

  useEffect(()=>{ load() },[])

  async function load(){
    try{
      const data = await apiRequest('/solicitudes-prestamo')
      const devols = await apiRequest('/solicitudes-devolucion-productos')
      const devolPrest = await apiRequest('/solicitudes-devolucion')
      setReqs({
        solicitudes: (data && data.datos) || [],
        devoluciones_productos: (devols && devols.datos) || [],
        devoluciones_prestamos: (devolPrest && devolPrest.datos) || devolPrest || []
      })
    }catch(err){ setError(err.message) }
    finally{ setLoading(false) }
  }

  async function cambiarEstado(id, estado){
    try{
      await apiRequest(`/solicitudes-prestamo/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) })
      alert('Estado actualizado')
      load()
    }catch(err){ alert('Error: '+err.message) }
  }

  if(loading) return <div>Cargando solicitudes...</div>
  if(error) return <div className="error">{error}</div>

  return (
    <div className="container seccion">
      <div className="page-hero">
        <div>
          <div className="page-title">Solicitudes Marketplace</div>
          <div className="page-subtitle">Revisa y responde solicitudes de los clientes.</div>
        </div>
      </div>

      <div className="page-content">
        <div style={{display:'grid',gap:12}}>
          {(reqs.solicitudes || []).length===0 && (reqs.devoluciones_productos || []).length===0 && <Card className="p-16 muted">No hay solicitudes.</Card>}
          {(reqs.solicitudes || []).map(r=> (
            <Card key={r.id_solicitud_jja}>
              <strong>{r.producto_nombre} • x{r.cantidad_jja}</strong>
              <div className="muted">Cliente: {r.cliente_nombre} • {r.cliente_correo}</div>
              <div className="muted">Estado: {r.estado_jja}</div>
              <div style={{marginTop:8}}>
                {r.estado_jja==='pendiente' && (
                  <>
                    <button className="btn" onClick={()=>cambiarEstado(r.id_solicitud_jja,'aprobada')}>Aprobar</button>
                    <button className="btn btn-ghost" onClick={()=>cambiarEstado(r.id_solicitud_jja,'rechazada')}>Rechazar</button>
                  </>
                )}
              </div>
            </Card>
          ))}

          {(reqs.devoluciones_productos || []).map(d=> (
            <Card key={d.id_solicitud_devolucion_producto_jja}>
              <strong>Devolución: {d.producto_nombre} • Préstamo #{d.prestamo_id}</strong>
              <div className="muted">Solicitante: {d.solicitante_nombre}</div>
              <div className="muted">Estado: {d.estado_jja}</div>
              <div style={{marginTop:8}}>
                {d.estado_jja==='pendiente' && (
                  <>
                    <button className="btn" onClick={()=>cambiarEstadoDevolProd(d.id_solicitud_devolucion_producto_jja,'aprobada')}>Aprobar</button>
                    <button className="btn btn-ghost" onClick={()=>cambiarEstadoDevolProd(d.id_solicitud_devolucion_producto_jja,'rechazada')}>Rechazar</button>
                  </>
                )}
              </div>
            </Card>
          ))}

          {(reqs.devoluciones_prestamos || []).map(d=> (
            <Card key={d.id_solicitud_devolucion_jja}>
              <strong>Devolución préstamo #{d.id_prestamo_jja}</strong>
              <div className="muted">Solicitante: {d.solicitante_nombre || d.id_usuario_solicitante_jja}</div>
              <div className="muted">Estado: {d.estado_jja}</div>
              <div style={{marginTop:8}}>
                {d.estado_jja==='pendiente' && (
                  <>
                    <button className="btn" onClick={()=>cambiarEstadoDevolPrestamo(d.id_solicitud_devolucion_jja,'aprobada')}>Aprobar</button>
                    <button className="btn btn-ghost" onClick={()=>cambiarEstadoDevolPrestamo(d.id_solicitud_devolucion_jja,'rechazada')}>Rechazar</button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

async function cambiarEstadoDevolProd(id, estado){
  try{
    await apiRequest(`/solicitudes-devolucion-productos/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) })
    alert('Estado actualizado')
    window.location.reload()
  }catch(err){ alert('Error: '+err.message) }
}

async function cambiarEstadoDevolPrestamo(id, estado){
  try{
    await apiRequest(`/solicitudes-devolucion/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) })
    alert('Estado actualizado')
    window.location.reload()
  }catch(err){ alert('Error: '+err.message) }
}
