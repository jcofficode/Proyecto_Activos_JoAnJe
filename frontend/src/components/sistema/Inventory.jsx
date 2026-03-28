import React, { useEffect, useMemo, useState } from 'react'
import ProductForm from './ProductForm'
import { qrImageUrl, qrDataForProduct } from '../../utils/qr'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { apiRequest, API_URL_JC } from '../../utils/api'
import { useModal_jja } from '../../context/ModalContext_jja'

function ProductRow({ p, onLoan, onEdit, onDelete, onPublish }){
  // extraer imagen principal si existe
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

  // ajustar ruta si es relativa (por ejemplo '/uploads/...') — en dev Vite sirve desde public/
  if (imagenSrc && imagenSrc.startsWith('/')) {
    // Asegurar URL absoluta para evitar ambigüedades entre backend/frontend origin
    try {
      const origin = window?.location?.origin || ''
      if (origin) imagenSrc = origin.replace(/\/$/, '') + imagenSrc
    } catch(e) { /* ignore */ }
  } else if (imagenSrc && !imagenSrc.startsWith('http')) {
    // fallback: prefijar con API_URL_JC
    imagenSrc = API_URL_JC.replace(/\/$/, '') + imagenSrc
  }

  return (
    <Card className="product-row">
      <div style={{display:'flex',alignItems:'center',gap:12,width:'100%'}}>
        <div style={{width:88,height:88,flex:'0 0 88px'}}>
          {imagenSrc ? (
            <img src={imagenSrc} alt={p.nombre_jja} style={{width:88,height:88,objectFit:'cover',borderRadius:6}} />
          ) : (
            <div style={{width:88,height:88,background:'#f3f3f3',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:6}}>No image</div>
          )}
        </div>

        <div style={{flex:1}}>
          <strong>{p.nombre_jja}</strong>
          <div className="muted">Tipo: {p.nombre_tipo_jja || p.nombre_tipo || 'N/A'}</div>
          <div className="muted">Estado: {p.estado_jja}</div>
          <div className="muted">QR: {p.codigo_qr_jja}</div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
          <img src={qrImageUrl(p.codigo_qr_jja, 120)} alt="QR" style={{width:64,height:64}} />
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              {p.estado_jja === 'disponible' && <Button variant="ghost" onClick={()=>onLoan(p)}>Prestar</Button>}
              <Button variant="light" onClick={()=>onEdit(p)}>Editar</Button>
              <Button variant="ghost" onClick={()=>onDelete(p)}>Eliminar</Button>
              {/* Toggle publicar/despublicar */}
              <Button variant="primary" onClick={()=>onPublish(p)}>
                {p.publicado_jja && Number(p.publicado_jja) === 1 ? 'Despublicar' : 'Publicar'}
              </Button>
            </div>
        </div>
      </div>
    </Card>
  )
}

export default function Inventory(){
  console.log('📦 INVENTORY: Componente montado')
  const { mostrarModal } = useModal_jja()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editarProducto, setEditarProducto] = useState(null)

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
    setEditarProducto(null)
    loadProductos()
  }

  function handleEdit(product){
    setEditarProducto(product)
  }

  function handleDelete(product) {
    mostrarModal({
      titulo: 'Eliminar activo',
      mensaje: `¿Eliminar activo '${product.nombre_jja}'? Esta acción no se puede deshacer.`,
      tipo: 'warning',
      onConfirm: async () => {
        try {
          await apiRequest(`/activos/${product.id_activo_jja}`, { method: 'DELETE' })
          await loadProductos()
          mostrarModal({ mensaje: 'Activo eliminado', tipo: 'success' })
        } catch(err) { 
          mostrarModal({ mensaje: 'Error al eliminar: ' + err.message, tipo: 'error' }) 
        }
      }
    })
  }

  function handleLoan(product){
    mostrarModal({
      titulo: 'Préstamo',
      mensaje: `Producto ${product.nombre_jja} listo para prestar.`,
      tipo: 'info'
    })
  }

  function handlePublish(product){
    const id = product.id_activo_jja
    const nuevo = (product.publicado_jja && Number(product.publicado_jja) === 1) ? 0 : 1
    mostrarModal({
      titulo: 'Confirmar',
      mensaje: `¿${nuevo===1 ? 'Publicar' : 'Despublicar'} activo '${product.nombre_jja}'?`,
      tipo: 'info',
      onConfirm: async () => {
        try{
          await apiRequest(`/activos/${id}/publicar`, { method: 'PATCH', body: JSON.stringify({ publicado: nuevo }) })
          mostrarModal({ mensaje: nuevo===1 ? 'Activo publicado.' : 'Activo despublicado.', tipo: 'success' })
          await loadProductos()
        }catch(err){ 
          mostrarModal({ mensaje: 'Error al cambiar publicación: ' + err.message, tipo: 'error' }) 
        }
      }
    })
  }

  if (loading) return <div>Cargando inventario...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="inventory-inner">
      <aside style={{width:360}}>
        <ProductForm onSave={handleSave} initial={editarProducto} onCancel={()=>setEditarProducto(null)} />
      </aside>
      <section>
        <h3>Inventario</h3>
        {productos.length===0 && <Card className="p-16 muted">No hay activos. Agrega el primero usando el formulario.</Card>}
        <div style={{display:'grid',gap:12,marginTop:12}}>
          {productos.map(p=> <ProductRow key={p.id_activo_jja} p={p} onLoan={handleLoan} onEdit={handleEdit} onDelete={handleDelete} onPublish={handlePublish} />)}
        </div>
      </section>
    </div>
  )
}
