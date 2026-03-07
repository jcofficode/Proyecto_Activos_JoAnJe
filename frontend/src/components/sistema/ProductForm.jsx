import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'

function generateSKU(nombre) {
  const base = nombre.replace(/\s+/g, '').toUpperCase().slice(0, 6)
  return `${base}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

export default function ProductForm({ onSave, existingCategories = [] }) {
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState(existingCategories[0] || '')
  const [cantidad, setCantidad] = useState(1)

  function handleSubmit(e) {
    e.preventDefault()
    const product = {
      id: uuidv4(),
      nombre: nombre.trim(),
      categoria: categoria || 'General',
      cantidad: Number(cantidad) || 1,
      sku: generateSKU(nombre || 'PROD'),
      createdAt: new Date().toISOString(),
    }
    onSave(product)
    setNombre('')
    setCantidad(1)
  }

  return (
    <Card className="p-16" style={{maxWidth:520}}>
      <form onSubmit={handleSubmit}>
        <h3 className="mb-8">Agregar producto</h3>
        <Input label="Nombre" required value={nombre} onChange={e => setNombre(e.target.value)} />
        <Input label="Categoría" value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Ej: Electrónica" />
        <Input label="Cantidad" type="number" min="1" value={cantidad} onChange={e => setCantidad(e.target.value)} />
        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:12}}>
          <Button variant="light" type="submit">Guardar</Button>
        </div>
      </form>
    </Card>
  )
}
