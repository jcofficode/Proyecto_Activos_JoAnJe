import React, { useEffect, useMemo, useState } from 'react'
import ProductForm from './ProductForm'
import { qrImageUrl, qrDataForProduct } from '../../utils/qr'
import Card from '../ui/Card'
import Button from '../ui/Button'

const STORAGE_KEY = 'joanje_products'

function loadProducts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch(e){return []}
}

function saveProducts(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function ProductRow({ p, onLoan }){
  return (
    <Card className="product-row">
      <div className="product-meta">
        <strong>{p.nombre}</strong>
        <div className="muted">SKU: {p.sku} • {p.cantidad} unidades</div>
        <div className="muted">Categoría: {p.categoria}</div>
      </div>
      <div className="product-actions">
        <img src={qrImageUrl(qrDataForProduct(p), 160)} alt="QR" style={{width:80,height:80}} />
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <Button variant="ghost" onClick={()=>onLoan(p)}>Prestar</Button>
        </div>
      </div>
    </Card>
  )
}

export default function Inventory(){
  const [productos, setProductos] = useState(loadProducts)
  const categorias = useMemo(()=>Array.from(new Set(productos.map(p=>p.categoria))),[productos])

  useEffect(()=> saveProducts(productos), [productos])

  function handleSave(product){
    setProductos(prev => [product, ...prev])
  }

  function handleLoan(product){
    // simple demo loan flow: create a loan entry and decrement available quantity
    const loans = JSON.parse(localStorage.getItem('joanje_loans') || '[]')
    const loan = { id: Date.now(), productId: product.id, nombre: product.nombre, quien: 'Demo Usuario', prestadoAt: new Date().toISOString(), dueAt: new Date(Date.now()+7*24*3600*1000).toISOString(), devuelto: false }
    loans.unshift(loan)
    localStorage.setItem('joanje_loans', JSON.stringify(loans))
    setProductos(prev => prev.map(p => p.id===product.id ? {...p, cantidad: Math.max(0,p.cantidad-1)} : p))
    alert(`Producto ${product.nombre} prestado (demo).`) 
  }

  return (
    <div className="inventory-inner">
      <aside style={{width:360}}>
        <ProductForm onSave={handleSave} existingCategories={categorias} />
      </aside>
      <section>
        <h3>Inventario</h3>
        {productos.length===0 && <Card className="p-16 muted">No hay productos. Agrega el primero usando el formulario.</Card>}
        <div style={{display:'grid',gap:12,marginTop:12}}>
          {productos.map(p=> <ProductRow key={p.id} p={p} onLoan={handleLoan} />)}
        </div>
      </section>
    </div>
  )
}
