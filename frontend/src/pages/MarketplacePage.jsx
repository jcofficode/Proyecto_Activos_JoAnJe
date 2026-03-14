import React, {useEffect, useState} from 'react'
import {apiRequest} from '../utils/api'
import Card from '../components/ui/Card'

export default function MarketplacePage(){
  const [productos,setProductos] = useState([])
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState('')

  useEffect(()=>{ load() },[])

  async function load(){
    try{
      const data = await apiRequest('/productos')
      // Normalizar formas de respuesta: our API puede devolver { datos: [...] } o directamente un array
      if (Array.isArray(data)) setProductos(data)
      else if (Array.isArray(data.datos)) setProductos(data.datos)
      else if (Array.isArray(data.productos)) setProductos(data.productos)
      else setProductos([])
    }catch(err){ setError(err.message) }
    finally{ setLoading(false) }
  }

  if(loading) return <div>Cargando marketplace...</div>
  if(error) return <div className="error">{error}</div>

  return (
    <div className="container seccion">
      <div className="page-hero">
        <div>
          <div className="page-title">Marketplace</div>
          <div className="page-subtitle">Solicita productos en préstamo desde aquí.</div>
        </div>
      </div>

      <div className="page-content">
        <div style={{display:'grid',gap:12}}>
          {productos.map(p=> (
            <Card key={p.id_producto_jja} className="product-card">
              <strong>{p.nombre_jja}</strong>
              <div className="muted">{p.descripcion_jja}</div>
              <div className="muted">Precio: {p.precio_jja} • Stock: {p.stock_jja}</div>
              <div style={{marginTop:8}}>
                <a href="#" onClick={async(e)=>{e.preventDefault(); await solicitar(p.id_producto_jja)}} className="btn btn-primary">Solicitar</a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  async function solicitar(id){
    try{
      const cantidad = 1
      await apiRequest(`/productos/${id}/solicitudes`, { method: 'POST', body: JSON.stringify({ cantidad }) })
      alert('Solicitud creada')
    }catch(err){ alert('Error: '+err.message) }
  }
}
