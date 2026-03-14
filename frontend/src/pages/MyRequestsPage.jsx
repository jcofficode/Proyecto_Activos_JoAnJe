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
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
