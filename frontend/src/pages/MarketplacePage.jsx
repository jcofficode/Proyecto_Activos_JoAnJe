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
      const data = await apiRequest('/activos')
      // Normalizar formas de respuesta: our API puede devolver { datos: [...] } o directamente un array
      let list = []
      if (Array.isArray(data)) list = data
      else if (Array.isArray(data.datos)) list = data.datos
      else if (Array.isArray(data.activos)) list = data.activos
      else list = []
      // Filtrar solo activos publicados
      list = list.filter(p => (p.publicado_jja || p.publicado_jja === 1));
      setProductos(list)
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
        <div className="product-grid">
          {productos.map(p=> {
            // extraer imagen principal
            let imagenSrc = null
            try {
              if (p.imagenes_jja) {
                if (Array.isArray(p.imagenes_jja) && p.imagenes_jja.length>0) imagenSrc = p.imagenes_jja[0]
                else if (typeof p.imagenes_jja === 'string') {
                  const parsed = JSON.parse(p.imagenes_jja)
                  if (Array.isArray(parsed) && parsed.length>0) imagenSrc = parsed[0]
                }
              }
            } catch(e) { imagenSrc = null }
            if (imagenSrc && imagenSrc.startsWith('/')) {
              try { imagenSrc = window.location.origin.replace(/\/$/, '') + imagenSrc } catch(e){}
            } else if (imagenSrc && !imagenSrc.startsWith('http')) {
              imagenSrc = imagenSrc
            }

            return (
              <Card key={p.id_activo_jja} className="product-card">
                <div className="product-media">
                  {imagenSrc ? (
                    <img src={imagenSrc} alt={p.nombre_jja} />
                  ) : (
                    <div className="product-placeholder">No image</div>
                  )}
                </div>

                <div className="product-body">
                  <strong className="product-title">{p.nombre_jja}</strong>
                  <div className="muted product-desc">{p.descripcion_jja}</div>
                  <div className="product-meta">Tipo: <strong>{p.nombre_tipo_jja || p.nombre_tipo || 'N/A'}</strong> · Estado: <strong>{p.estado_jja}</strong></div>
                  <div style={{marginTop:8}}>
                    <a href="#" onClick={async(e)=>{e.preventDefault(); await solicitar(p.id_activo_jja)}} className="btn btn-primary">Solicitar</a>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )

  async function solicitar(id){
    try{
      await apiRequest(`/activos/${id}/solicitudes`, { method: 'POST', body: JSON.stringify({ observaciones: 'Solicitud desde marketplace' }) })
      alert('Solicitud creada')
    }catch(err){ alert('Error: '+err.message) }
  }
}
