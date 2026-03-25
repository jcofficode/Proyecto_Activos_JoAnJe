// ============================================================
// AuditoriaPage_jja.jsx — Log de Auditoría (fix API consumption)
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect } from 'react'
import { apiRequest } from '../../utils/api'
import { useToast_jja } from '../../context/ToastContext_jja'
import DataTable_jja from '../../components/ui_jja/DataTable_jja'
import StatusBadge_jja from '../../components/ui_jja/StatusBadge_jja'

const AuditoriaPage_jja = () => {
  const [registros_jja, setRegistros_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)
  const toast_jja = useToast_jja()

  useEffect(() => { cargarDatos_jja() }, [])

  async function cargarDatos_jja() {
    try {
      const resp = await apiRequest('/auditoria')
      // La API responde { exito, datos, mensaje } — extraer datos correctamente
      const datos = resp?.datos && Array.isArray(resp.datos)
        ? resp.datos
        : Array.isArray(resp) ? resp : []
      setRegistros_jja(datos)
    } catch (err) {
      console.error(err)
      toast_jja.error('Error al cargar los registros de auditoría.')
    }
    finally { setCargando_jja(false) }
  }

  const columnas_jja = [
    { clave: 'id_auditoria_jja', titulo: 'ID', ancho: 60 },
    { clave: 'nombre_tabla_jja', titulo: 'Tabla', render: (v) => <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', background: 'var(--bg-principal-jja)', padding: '2px 6px', borderRadius: 4 }}>{v}</span> },
    {
      clave: 'accion_jja', titulo: 'Acción', render: (v) => {
        const color = v === 'INSERT' ? 'activo' : v === 'UPDATE' ? 'pendiente' : v === 'DELETE' ? 'vencido' : 'info'
        return <StatusBadge_jja estado={color} texto={v} conPunto={false} />
      }
    },
    { clave: 'nombre_usuario', titulo: 'Usuario', render: (v, f) => v || f.usuario_nombre_jja || f.nombre_usuario_jja || `ID ${f.id_usuario_jja || '—'}` },
    { clave: 'descripcion_jja', titulo: 'Descripción', render: (v) => <span style={{ maxWidth: 280, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v || '—'}</span> },
    { clave: 'fecha_jja', titulo: 'Fecha', render: (v) => v ? new Date(v).toLocaleDateString('es-VE') : '—' },
    { clave: 'fecha_jja', titulo: 'Hora', render: (v) => v ? new Date(v).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—' },
  ]

  return (
    <div>
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja">Auditoría</h1>
          <p className="pagina-subtitulo-jja">Registro detallado de todas las operaciones del sistema</p>
        </div>
      </div>

      <DataTable_jja
        columnas={columnas_jja}
        datos={registros_jja}
        cargando={cargando_jja}
        placeholderBusqueda="Buscar por tabla, acción o usuario..."
        porPagina={25}
      />
    </div>
  )
}

export default AuditoriaPage_jja
