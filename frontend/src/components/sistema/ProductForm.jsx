import React, { useState, useEffect } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { apiRequest } from '../../utils/api'

export default function ProductForm({ onSave }) {
  const [nombre, setNombre] = useState('')
  const [idTipo, setIdTipo] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [tipos, setTipos] = useState([])
  const [loading, setLoading] = useState(false)
  const [codigoQR, setCodigoQR] = useState('')
  const [imagen, setImagen] = useState(null)

  useEffect(() => {
    loadTipos()
  }, [])

  async function loadTipos() {
    try {
      const data = await apiRequest('/tipos-activos')
      // backend responde { exito, mensaje, datos }
      setTipos(data.datos || [])
    } catch (err) {
      console.error('Error cargando tipos:', err)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const activo = {
        nombre: nombre.trim(),
        codigo_qr: codigoQR.trim(),
        id_tipo: Number(idTipo),
        ubicacion: ubicacion.trim(),
        descripcion: descripcion.trim()
      }
      const res = await apiRequest('/activos', {
        method: 'POST',
        body: JSON.stringify(activo)
      })

      // Si se subió una imagen, enviarla al endpoint de imagenes del activo
      const nuevoId = res.datos?.id_activo_jja || res.datos?.id || null
      if (imagen && nuevoId) {
        const form = new FormData()
        form.append('imagen', imagen)
        await fetch(`${process.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/activos/${nuevoId}/imagen`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token_jja')}`
          },
          body: form
        })
      }
      onSave()
      setNombre('')
      setIdTipo('')
      setUbicacion('')
      setDescripcion('')
    } catch (err) {
      alert('Error al guardar activo: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-16" style={{maxWidth:520}}>
      <form onSubmit={handleSubmit}>
        <h3 className="mb-8">Agregar activo</h3>
        <Input label="Nombre" required value={nombre} onChange={e => setNombre(e.target.value)} />
        <div className="form-group">
          <label>Tipo de activo</label>
          <select value={idTipo} onChange={e => setIdTipo(e.target.value)} required className="form-control">
            <option value="">Seleccionar tipo</option>
            {tipos.map(t => <option key={t.id_tipo_jja} value={t.id_tipo_jja}>{t.nombre_tipo_jja}</option>)}
          </select>
        </div>
        <Input label="Código QR" required value={codigoQR} onChange={e => setCodigoQR(e.target.value)} />
        <div className="form-group">
          <label>Imagen (opcional)</label>
          <input type="file" accept="image/*" onChange={e => setImagen(e.target.files[0] || null)} className="form-control" />
        </div>
        <Input label="Ubicación" value={ubicacion} onChange={e => setUbicacion(e.target.value)} />
        <div className="form-group">
          <label>Descripción</label>
          <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} className="form-control" rows="3"></textarea>
        </div>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:12}}>
          <Button variant="light" type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
