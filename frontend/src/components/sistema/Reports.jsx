import React, { useEffect, useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { apiRequest } from '../../utils/api'
import { useModal_jja } from '../../context/ModalContext_jja'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

function downloadCSV(filename, rows){
  const csv = [Object.keys(rows[0] || {}).join(','), ...rows.map(r => Object.values(r).map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function Reports(){
  const { mostrarModal } = useModal_jja()
  const [topActivos, setTopActivos] = useState([])
  const [topUsuarios, setTopUsuarios] = useState([])
  const [tasaDev, setTasaDev] = useState(null)
  const [prestamosSerie, setPrestamosSerie] = useState([])
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ fetchAll() }, [])

  async function fetchAll(){
    try{
      setLoading(true)
      const [act, usu, tasa] = await Promise.all([
        apiRequest('/reportes/activos-mas-prestados'),
        apiRequest('/reportes/usuarios-activos'),
        apiRequest('/reportes/tasa-devolucion')
      ])
      setTopActivos(Array.isArray(act) ? act : (act.datos || act))
      setTopUsuarios(Array.isArray(usu) ? usu : (usu.datos || usu))
      setTasaDev(tasa && (tasa.datos || tasa))
    }catch(err){ console.error(err); mostrarModal({ mensaje: 'Error cargando reportes: '+err.message, tipo: 'error' }) }
    finally{ setLoading(false) }
  }

  async function fetchPrestamos(){
    try{
      setLoading(true)
      const qs = new URLSearchParams()
      if(fechaInicio) qs.set('fecha_inicio', fechaInicio)
      if(fechaFin) qs.set('fecha_fin', fechaFin)
      const data = await apiRequest('/reportes/prestamos?' + qs.toString())
      let rows = Array.isArray(data) ? data : (data.datos || data)
      // Si el backend devuelve prestamos individuales con `fecha_prestamo_jja`, agregarlos por fecha
      if(Array.isArray(rows) && rows.length > 0 && rows[0].fecha_prestamo_jja){
        const map = {}
        rows.forEach(r=>{
          const d = (r.fecha_prestamo_jja||'').split(' ')[0]
          if(!d) return
          map[d] = (map[d] || 0) + 1
        })
        rows = Object.keys(map).sort().map(k=>({fecha:k, cantidad: map[k]}))
      }
      setPrestamosSerie(rows || [])
    }catch(err){ console.error(err); mostrarModal({ mensaje: 'Error: '+err.message, tipo: 'error' }) }
    finally{ setLoading(false) }
  }

  const activosData = {
    labels: topActivos.map(a=>a.nombre_activo_jja || a.nombre_jja || a.activo_nombre || a.nombre),
    datasets: [{ label: 'Veces prestado', data: topActivos.map(a=>Number(a.total_prestamos_jja) || Number(a.cantidad) || Number(a.total) || Number(a.prestamos) || 0), backgroundColor: '#7b2fff' }]
  }

  const usuariosData = {
    labels: topUsuarios.map(u=>u.nombre_usuario_jja || u.usuario_jja || u.usuario_nombre || u.nombre || u.cliente_nombre),
    datasets: [{ label: 'Préstamos', data: topUsuarios.map(u=>Number(u.total_prestamos_jja) || Number(u.cantidad) || Number(u.total) || 0), backgroundColor: '#ff6b35' }]
  }

  const tasaData = {
    labels: ['Devueltos','Perdidos','Vencidos'],
    datasets: [{
      data: (() => {
        if(!tasaDev) return [0,0,0]
        const total = Number(tasaDev.total_prestamos_jja) || 0
        if(total > 0){
          const dev = Number(tasaDev.devueltos_jja || tasaDev.devuelto_pct || 0)
          const per = Number(tasaDev.perdidos_jja || tasaDev.perdido_pct || 0)
          const ven = Number(tasaDev.vencidos_jja || tasaDev.vencido_pct || 0)
          return [Math.round((dev/total)*100), Math.round((per/total)*100), Math.round((ven/total)*100)]
        }
        return [Number(tasaDev.devuelto_pct) || 0, Number(tasaDev.perdido_pct) || 0, Number(tasaDev.vencido_pct) || 0]
      })(),
      backgroundColor: ['#34d399','#ef4444','#f59e0b']
    }]
  }

  const prestamosLine = {
    labels: prestamosSerie.map(r=>r.fecha || r.dia || r.label),
    datasets: [{ label: 'Prestamos', data: prestamosSerie.map(r=>Number(r.cantidad) || Number(r.total) || 0), borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.2)', tension:0.2 }]
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3>Reportes</h3>
        <div>
          <Button variant="ghost" onClick={()=>downloadCSV('activos_top.csv', topActivos)}>Exportar Activos</Button>
          <Button variant="ghost" onClick={()=>downloadCSV('usuarios_top.csv', topUsuarios)} style={{marginLeft:8}}>Exportar Usuarios</Button>
        </div>
      </div>

      <Card className="p-16">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div>
            <h4>Top Activos más prestados</h4>
            <Bar data={activosData} />
          </div>
          <div>
            <h4>Top Usuarios</h4>
            <Bar data={usuariosData} />
          </div>
        </div>
      </Card>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
        <Card className="p-16">
          <h4>Tasa de devolución</h4>
          <Doughnut data={tasaData} />
          <div className="muted" style={{marginTop:8}}>Devueltos: {(tasaDev && tasaDev.devuelto_pct) || 0}% • Perdidos: {(tasaDev && tasaDev.perdido_pct) || 0}%</div>
        </Card>

        <Card className="p-16">
          <h4>Préstamos por fecha</h4>
          <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
            <input type="date" value={fechaInicio} onChange={e=>setFechaInicio(e.target.value)} />
            <input type="date" value={fechaFin} onChange={e=>setFechaFin(e.target.value)} />
            <Button onClick={fetchPrestamos} variant="ghost">Filtrar</Button>
          </div>
          <Line data={prestamosLine} />
        </Card>
      </div>
    </div>
  )
}
