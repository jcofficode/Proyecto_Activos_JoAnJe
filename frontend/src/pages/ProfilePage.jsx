import React, {useEffect, useState} from 'react'
import {apiRequest} from '../utils/api'
import Card from '../components/ui/Card'

export default function ProfilePage(){
  const [me,setMe] = useState(null)
  const [loading,setLoading] = useState(true)
  const [form,setForm] = useState({nombre:'',apellido:'',correo:''})

  useEffect(()=>{ load() },[])

  async function load(){
    try{
      const data = await apiRequest('/auth/me')
      setMe(data)
      setForm({nombre: data.nombre_jja || '', apellido: data.apellido_jja || '', correo: data.correo_jja || ''})
    }catch(err){ console.log(err.message) }
    finally{ setLoading(false) }
  }

  async function save(){
    try{
      await apiRequest(`/usuarios/${me.id_usuario_jja}`, { method: 'PUT', body: JSON.stringify({ nombre: form.nombre, apellido: form.apellido, correo: form.correo, id_rol: me.id_rol_jja }) })
      alert('Perfil actualizado')
    }catch(err){ alert('Error: '+err.message) }
  }

  if(loading) return <div>Cargando perfil...</div>
  if(!me) return <div>No autenticado</div>

  return (
    <div className="container seccion">
      <div className="page-hero">
        <div>
          <div className="page-title">Mi Perfil</div>
          <div className="page-subtitle">Actualiza tus datos personales.</div>
        </div>
      </div>

      <div className="page-content">
        <Card className="p-16">
          <div style={{display:'grid',gap:8}}>
            <label>Nombre</label>
            <input value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} />
            <label>Apellido</label>
            <input value={form.apellido} onChange={e=>setForm({...form,apellido:e.target.value})} />
            <label>Correo</label>
            <input value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})} />
            <div style={{marginTop:8}}>
              <button className="btn" onClick={save}>Guardar</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
