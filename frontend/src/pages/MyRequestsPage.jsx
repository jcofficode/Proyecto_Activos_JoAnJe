import React, { useEffect, useState } from 'react'
import { apiRequest } from '../utils/api'
import Card from '../components/ui/Card'

function extractUserId(meResp) {
  if (!meResp) return null
  // posibles formas: meResp.datos.id_usuario_jja | meResp.datos.id | meResp.id_usuario_jja | meResp.datos.usuario.id
  if (meResp.datos) {
    if (meResp.datos.id_usuario_jja) return meResp.datos.id_usuario_jja
    if (meResp.datos.id) return meResp.datos.id
    if (meResp.datos.usuario && meResp.datos.usuario.id) return meResp.datos.usuario.id
  }
  if (meResp.id_usuario_jja) return meResp.id_usuario_jja
  if (meResp.id) return meResp.id
  return null
}

export default function MyRequestsPage(){
  const [reqs, setReqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(()=>{ load() },[])

  async function load(){
    try{
      const me = await apiRequest('/auth/me')
      const myId = extractUserId(me)
      if (!myId) throw new Error('No se pudo determinar el ID de usuario')
      const data = await apiRequest(`/solicitudes-prestamo/cliente/${myId}`)
      // data puede venir envuelto en {datos: [...]}
      const list = Array.isArray(data) ? data : (Array.isArray(data.datos) ? data.datos : data)
      setReqs(list || [])
    }catch(err){ setError(err.message || 'Error') }
    finally{ setLoading(false) }
  }

  if (loading) return <div>Cargando tus solicitudes...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="container seccion">
      <div className="page-hero">
        <div>
          <div className="page-title">Mis solicitudes</div>
          <div className="page-subtitle">Historial de solicitudes realizadas en el marketplace.</div>
        </div>
      </div>

      <div className="page-content">
        <div style={{display:'grid',gap:12}}>
          {reqs.length===0 && <Card className="p-16 muted">No has realizado solicitudes.</Card>}
          {reqs.map(r=> (
            <Card key={r.id_solicitud_jja}>
              <strong>{r.producto_nombre}</strong>
              <div className="muted">Cantidad: {r.cantidad_jja} • Fecha: {r.fecha_solicitud_jja}</div>
              <div className="muted">Estado: {r.estado_jja}</div>
              {r.fecha_respuesta_jja && <div className="muted">Respondido: {r.fecha_respuesta_jja}</div>}
              {r.observaciones_jja && <div style={{marginTop:6}}><em>Observaciones: {r.observaciones_jja}</em></div>}
              <div style={{marginTop:8}}>
                {(r.estado_jja === 'aprobada' || r.estado_jja === 'aceptada' || r.tipo_jja === 'activo') && (
                  <button className="btn" onClick={() => solicitarDevolucionFromSolicitud(r)}>Solicitar devolución</button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

async function solicitarDevolucionFromSolicitud(r){
  try{
    const me = await apiRequest('/auth/me')
    const myId = extractUserId(me) || me.id || (me.datos && (me.datos.id || me.datos.id_usuario_jja))
    if(!myId) throw new Error('No se pudo obtener tu usuario')

    // Caso activo: buscar préstamo activo que coincida con el activo de la solicitud
    if(r.tipo_jja === 'activo' && r.id_activo_jja){
      const prestamosResp = await apiRequest(`/prestamos/usuario/${myId}`)
      const prestamos = Array.isArray(prestamosResp)
        ? prestamosResp
        : (Array.isArray(prestamosResp.prestamos)
            ? prestamosResp.prestamos
            : (Array.isArray(prestamosResp.datos) ? prestamosResp.datos : []))
      const match = prestamos.find(p => {
        // prefer id match when available
        if (p.id_activo_jja && r.id_activo_jja) return Number(p.id_activo_jja) === Number(r.id_activo_jja) && p.estado_prestamo_jja === 'activo'
        // otherwise try matching by name fields (normalize)
        const loanName = (p.activo_nombre_jja || p.nombre_activo_jja || p.nombre_jja || '').toString().trim().toLowerCase()
        const reqName = (r.producto_nombre || r.activo_nombre || r.activo_nombre_jja || '').toString().trim().toLowerCase()
        return loanName && reqName && loanName === reqName && p.estado_prestamo_jja === 'activo'
      })
      if(!match) throw new Error('No se encontró un préstamo activo para este activo.')
      await apiRequest(`/prestamos/${match.id_prestamo_jja}/solicitud-devolucion`, { method: 'POST', body: JSON.stringify({ observaciones: 'Solicito devolución desde Mis solicitudes.' }) })
      alert('Solicitud de devolución enviada')
      window.location.reload()
      return
    }

    // Caso producto: buscar préstamo de producto correspondiente
    const prestamosProdResp = await apiRequest(`/prestamos-productos/usuario/${myId}`)
    const prestamosProd = Array.isArray(prestamosProdResp)
      ? prestamosProdResp
      : (Array.isArray(prestamosProdResp.prestamos)
          ? prestamosProdResp.prestamos
          : (Array.isArray(prestamosProdResp.datos) ? prestamosProdResp.datos : []))
    // intentar emparejar por id_producto_jja o por producto_nombre
    const matchProd = prestamosProd.find(pp => (r.id_producto_jja && Number(pp.id_producto_jja) === Number(r.id_producto_jja)) || (pp.producto_nombre === r.producto_nombre))
    if(!matchProd) throw new Error('No se encontró un préstamo activo para este producto.')
    await apiRequest(`/prestamos-productos/${matchProd.id_prestamo_producto_jja}/solicitud-devolucion`, { method: 'POST', body: JSON.stringify({ observaciones: 'Solicito devolución desde Mis solicitudes.' }) })
    alert('Solicitud de devolución enviada')
    window.location.reload()
  }catch(err){ alert('Error: ' + (err.message || err)) }
}
