import React, { useEffect, useMemo, useState } from 'react'
import ProductForm from './ProductForm'
import { qrImageUrl, qrDataForProduct } from '../../utils/qr'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { apiRequest, API_URL_JC } from '../../utils/api'

function ProductRow({ p, onLoan }){
  return (
    <Card className="product-row">
      <div className="product-meta">
        <strong>{p.nombre_jja}</strong>
        <div className="muted">QR: {p.codigo_qr_jja} • Estado: {p.estado_jja}</div>
        <div className="muted">Tipo: {p.nombre_tipo || 'N/A'}</div>
      </div>
      <div className="product-actions">
        <img src={qrImageUrl(p.codigo_qr_jja, 160)} alt="QR" style={{width:80,height:80}} />
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {p.estado_jja === 'disponible' && <Button variant="ghost" onClick={()=>onLoan(p)}>Prestar</Button>}
        </div>
      </div>
    </Card>
  )
}

export default function Inventory(){
  console.log('📦 INVENTORY: Componente montado')
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('🔄 INVENTORY: useEffect ejecutado')
    // Verificar que haya token y que sea válido antes de cargar productos
    const checkAndLoad = async () => {
      console.log('🔍 INVENTORY: Iniciando verificación de token')
      const token = sessionStorage.getItem('token_jja')
      const tokenInvalid = !token || token === 'undefined' || token === 'null' || token.trim() === ''
      console.log('🔑 INVENTORY: Token disponible:', tokenInvalid ? 'NO' : 'SÍ')
      if (tokenInvalid) {
        console.log('❌ Inventory: No hay token disponible')
        setError('Sesión no válida')
        setLoading(false)
        return
      }

      try {
        // Verificar que el token sea válido antes de cargar productos
        console.log('🔄 Inventory: Verificando token con /auth/me...')
        console.log('🔗 Inventory: URL completa:', `${API_URL_JC}/auth/me`)
        console.log('🔑 Inventory: Token a enviar:', token.substring(0, 50) + '...')
        
        const authResponse = await fetch(`${API_URL_JC}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        console.log('📡 Inventory: Respuesta de /auth/me - Status:', authResponse.status)
        console.log('📡 Inventory: Respuesta headers:', Object.fromEntries(authResponse.headers.entries()))

        if (!authResponse.ok) {
          console.log('❌ Inventory: Respuesta no OK, obteniendo texto de error...')
          const errorText = await authResponse.text()
          console.log('❌ Inventory: Texto de error:', errorText)
          sessionStorage.removeItem('token_jja')
          setError('Sesión expirada')
          setLoading(false)
          return
        }

        const authData = await authResponse.json()
        console.log('✅ Inventory: Datos de verificación:', authData)

        console.log('✅ Inventory: Token válido, cargando productos')
        await loadProductos()
      } catch (error) {
        console.log('❌ Inventory: Error al verificar token:', error.message)
        sessionStorage.removeItem('token_jja')
        setError('Error de conexión')
        setLoading(false)
      }
    }

    checkAndLoad()
  }, [])

  async function loadProductos() {
    console.log('🔄 Inventory: Iniciando carga de productos')
    try {
      console.log('🔄 Inventory: Llamando a apiRequest /activos')
      const data = await apiRequest('/activos')
      console.log('✅ Inventory: Datos recibidos:', data)
      // Normalizar posibles formas de respuesta: array directo, {datos: [...]}, {activos: [...]}
      if (Array.isArray(data)) setProductos(data)
      else if (Array.isArray(data.datos)) setProductos(data.datos)
      else if (Array.isArray(data.activos)) setProductos(data.activos)
      else setProductos([])
    } catch (err) {
      console.log('❌ Inventory: Error al cargar productos:', err.message)
      setError('Error al cargar activos: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSave(product){
    // Recargar la lista después de guardar
    loadProductos()
  }

  function handleLoan(product){
    // Por ahora, solo alert
    alert(`Producto ${product.nombre_jja} listo para prestar.`)
  }

  if (loading) return <div>Cargando inventario...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="inventory-inner">
      <aside style={{width:360}}>
        <ProductForm onSave={handleSave} />
      </aside>
      <section>
        <h3>Inventario</h3>
        {productos.length===0 && <Card className="p-16 muted">No hay activos. Agrega el primero usando el formulario.</Card>}
        <div style={{display:'grid',gap:12,marginTop:12}}>
          {productos.map(p=> <ProductRow key={p.id_activo_jja} p={p} onLoan={handleLoan} />)}
        </div>
      </section>
    </div>
  )
}
