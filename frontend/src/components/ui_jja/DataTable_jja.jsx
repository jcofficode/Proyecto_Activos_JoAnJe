// ============================================================
// DataTable_jja.jsx — Tabla de datos con búsqueda y paginación
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useMemo } from 'react'
import { IconoBuscar_jja, IconoChevronIzq_jja, IconoChevronDer_jja } from './Iconos_jja'

const DataTable_jja = ({
  columnas = [],         // [{clave, titulo, render?, ancho?}]
  datos = [],
  busqueda = true,
  placeholderBusqueda = 'Buscar...',
  porPagina: porPaginaInicial = 10,
  acciones,              // Componente/función para renderizar acciones: (fila) => JSX
  emptyTexto = 'No se encontraron registros',
  cargando = false,
  titulo,
  contador = true,
}) => {
  const [buscar_jja, setBuscar_jja] = useState('')
  const [pagina_jja, setPagina_jja] = useState(1)
  const [porPagina_jja, setPorPagina_jja] = useState(porPaginaInicial)

  // Filtrar datos por búsqueda
  const datosFiltrados_jja = useMemo(() => {
    if (!buscar_jja.trim()) return datos
    const termino = buscar_jja.toLowerCase()
    return datos.filter(fila =>
      columnas.some(col => {
        const val = fila[col.clave]
        return val != null && String(val).toLowerCase().includes(termino)
      })
    )
  }, [datos, buscar_jja, columnas])

  // Paginación
  const totalPaginas = Math.ceil(datosFiltrados_jja.length / porPagina_jja) || 1
  const paginaActual = Math.min(pagina_jja, totalPaginas)
  const inicio = (paginaActual - 1) * porPagina_jja
  const datosPagina = datosFiltrados_jja.slice(inicio, inicio + porPagina_jja)

  // Generar números de página visibles
  const paginas_jja = useMemo(() => {
    const paginas = []
    const maxVisible = 5
    let inicioP = Math.max(1, paginaActual - Math.floor(maxVisible / 2))
    let finP = Math.min(totalPaginas, inicioP + maxVisible - 1)
    inicioP = Math.max(1, finP - maxVisible + 1)
    for (let i = inicioP; i <= finP; i++) paginas.push(i)
    return paginas
  }, [paginaActual, totalPaginas])

  // Reset página al cambiar búsqueda
  const handleBuscar = (e) => {
    setBuscar_jja(e.target.value)
    setPagina_jja(1)
  }

  return (
    <div className="datatable-wrapper-jja">
      {/* Toolbar */}
      <div className="datatable-toolbar-jja">
        {busqueda && (
          <div className="datatable-buscar-jja">
            <span className="datatable-buscar-icono-jja"><IconoBuscar_jja /></span>
            <input
              type="text"
              value={buscar_jja}
              onChange={handleBuscar}
              placeholder={placeholderBusqueda}
            />
          </div>
        )}
        {contador && (
          <span className="datatable-contador-jja">
            {datosFiltrados_jja.length} registro{datosFiltrados_jja.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Tabla */}
      <div style={{ overflowX: 'auto' }}>
        <table className="datatable-jja">
          <thead>
            <tr>
              <th style={{ width: 50 }}>#</th>
              {columnas.map(col => (
                <th key={col.clave} style={col.ancho ? { width: col.ancho } : undefined}>
                  {col.titulo}
                </th>
              ))}
              {acciones && <th style={{ width: 120 }}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              // Filas skeleton de carga
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`sk-${i}`}>
                  <td><div className="skeleton-jja" style={{ height: 16, width: 24 }} /></td>
                  {columnas.map(col => (
                    <td key={col.clave}><div className="skeleton-jja" style={{ height: 16, width: '70%' }} /></td>
                  ))}
                  {acciones && <td><div className="skeleton-jja" style={{ height: 16, width: 60 }} /></td>}
                </tr>
              ))
            ) : datosPagina.length === 0 ? (
              <tr>
                <td colSpan={columnas.length + (acciones ? 2 : 1)} style={{ textAlign: 'center', padding: 32, color: 'var(--texto-terciario-jja)' }}>
                  {emptyTexto}
                </td>
              </tr>
            ) : (
              datosPagina.map((fila, idx) => (
                <tr key={fila.id_solicitud_jja || fila.id_solicitud_devolucion_jja || fila.id || fila.id_usuario_jja || `row-${inicio}-${idx}`}>
                  <td style={{ color: 'var(--texto-terciario-jja)', fontWeight: 500 }}>{inicio + idx + 1}</td>
                  {columnas.map(col => (
                    <td key={col.clave}>
                      {col.render ? col.render(fila[col.clave], fila) : fila[col.clave] ?? '—'}
                    </td>
                  ))}
                  {acciones && (
                    <td>
                      <div className="datatable-acciones-jja">
                        {acciones(fila)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {!cargando && datosFiltrados_jja.length > 0 && (
        <div className="datatable-paginar-jja">
          <div className="datatable-paginar-info-jja">
            Mostrando {inicio + 1}–{Math.min(inicio + porPagina_jja, datosFiltrados_jja.length)} de {datosFiltrados_jja.length}
          </div>
          <div className="datatable-paginar-botones-jja">
            <button
              className="datatable-paginar-btn-jja"
              onClick={() => setPagina_jja(p => Math.max(1, p - 1))}
              disabled={paginaActual === 1}
            >
              <IconoChevronIzq_jja />
            </button>
            {paginas_jja.map(p => (
              <button
                key={p}
                className={`datatable-paginar-btn-jja ${p === paginaActual ? 'activo-jja' : ''}`}
                onClick={() => setPagina_jja(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="datatable-paginar-btn-jja"
              onClick={() => setPagina_jja(p => Math.min(totalPaginas, p + 1))}
              disabled={paginaActual === totalPaginas}
            >
              <IconoChevronDer_jja />
            </button>
          </div>
          <div className="datatable-por-pagina-jja">
            <span>Mostrar</span>
            <select value={porPagina_jja} onChange={(e) => { setPorPagina_jja(Number(e.target.value)); setPagina_jja(1) }}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>por página</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable_jja
