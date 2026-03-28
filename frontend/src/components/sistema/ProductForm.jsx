import React, { useState, useEffect } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { apiRequest, API_URL_JC } from '../../utils/api'
import { useModal_jja } from '../../context/ModalContext_jja'

export default function ProductForm({ onSave, initial = null, onCancel = null }) {
  const { mostrarModal } = useModal_jja()
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

  // si viene un initial, precargar campos para edición
  useEffect(() => {
    if (initial) {
      setNombre(initial.nombre_jja || initial.nombre || '')
      setIdTipo(initial.id_tipo_jja || initial.id_tipo || '')
      setUbicacion(initial.ubicacion_jja || initial.ubicacion || '')
      setDescripcion(initial.descripcion_jja || initial.descripcion || '')
      // codigoQR lo dejamos como campo opcional de creación solamente
    } else {
      // limpiar si se quita el initial
      setNombre('')
      setIdTipo('')
      setUbicacion('')
      setDescripcion('')
      setCodigoQR('')
      setImagen(null)
    }
  }, [initial])

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
      let res = null
      if (initial && (initial.id_activo_jja || initial.id)) {
        // Editar existente (PUT)
        const id = initial.id_activo_jja || initial.id
        const body = {
          nombre: nombre.trim(),
          id_tipo: Number(idTipo),
          ubicacion: ubicacion.trim(),
          descripcion: descripcion.trim()
        }
        res = await apiRequest(`/activos/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      } else {
        const activo = {
          nombre: nombre.trim(),
          // omitimos codigo_qr si está vacío para que el backend lo genere automáticamente
          ...(codigoQR.trim() !== '' ? { codigo_qr: codigoQR.trim() } : {}),
          id_tipo: Number(idTipo),
          ubicacion: ubicacion.trim(),
          descripcion: descripcion.trim()
        }
        res = await apiRequest('/activos', { method: 'POST', body: JSON.stringify(activo) })
      }

      // Si se subió una imagen, enviarla al endpoint de imagenes del activo
      const nuevoId = res.datos?.id_activo_jja || res.datos?.id || (initial && (initial.id_activo_jja || initial.id)) || null
      if (imagen && nuevoId) {
        const form = new FormData()
        form.append('imagen', imagen)
        await fetch(`${API_URL_JC}/activos/${nuevoId}/imagen`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token_jja')}`
          },
          body: form
        })
      }
      onSave(res && res.datos ? res.datos : null)
      setNombre('')
      setIdTipo('')
      setUbicacion('')
      setDescripcion('')
      setCodigoQR('')
      setCodigoQR('')
      setImagen(null)
    } catch (err) {
      mostrarModal({ mensaje: 'Error al guardar activo: ' + err.message, tipo: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-16" style={{maxWidth:520}}>
      <form onSubmit={handleSubmit}>
        <h3 className="mb-8">{initial ? 'Editar activo' : 'Agregar activo'}</h3>
        <Input label="Nombre" required value={nombre} onChange={e => setNombre(e.target.value)} />
        <div className="form-group">
          <label>Tipo de activo</label>
          <select value={idTipo} onChange={e => setIdTipo(e.target.value)} required className="form-control">
            <option value="">Seleccionar tipo</option>
            {tipos.map(t => <option key={t.id_tipo_jja} value={t.id_tipo_jja}>{t.nombre_tipo_jja}</option>)}
          </select>
        </div>
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
          {initial && onCancel && (
            <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
          )}
          <Button variant="light" type="submit" disabled={loading}>
            {loading ? 'Guardando...' : (initial ? 'Guardar cambios' : 'Guardar')}
          </Button>
        </div>
      </form>
    </Card>
  )
}
