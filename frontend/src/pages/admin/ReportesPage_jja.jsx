// ============================================================
// ReportesPage_jja.jsx — Reportes y Estadísticas (Premium v2)
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect, useMemo } from 'react'
import { apiRequest } from '../../utils/api'
import { useToast_jja } from '../../context/ToastContext_jja'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import {
  IconoPrestamo_jja, IconoInventario_jja,
  IconoUsuarios_jja, IconoCheck_jja,
  IconoAlertas_jja
} from '../../components/ui_jja/Iconos_jja'
import BotonAccion_jja from '../../components/ui_jja/BotonAccion_jja'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler)

const ReportesPage_jja = () => {
  const [datos_jja, setDatos_jja] = useState({ activos: [], prestamos: [], usuarios: [], sanciones: [] })
  const [cargando_jja, setCargando_jja] = useState(true)
  const toast_jja = useToast_jja()

  useEffect(() => { cargarDatos_jja() }, [])

  async function cargarDatos_jja() {
    try {
      const [a, p, u, s] = await Promise.allSettled([
        apiRequest('/activos'), apiRequest('/prestamos'), apiRequest('/usuarios'), apiRequest('/lista-negra'),
      ])
      setDatos_jja({
        activos: extraer_jja(a), prestamos: extraer_jja(p), usuarios: extraer_jja(u), sanciones: extraer_jja(s),
      })
    } catch (e) {
      console.error(e)
      toast_jja.error('Error al cargar la data.')
    } finally { setCargando_jja(false) }
  }

  function extraer_jja(r) {
    if (r.status !== 'fulfilled') return []
    const d = r.value
    if (d?.datos && Array.isArray(d.datos)) return d.datos
    if (Array.isArray(d)) return d
    return d?.activos || d?.prestamos || []
  }

  const kpis = useMemo(() => {
    const arrActivos = datos_jja.activos || []
    const arrPrestamos = datos_jja.prestamos || []
    const arrUsuarios = datos_jja.usuarios || []
    const arrSanciones = datos_jja.sanciones || []

    const activosDis = arrActivos.filter(a => (a.estado_jja || '').toLowerCase() === 'disponible').length
    const activosPrest = arrActivos.filter(a => ['prestado', 'en_proceso_prestamo'].includes((a.estado_jja || '').toLowerCase())).length
    const activosMant = arrActivos.filter(a => (a.estado_jja || '').toLowerCase() === 'mantenimiento').length
    const activosDanados = arrActivos.filter(a => (a.estado_jja || '').toLowerCase() === 'dañado').length

    const totalPrest = arrPrestamos.length
    const prestActivos = arrPrestamos.filter(p => (p.estado_prestamo_jja || '').toLowerCase() === 'activo').length
    const devueltos = arrPrestamos.filter(p => (p.estado_prestamo_jja || '').toLowerCase() === 'devuelto').length
    const vencidos = arrPrestamos.filter(p => (p.estado_prestamo_jja || '').toLowerCase() === 'vencido').length
    const tasaDev = totalPrest > 0 ? Math.round((devueltos / totalPrest) * 100) : 0

    const totalUsr = arrUsuarios.length
    const hoy = new Date()
    const usrsVencidos = new Set(
      arrPrestamos.filter(p => {
        if ((p.estado_prestamo_jja || '').toLowerCase() !== 'activo') return false
        const limit = new Date(p.fecha_devolucion_jja || p.fecha_limite_jja)
        return limit < hoy
      }).map(p => p.id_usuario_jja)
    ).size

    const sancionesActivas = arrSanciones.filter(s => s.activa_jja === 1 || s.activa_jja === '1').length

    const estadosDic = arrActivos.reduce((acc, a) => {
      acc[a.estado_jja] = (acc[a.estado_jja] || 0) + 1; return acc
    }, {})

    const rolesDic = arrUsuarios.reduce((acc, u) => {
      const r = (u.nombre_rol_jja || '').toLowerCase()
      if (r !== 'empresa') { acc[u.nombre_rol_jja || 'Sin rol'] = (acc[u.nombre_rol_jja || 'Sin rol'] || 0) + 1 }
      return acc
    }, {})

    return {
      activosDis, activosPrest, activosMant, activosDanados,
      totalPrest, prestActivos, devueltos, vencidos, tasaDev,
      totalUsr, usrsVencidos, sancionesActivas, estadosDic, rolesDic,
      totalActivos: arrActivos.length
    }
  }, [datos_jja])

  // ── Excel Premium Export ──
  const exportarDatos_jja = async () => {
    try {
      const workbook = new ExcelJS.Workbook()
      workbook.creator = 'JoAnJe Coders - Sistema de Gestión de Activos'
      workbook.created = new Date()
      workbook.modified = new Date()

      const COLORES = {
        azulOscuro: 'FF0F172A',
        azulCorp: 'FF1E3A8A',
        azulMedio: 'FF3B82F6',
        azulClaro: 'FFDBEAFE',
        grisClaro: 'FFF8FAFC',
        grisLinea: 'FFE2E8F0',
        grisMedio: 'FF94A3B8',
        blanco: 'FFFFFFFF',
        verde: 'FF10B981',
        verdeBg: 'FFECFDF5',
        amarillo: 'FFF59E0B',
        amarilloBg: 'FFFFFBEB',
        rojo: 'FFEF4444',
        rojoBg: 'FFFEF2F2',
        morado: 'FF8B5CF6',
        moradoBg: 'FFF5F3FF',
      }

      // ── Helper: Configura header premium con doble fila ──
      const configurarHoja_jja = (ws, titulo, subtitulo, columnas) => {
        // Fila 1: Título del reporte
        ws.mergeCells(1, 1, 1, columnas.length)
        const tituloCell = ws.getCell('A1')
        tituloCell.value = `📊 ${titulo}`
        tituloCell.font = { bold: true, size: 16, color: { argb: COLORES.blanco }, name: 'Calibri' }
        tituloCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.azulOscuro } }
        tituloCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 }
        ws.getRow(1).height = 40

        // Fila 2: Subtítulo / metadata
        ws.mergeCells(2, 1, 2, columnas.length)
        const subCell = ws.getCell('A2')
        subCell.value = `${subtitulo}  ·  Generado: ${new Date().toLocaleString('es-VE', { dateStyle: 'full', timeStyle: 'short' })}  ·  JoAnJe Coders`
        subCell.font = { size: 10, color: { argb: COLORES.grisMedio }, italic: true, name: 'Calibri' }
        subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.azulOscuro } }
        subCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 }
        ws.getRow(2).height = 24

        // Fila 3: Separador
        ws.getRow(3).height = 6

        // Fila 4: Encabezados de columna
        ws.columns = columnas.map(c => ({ key: c.key, width: c.width }))
        const headerRow = ws.getRow(4)
        columnas.forEach((col, i) => {
          const cell = headerRow.getCell(i + 1)
          cell.value = col.header
          cell.font = { bold: true, size: 11, color: { argb: COLORES.blanco }, name: 'Calibri' }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.azulCorp } }
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
          cell.border = {
            top: { style: 'thin', color: { argb: COLORES.azulMedio } },
            bottom: { style: 'medium', color: { argb: COLORES.azulOscuro } },
            left: { style: 'thin', color: { argb: COLORES.azulMedio } },
            right: { style: 'thin', color: { argb: COLORES.azulMedio } },
          }
        })
        headerRow.height = 30

        return 5 // Fila donde empieza la data
      }

      // ── Helper: Estilo alternado zebra ──
      const aplicarEstiloFilas_jja = (ws, filaInicio, totalFilas, numCols) => {
        for (let i = filaInicio; i < filaInicio + totalFilas; i++) {
          const row = ws.getRow(i)
          const esImpar = (i - filaInicio) % 2 === 0
          row.height = 26
          for (let c = 1; c <= numCols; c++) {
            const cell = row.getCell(c)
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }
            cell.font = { size: 10.5, name: 'Calibri', color: { argb: 'FF334155' } }
            if (esImpar) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.grisClaro } }
            }
            cell.border = {
              bottom: { style: 'hair', color: { argb: COLORES.grisLinea } },
              left: { style: 'hair', color: { argb: COLORES.grisLinea } },
              right: { style: 'hair', color: { argb: COLORES.grisLinea } },
            }
          }
        }
      }

      // ── Helper: Pie de página ──
      const agregarPie_jja = (ws, fila, numCols) => {
        const footerFila = fila + 1
        ws.mergeCells(footerFila, 1, footerFila, numCols)
        const footerCell = ws.getCell(footerFila, 1)
        footerCell.value = `© ${new Date().getFullYear()} JoAnJe Coders — Sistema de Gestión de Activos — Reporte generado automáticamente`
        footerCell.font = { size: 9, color: { argb: COLORES.grisMedio }, italic: true, name: 'Calibri' }
        footerCell.alignment = { vertical: 'middle', horizontal: 'center' }
        footerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.grisClaro } }
        ws.getRow(footerFila).height = 22
      }

      // ═══════════════════════════════════════════
      // HOJA 1: INVENTARIO DE ACTIVOS (completa)
      // ═══════════════════════════════════════════
      const wsActivos = workbook.addWorksheet('Inventario_Activos', { 
        properties: { tabColor: { argb: '10B981' } }
      })
      const colsActivos = [
        { header: 'Cód. Único', key: 'id', width: 16 },
        { header: 'Nombre del Activo', key: 'nombre', width: 42 },
        { header: 'Tipo / Categoría', key: 'tipo', width: 22 },
        { header: 'Ubicación', key: 'ubicacion', width: 28 },
        { header: 'Estado Físico', key: 'estado', width: 22 },
        { header: 'Código QR', key: 'qr', width: 20 },
        { header: 'Fecha de Registro', key: 'fecha', width: 22 },
      ]
      let filaActivo = configurarHoja_jja(wsActivos, 'Inventario Completo de Activos', `Total: ${datos_jja.activos.length} activos registrados`, colsActivos)

      datos_jja.activos.forEach(a => {
        const row = wsActivos.getRow(filaActivo++)
        row.getCell(1).value = `ACT-${String(a.id_activo_jja).padStart(4, '0')}`
        row.getCell(2).value = a.nombre_activo_jja || a.nombre_jja || 'S/N'
        row.getCell(3).value = a.nombre_tipo_jja || a.tipo_activo_jja || 'No definido'
        row.getCell(4).value = a.ubicacion_jja || 'No especificada'
        row.getCell(5).value = (a.estado_jja || 'DESCONOCIDO').toUpperCase()
        row.getCell(6).value = a.codigo_qr_jja || 'N/A'
        row.getCell(7).value = a.creado_en_jja ? new Date(a.creado_en_jja).toLocaleDateString('es-VE') : 'N/A'

        // Colorear estado
        const stCell = row.getCell(5)
        stCell.font = { bold: true, size: 10.5, name: 'Calibri' }
        const est = (a.estado_jja || '').toLowerCase()
        if (est === 'disponible') { stCell.font.color = { argb: COLORES.verde }; stCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.verdeBg } } }
        else if (est === 'prestado') { stCell.font.color = { argb: COLORES.amarillo }; stCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.amarilloBg } } }
        else if (est === 'dañado' || est === 'perdido') { stCell.font.color = { argb: COLORES.rojo }; stCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.rojoBg } } }
        else if (est === 'mantenimiento') { stCell.font.color = { argb: COLORES.morado }; stCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.moradoBg } } }
        stCell.alignment = { vertical: 'middle', horizontal: 'center' }
      })
      aplicarEstiloFilas_jja(wsActivos, 5, datos_jja.activos.length, colsActivos.length)
      agregarPie_jja(wsActivos, filaActivo, colsActivos.length)

      // ═══════════════════════════════════════════
      // HOJA 2: HISTÓRICO DE PRÉSTAMOS (completa)
      // ═══════════════════════════════════════════
      const wsPrestamos = workbook.addWorksheet('Histórico_Préstamos', {
        properties: { tabColor: { argb: '3B82F6' } }
      })
      const colsPrest = [
        { header: 'Folio Operación', key: 'folio', width: 18 },
        { header: 'Solicitante', key: 'solicitante', width: 35 },
        { header: 'Cédula', key: 'cedula', width: 18 },
        { header: 'Rol', key: 'rol', width: 18 },
        { header: 'Activo en Préstamo', key: 'activo', width: 32 },
        { header: 'Estatus del Trámite', key: 'estado', width: 22 },
        { header: 'Fecha de Emisión', key: 'emision', width: 22 },
        { header: 'Fecha Límite', key: 'limite', width: 22 },
        { header: 'Fecha de Devolución', key: 'devolucion', width: 22 },
        { header: 'Observaciones', key: 'observaciones', width: 30 },
      ]
      let filaPrest = configurarHoja_jja(wsPrestamos, 'Histórico Completo de Préstamos', `Total: ${datos_jja.prestamos.length} préstamos registrados`, colsPrest)

      datos_jja.prestamos.forEach(p => {
        const us = datos_jja.usuarios.find(u => u.id_usuario_jja === p.id_usuario_jja)
        const ac = datos_jja.activos.find(a => a.id_activo_jja === p.id_activo_jja)

        const nombreSol = us ? `${us.nombre_jja} ${us.apellido_jja}` : `Usuario ID: ${p.id_usuario_jja}`
        const cedulaSol = us ? us.cedula_jja : 'N/A'
        const rolSol = us ? (us.nombre_rol_jja || '').toUpperCase() : 'N/A'
        const nombreAct = ac ? (ac.nombre_activo_jja || ac.nombre_jja) : `Activo (ID: ${p.id_activo_jja})`

        const row = wsPrestamos.getRow(filaPrest++)
        row.getCell(1).value = `PRE-${String(p.id_prestamo_jja).padStart(5, '0')}`
        row.getCell(2).value = nombreSol
        row.getCell(3).value = cedulaSol
        row.getCell(4).value = rolSol
        row.getCell(5).value = nombreAct
        row.getCell(6).value = (p.estado_prestamo_jja || 'INDEFINIDO').toUpperCase()
        row.getCell(7).value = p.fecha_prestamo_jja ? new Date(p.fecha_prestamo_jja).toLocaleString('es-VE') : 'N/A'
        row.getCell(8).value = p.fecha_limite_jja ? new Date(p.fecha_limite_jja).toLocaleString('es-VE') : 'N/A'
        row.getCell(9).value = p.fecha_devolucion_jja ? new Date(p.fecha_devolucion_jja).toLocaleString('es-VE') : 'En curso'
        row.getCell(10).value = p.observaciones_jja || '—'

        // Colorear estado
        const stCell = row.getCell(6)
        stCell.font = { bold: true, size: 10.5, name: 'Calibri' }
        stCell.alignment = { vertical: 'middle', horizontal: 'center' }
        const est = (p.estado_prestamo_jja || '').toLowerCase()
        if (est === 'activo') { stCell.font.color = { argb: COLORES.azulMedio }; stCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.azulClaro } } }
        else if (est === 'devuelto') { stCell.font.color = { argb: COLORES.verde }; stCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.verdeBg } } }
        else if (est === 'vencido') { stCell.font.color = { argb: COLORES.rojo }; stCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.rojoBg } } }
      })
      aplicarEstiloFilas_jja(wsPrestamos, 5, datos_jja.prestamos.length, colsPrest.length)
      agregarPie_jja(wsPrestamos, filaPrest, colsPrest.length)

      // ═══════════════════════════════════════════
      // HOJA 3: DIRECTORIO DE USUARIOS (completa)
      // ═══════════════════════════════════════════
      const wsUsuarios = workbook.addWorksheet('Directorio_Usuarios', {
        properties: { tabColor: { argb: '8B5CF6' } }
      })
      const colsUsr = [
        { header: 'Folio', key: 'id', width: 14 },
        { header: 'Nombre Completo', key: 'nombre', width: 38 },
        { header: 'Cédula de Identidad', key: 'cedula', width: 24 },
        { header: 'Correo Electrónico', key: 'correo', width: 35 },
        { header: 'Teléfono', key: 'telefono', width: 20 },
        { header: 'Nivel Administrativo', key: 'rol', width: 24 },
        { header: 'Estado', key: 'estado', width: 16 },
        { header: 'Fecha de Registro', key: 'fecha', width: 22 },
      ]
      let filaUsr = configurarHoja_jja(wsUsuarios, 'Directorio Completo de Usuarios', `Total: ${datos_jja.usuarios.length} usuarios registrados`, colsUsr)

      datos_jja.usuarios.forEach(u => {
        const row = wsUsuarios.getRow(filaUsr++)
        row.getCell(1).value = `USR-${String(u.id_usuario_jja).padStart(4, '0')}`
        row.getCell(2).value = `${u.nombre_jja} ${u.apellido_jja}`
        row.getCell(3).value = u.cedula_jja || 'N/A'
        row.getCell(4).value = u.correo_jja || 'N/A'
        row.getCell(5).value = u.telefono_jja || 'N/A'
        row.getCell(6).value = u.nombre_rol_jja ? u.nombre_rol_jja.toUpperCase() : 'NO DEFINIDO'
        row.getCell(7).value = u.estado_registro_jja === 1 || u.estado_registro_jja === '1' ? 'ACTIVO' : 'INACTIVO'
        row.getCell(8).value = u.creado_en_jja ? new Date(u.creado_en_jja).toLocaleDateString('es-VE') : 'N/A'

        // Colorear estado
        const stCell = row.getCell(7)
        stCell.font = { bold: true, size: 10.5, name: 'Calibri' }
        stCell.alignment = { vertical: 'middle', horizontal: 'center' }
        if (stCell.value === 'ACTIVO') { stCell.font.color = { argb: COLORES.verde }; stCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.verdeBg } } }
        else { stCell.font.color = { argb: COLORES.rojo }; stCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.rojoBg } } }

        // Colorear rol
        const rolCell = row.getCell(6)
        rolCell.font = { bold: true, size: 10.5, name: 'Calibri' }
        rolCell.alignment = { vertical: 'middle', horizontal: 'center' }
        const rol = (u.nombre_rol_jja || '').toLowerCase()
        if (rol === 'administrador') { rolCell.font.color = { argb: COLORES.morado }; rolCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.moradoBg } } }
        else if (rol === 'encargado') { rolCell.font.color = { argb: COLORES.azulMedio }; rolCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.azulClaro } } }
        else if (rol === 'cliente') { rolCell.font.color = { argb: COLORES.amarillo }; rolCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORES.amarilloBg } } }
      })
      aplicarEstiloFilas_jja(wsUsuarios, 5, datos_jja.usuarios.length, colsUsr.length)
      agregarPie_jja(wsUsuarios, filaUsr, colsUsr.length)

      // ═══════════════════════════════════════════
      // HOJA 4: RESUMEN EJECUTIVO (Dashboard)
      // ═══════════════════════════════════════════
      const wsResumen = workbook.addWorksheet('Resumen_Ejecutivo', {
        properties: { tabColor: { argb: 'F59E0B' } }
      })
      const colsResumen = [
        { header: 'Indicador', key: 'indicador', width: 40 },
        { header: 'Valor', key: 'valor', width: 20 },
        { header: 'Observación', key: 'observacion', width: 50 },
      ]
      const filaRes = configurarHoja_jja(wsResumen, 'Resumen Ejecutivo del Sistema', 'Indicadores clave de rendimiento (KPIs)', colsResumen)

      const datosResumen = [
        ['📦 Total de Activos Registrados', kpis.totalActivos, 'Inventario completo del sistema'],
        ['✅ Activos Disponibles', kpis.activosDis, 'Listos para ser prestados'],
        ['🔄 Activos en Préstamo', kpis.activosPrest, 'Actualmente prestados a usuarios'],
        ['🔧 Activos en Mantenimiento', kpis.activosMant, 'En proceso de reparación o revisión'],
        ['⚠️ Activos Dañados', kpis.activosDanados, 'Requieren atención inmediata'],
        ['', '', ''],
        ['📋 Total de Préstamos Históricos', kpis.totalPrest, 'Desde el inicio del sistema'],
        ['🟢 Préstamos Activos', kpis.prestActivos, 'Actualmente en curso'],
        ['✅ Préstamos Devueltos', kpis.devueltos, 'Completados exitosamente'],
        ['🔴 Préstamos Vencidos', kpis.vencidos, 'Pasaron la fecha límite'],
        ['📊 Tasa de Devolución', `${kpis.tasaDev}%`, kpis.tasaDev >= 80 ? 'Excelente rendimiento' : kpis.tasaDev >= 50 ? 'Rendimiento aceptable' : 'Necesita mejora'],
        ['', '', ''],
        ['👥 Total de Usuarios', kpis.totalUsr, 'Usuarios registrados en el sistema'],
        ['🚫 Usuarios Sancionables', kpis.usrsVencidos, 'Con préstamos vencidos'],
        ['⛔ Sanciones Activas', kpis.sancionesActivas, 'Usuarios en lista negra'],
      ]

      datosResumen.forEach((row, i) => {
        const r = wsResumen.getRow(filaRes + i)
        r.getCell(1).value = row[0]
        r.getCell(2).value = row[1]
        r.getCell(3).value = row[2]
        r.height = row[0] === '' ? 10 : 28

        if (row[0]) {
          r.getCell(1).font = { bold: true, size: 11, name: 'Calibri', color: { argb: 'FF1E293B' } }
          r.getCell(2).font = { bold: true, size: 12, name: 'Calibri', color: { argb: COLORES.azulCorp } }
          r.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' }
          r.getCell(3).font = { size: 10, name: 'Calibri', color: { argb: COLORES.grisMedio }, italic: true }
        }
      })
      aplicarEstiloFilas_jja(wsResumen, filaRes, datosResumen.length, colsResumen.length)
      agregarPie_jja(wsResumen, filaRes + datosResumen.length, colsResumen.length)

      // ── Exportar ──
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      saveAs(blob, `Reporte_JoAnJe_${new Date().toISOString().split('T')[0]}.xlsx`)

      toast_jja.exito('Reporte Excel profesional generado exitosamente.')
    } catch (e) {
      console.error(e)
      toast_jja.error('Error al generar el archivo Excel.')
    }
  }

  // ── Chart configs ──
  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a', titleColor: '#fff', bodyColor: '#e2e8f0',
        borderColor: '#334155', borderWidth: 1, padding: 14, cornerRadius: 10,
        displayColors: true, titleFont: { weight: '700', size: 13 },
        bodyFont: { size: 12 },
      }
    },
    scales: {
      y: {
        beginAtZero: true, grid: { color: 'rgba(148,163,184,0.1)', drawBorder: false },
        ticks: { stepSize: 1, color: '#94a3b8', font: { family: 'Inter, sans-serif', weight: '500' }, padding: 8 },
        border: { display: false }
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#475569', font: { family: 'Inter, sans-serif', weight: '600', size: 12 }, padding: 8 },
        border: { display: false }
      }
    }
  }

  const doughnutOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20, usePointStyle: true, pointStyle: 'circle',
          color: '#475569', font: { family: 'Inter, sans-serif', size: 12, weight: '500' }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a', titleColor: '#fff', bodyColor: '#e2e8f0',
        borderColor: '#334155', borderWidth: 1, padding: 14, cornerRadius: 10,
      }
    },
    cutout: '72%',
  }

  const colors = { disponible: '#22c55e', prestado: '#3b82f6', mantenimiento: '#8b5cf6', dañado: '#ef4444', perdido: '#94a3b8', en_proceso_prestamo: '#f59e0b' }
  const edoLabels = Object.keys(kpis.estadosDic)
  const edoData = Object.values(kpis.estadosDic)
  const edoColors = edoLabels.map(e => colors[e] || '#cbd5e1')

  const rolesColors = { 'Administrador': '#8b5cf6', 'Encargado': '#3b82f6', 'Cliente': '#f59e0b' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn_jja 0.4s ease-out' }}>
      <style>{`
        @keyframes fadeIn_jja { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse_jja { 0% { transform: scale(1); } 50% { transform: scale(1.06); } 100% { transform: scale(1); } }
        @keyframes countUp_jja { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .kpi-card-jja { animation: fadeIn_jja 0.5s cubic-bezier(0.4, 0, 0.2, 1) both; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; }
        .kpi-card-jja::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 16px 16px 0 0; background: var(--accent-color); opacity: 0; transition: opacity 0.3s; }
        .kpi-card-jja:hover { transform: translateY(-4px); box-shadow: 0 16px 40px -12px rgba(0,0,0,0.12); }
        .kpi-card-jja:hover::before { opacity: 1; }
        .kpi-card-jja:nth-child(1) { animation-delay: 0.05s; --accent-color: #22c55e; }
        .kpi-card-jja:nth-child(2) { animation-delay: 0.1s; --accent-color: #3b82f6; }
        .kpi-card-jja:nth-child(3) { animation-delay: 0.15s; --accent-color: #8b5cf6; }
        .kpi-card-jja:nth-child(4) { animation-delay: 0.2s; --accent-color: #ef4444; }
        .chart-card-jja { transition: all 0.3s ease; }
        .chart-card-jja:hover { transform: translateY(-3px); box-shadow: 0 16px 40px -12px rgba(0,0,0,0.1); }
        .export-btn-jja { background: linear-gradient(135deg, #0f172a, #1e293b); color: #fff; border: none; border-radius: 12px; padding: 12px 24px; font-weight: 700; display: flex; align-items: center; gap: 10px; transition: all 0.3s; cursor: pointer; font-size: 0.92rem; font-family: inherit; letter-spacing: 0.01em; }
        .export-btn-jja:hover { transform: translateY(-2px); box-shadow: 0 8px 24px -4px rgba(15,23,42,0.4); background: linear-gradient(135deg, #1e293b, #334155); }
        .export-btn-jja:active { transform: scale(0.97); }
      `}</style>

      {/* ── Header Premium ── */}
      <div style={estilos.headerLayout}>
        <div>
          <h1 style={{
            fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0',
            letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 12
          }}>
            <span style={{
              width: 8, height: 28, background: 'linear-gradient(180deg, #3b82f6, #6366f1)',
              borderRadius: 4
            }}></span>
            Centro de Reportes
          </h1>
          <p style={{
            fontSize: '0.95rem', color: '#64748b', margin: 0, paddingLeft: 20,
            fontWeight: 400
          }}>
            Visualización analítica y exportación inteligente del inventario
          </p>
        </div>
        <button className="export-btn-jja" onClick={exportarDatos_jja}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Exportar Reporte (.xlsx)
        </button>
      </div>

      {cargando_jja ? (
        <div style={estilos.loadingBox}>
          <div style={{
            width: 40, height: 40, border: '3.5px solid #f1f5f9', borderTopColor: '#3b82f6',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 16
          }}></div>
          <span style={{ color: '#64748b', fontWeight: 600, fontSize: '0.95rem' }}>Cargando analíticas...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          {/* ── KPIs Superiores ── */}
          <div style={estilos.kpiContainer}>
            {[
              { icon: <IconoInventario_jja size={22} />, label: 'Activos Disponibles', value: kpis.activosDis, color: '#22c55e', bg: '#f0fdf4' },
              { icon: <IconoPrestamo_jja size={22} />, label: 'En Préstamo', value: kpis.activosPrest, color: '#3b82f6', bg: '#eff6ff' },
              { icon: <IconoUsuarios_jja size={22} />, label: 'Total Usuarios', value: kpis.totalUsr, color: '#8b5cf6', bg: '#f5f3ff' },
              { icon: <IconoAlertas_jja size={22} />, label: 'Sancionables', value: kpis.usrsVencidos, color: '#ef4444', bg: '#fef2f2', alert: kpis.usrsVencidos > 0 },
            ].map((kpi, i) => (
              <div key={i} className="kpi-card-jja" style={{
                ...estilos.kpiBox,
                border: kpi.alert ? '1px solid #fca5a5' : '1px solid #f1f5f9',
              }}>
                <div style={{ ...estilos.kpiIcon, color: kpi.color, background: kpi.bg }}>
                  {kpi.icon}
                </div>
                <div style={estilos.kpiContent}>
                  <div style={estilos.kpiLabel}>{kpi.label}</div>
                  <div style={{
                    ...estilos.kpiValue,
                    color: kpi.alert ? '#ef4444' : '#0f172a',
                    animation: 'countUp_jja 0.6s ease-out'
                  }}>{kpi.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Fila Métricas + Gráfico Barras ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'stretch' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Total Préstamos */}
              <div className="chart-card-jja" style={{
                ...estilos.cardBox, flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', position: 'relative', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', top: -20, right: -20, width: 100, height: 100,
                  borderRadius: '50%', background: 'rgba(59,130,246,0.06)'
                }}></div>
                <div style={{
                  fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em'
                }}>Total Préstamos Históricos</div>
                <div style={{
                  fontSize: '3.8rem', fontWeight: 800, color: '#0f172a',
                  lineHeight: 1, marginTop: 12, letterSpacing: '-0.04em',
                  animation: 'countUp_jja 0.6s ease-out'
                }}>{kpis.totalPrest}</div>
              </div>

              {/* Tasa Devolución */}
              <div className="chart-card-jja" style={{
                ...estilos.cardBox, flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                borderColor: '#334155', color: '#fff', position: 'relative', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', top: -30, right: -30, width: 120, height: 120,
                  borderRadius: '50%', background: 'rgba(34,197,94,0.08)'
                }}></div>
                <div style={{
                  fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em'
                }}>Tasa de Devolución</div>
                <div style={{
                  fontSize: '3.8rem', fontWeight: 800, color: '#fff',
                  lineHeight: 1, marginTop: 12, display: 'flex', alignItems: 'center',
                  gap: 12, letterSpacing: '-0.04em'
                }}>
                  {kpis.tasaDev}%
                  <span style={{
                    color: kpis.tasaDev >= 70 ? '#22c55e' : '#f59e0b',
                    animation: 'pulse_jja 2s infinite'
                  }}>
                    <IconoCheck_jja size={36} />
                  </span>
                </div>
              </div>
            </div>

            {/* Gráfico Barras */}
            <div className="chart-card-jja" style={estilos.cardBox}>
              <div style={estilos.cardHeader}>
                <h3 style={estilos.cardTitle}>Estado General Circulante</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                  Distribución de préstamos por estado
                </p>
              </div>
              <div style={{ height: 280, width: '100%', padding: '10px 0' }}>
                <Bar
                  data={{
                    labels: ['Activos', 'Devueltos', 'Vencidos'],
                    datasets: [{
                      label: 'Préstamos',
                      data: [kpis.prestActivos, kpis.devueltos, kpis.vencidos],
                      backgroundColor: ['rgba(59,130,246,0.85)', 'rgba(34,197,94,0.85)', 'rgba(239,68,68,0.85)'],
                      hoverBackgroundColor: ['#2563eb', '#16a34a', '#dc2626'],
                      borderRadius: 8, maxBarThickness: 50,
                      borderSkipped: false,
                    }]
                  }}
                  options={chartOptions}
                />
              </div>
            </div>
          </div>

          {/* ── Fila Donut + Roles ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'stretch' }}>
            {/* Distribución físico */}
            <div className="chart-card-jja" style={estilos.cardBox}>
              <div style={estilos.cardHeader}>
                <h3 style={estilos.cardTitle}>Inventario Físico</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>Distribución por estado actual</p>
              </div>
              <div style={{ height: 260, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {edoLabels.length > 0 ? (
                  <Doughnut
                    data={{
                      labels: edoLabels.map(e => e.charAt(0).toUpperCase() + e.slice(1).replace(/_/g, ' ')),
                      datasets: [{ data: edoData, backgroundColor: edoColors, borderWidth: 0, hoverOffset: 8 }]
                    }}
                    options={doughnutOptions}
                  />
                ) : <div style={{ color: '#94a3b8', fontWeight: 500 }}>Sin datos disponibles</div>}
              </div>
            </div>

            {/* Demografía */}
            <div className="chart-card-jja" style={estilos.cardBox}>
              <div style={estilos.cardHeader}>
                <h3 style={estilos.cardTitle}>Demografía de Usuarios</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>Distribución por nivel administrativo</p>
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: 16, marginTop: 16
              }}>
                {Object.entries(kpis.rolesDic).map(([rol, count]) => (
                  <div key={rol} className="chart-card-jja" style={{
                    background: `linear-gradient(135deg, ${(rolesColors[rol] || '#94a3b8')}08, ${(rolesColors[rol] || '#94a3b8')}15)`,
                    padding: '28px 16px', borderRadius: 14,
                    border: `1px solid ${(rolesColors[rol] || '#94a3b8')}20`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    position: 'relative', overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute', top: -8, right: -8, width: 50, height: 50,
                      borderRadius: '50%', background: `${(rolesColors[rol] || '#94a3b8')}10`
                    }}></div>
                    <div style={{
                      fontSize: '2.4rem', fontWeight: 800, color: rolesColors[rol] || '#475569',
                      lineHeight: 1, animation: 'countUp_jja 0.6s ease-out'
                    }}>{count}</div>
                    <div style={{
                      fontSize: '0.82rem', color: '#64748b', textTransform: 'capitalize',
                      fontWeight: 600, marginTop: 10
                    }}>{rol}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const estilos = {
  headerLayout: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: '#fff', padding: '28px 32px', borderRadius: 16,
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  kpiContainer: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20,
  },
  kpiBox: {
    background: '#fff', borderRadius: 16, padding: '24px 28px',
    display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16,
    boxSizing: 'border-box',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  kpiIcon: {
    width: 48, height: 48, borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  kpiContent: { flex: 1, minWidth: 100 },
  kpiLabel: { fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, letterSpacing: '0.01em' },
  kpiValue: { fontSize: '1.8rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em' },
  cardBox: {
    background: '#fff', borderRadius: 16, padding: '28px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  cardHeader: { marginBottom: 24 },
  cardTitle: {
    fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0,
    letterSpacing: '-0.02em'
  },
  loadingBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    height: 360, width: '100%', background: '#fff', borderRadius: 16,
    border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  }
}

export default ReportesPage_jja
