import React, { useEffect, useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { apiRequest } from '../../utils/api'

export default function Alerts(){
  const [notifs, setNotifs] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ fetchAll(); const id = setInterval(fetchAll, 5000); return ()=>clearInterval(id) }, [])

  async function fetchAll(){
    try{
      setLoading(true)
      if(!user){
        const me = await apiRequest('/auth/me')
        setUser(me.datos || me)
      }
      const data = await apiRequest('/notificaciones')
      const rows = Array.isArray(data) ? data : (data.datos || data)
      setNotifs(rows || [])
    }catch(err){ console.error('Error cargando notificaciones', err) }
    finally{ setLoading(false) }
  }

  async function marcarLeida(id){
    try{ await apiRequest(`/notificaciones/${id}/leer`, { method: 'PATCH' }); fetchAll() }
    catch(e){ console.error(e); alert('No se pudo marcar como leída') }
  }

  async function marcarTodas(){
    if(!user) return alert('Usuario no determinado')
    try{ await apiRequest(`/notificaciones/usuario/${user.id}/leer-todas`, { method: 'PATCH' }); fetchAll() }
    catch(e){ console.error(e); alert('No se pudo marcar todas') }
  }

  const unread = notifs.filter(n => !n.leida_jja && n.leida_jja !== 1)
  const read = notifs.filter(n => n.leida_jja == 1)

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3>Alertas</h3>
        <div>
          <Button variant="ghost" onClick={fetchAll}>Actualizar</Button>
          <Button variant="ghost" onClick={marcarTodas} style={{marginLeft:8}}>Marcar todas leídas</Button>
        </div>
      </div>

      <Card className="p-16">
        <div className="mb-8">Bandeja de notificaciones</div>
        <div className="muted">Total: {notifs.length} • Sin leer: {unread.length}</div>
      </Card>

      <div style={{marginTop:12}}>
        <h4>Sin leer</h4>
        {unread.length===0 && <Card className="p-12 muted">No hay notificaciones sin leer.</Card>}
        {unread.map(n=> (
          <Card key={n.id_notificacion_jja || n.id} className="p-12" style={{display:'flex',justifyContent:'space-between'}}>
            <div>
              <strong>{n.titulo_jja || n.titulo || n.tipo_notificacion_jja}</strong>
              <div className="muted">{n.mensaje_jja || n.mensaje || ''}</div>
              <div className="muted">{n.fecha_jja || n.created_at || ''}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <Button variant="ghost" onClick={()=>marcarLeida(n.id_notificacion_jja || n.id)}>Marcar leída</Button>
            </div>
          </Card>
        ))}

        <h4 style={{marginTop:12}}>Leídas</h4>
        {read.length===0 && <Card className="p-12 muted">No hay notificaciones leídas.</Card>}
        {read.map(n=> (
          <Card key={n.id_notificacion_jja || n.id} className="p-12" style={{display:'flex',justifyContent:'space-between'}}>
            <div>
              <strong>{n.titulo_jja || n.titulo || n.tipo_notificacion_jja}</strong>
              <div className="muted">{n.mensaje_jja || n.mensaje || ''}</div>
              <div className="muted">{n.fecha_jja || n.created_at || ''}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
