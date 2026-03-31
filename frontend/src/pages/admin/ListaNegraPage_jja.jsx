// ============================================================
// ListaNegraPage_jja.jsx — Vista de Lista Negra (Sanciones)
// Administrador y Encargado pueden gestionar usuarios sancionados
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useState, useEffect } from 'react'
import { apiRequest } from '../../utils/api'
import DataTable_jja from '../../components/ui_jja/DataTable_jja'
import StatusBadge_jja from '../../components/ui_jja/StatusBadge_jja'
import KpiCard_jja from '../../components/ui_jja/KpiCard_jja'
import BotonAccion_jja from '../../components/ui_jja/BotonAccion_jja'
import ActionModal_jja from '../../components/ui_jja/ActionModal_jja'
import { useModal_jja } from '../../context/ModalContext_jja'
import {
  IconoSancion_jja, IconoCheck_jja, IconoUsuarios_jja,
  IconoAlertaTriangulo_jja, IconoReloj_jja,
} from '../../components/ui_jja/Iconos_jja'

const ListaNegraPage_jja = () => {
  const { mostrarModal } = useModal_jja()
  const [sanciones_jja, setSanciones_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)
  const [tabActivo_jja, setTabActivo_jja] = useState('activas')
  const [autoSancionando_jja, setAutoSancionando_jja] = useState(false)

  // Modal confirmar levantar sanción
  const [modalLevantar_jja, setModalLevantar_jja] = useState({ visible: false, sancion: null })
  const [levantando_jja, setLevantando_jja] = useState(false)

  // Modal resultado
  const [modalResultado_jja, setModalResultado_jja] = useState({ visible: false, titulo: '', mensaje: '', variante: 'exito' })

  useEffect(() => { cargarSanciones_jja() }, [])

  async function cargarSanciones_jja() {
    setCargando_jja(true)
    try {
      const resp_jja = await apiRequest('/lista-negra')
      const datos_jja = Array.isArray(resp_jja) ? resp_jja : resp_jja?.datos || []
      setSanciones_jja(datos_jja)
    } catch (err_jja) {
      console.error('Error al cargar lista negra:', err_jja)
    } finally {
      setCargando_jja(false)
    }
  }

  // ── Auto-sancionar préstamos vencidos ──
  async function ejecutarAutoSancion_jja() {
    setAutoSancionando_jja(true)
    try {
      const resp_jja = await apiRequest('/lista-negra/auto-sancionar', { method: 'POST' })
      const cantidad_jja = resp_jja?.datos?.sanciones_creadas_jja || 0
      setModalResultado_jja({
        visible: true,
        titulo: cantidad_jja > 0 ? 'Sanciones Aplicadas' : 'Sin Cambios',
        mensaje: cantidad_jja > 0
          ? `Se han creado ${cantidad_jja} sanción(es) automática(s) para usuarios con préstamos vencidos.`
          : 'No se encontraron préstamos vencidos sin sanción. Todo está al día.',
        variante: cantidad_jja > 0 ? 'advertencia' : 'exito'
      })
      cargarSanciones_jja()
    } catch (err_jja) {
      setModalResultado_jja({
        visible: true,
        titulo: 'Error',
        mensaje: 'No se pudo ejecutar la auto-sanción: ' + err_jja.message,
        variante: 'error'
      })
    } finally {
      setAutoSancionando_jja(false)
    }
  }

  // ── Levantar sanción ──
  async function levantarSancion_jja() {
    if (!modalLevantar_jja.sancion) return
    setLevantando_jja(true)
    try {
      await apiRequest(`/lista-negra/${modalLevantar_jja.sancion.id_sancion_jja}/levantar`, {
        method: 'PATCH'
      })
      setModalLevantar_jja({ visible: false, sancion: null })
      setModalResultado_jja({
        visible: true,
        titulo: 'Sanción Levantada',
        mensaje: `La sanción de ${modalLevantar_jja.sancion.usuario_jja} ha sido levantada exitosamente. El usuario puede volver a solicitar préstamos.`,
        variante: 'exito'
      })
      cargarSanciones_jja()
    } catch (err_jja) {
      setModalResultado_jja({
        visible: true,
        titulo: 'Error',
        mensaje: 'No se pudo levantar la sanción: ' + err_jja.message,
        variante: 'error'
      })
    } finally {
      setLevantando_jja(false)
    }
  }

  // ── KPIs ──
  const sancionesActivas_jja = sanciones_jja.filter(s => s.activa_jja === 1 || s.activa_jja === '1')
  const sancionesLevantadas_jja = sanciones_jja.filter(s => s.activa_jja === 0 || s.activa_jja === '0')

  // ── Columnas de la tabla ──
  const columnas_jja = [
    {
      clave: 'usuario_jja',
      titulo: 'Usuario',
      render: (v, f) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: (f.activa_jja === 1 || f.activa_jja === '1')
              ? 'linear-gradient(135deg, #dc2626, #991b1b)'
              : 'linear-gradient(135deg, #64748b, #475569)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
          }}>
            {(v || '??').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{v}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--texto-terciario-jja)' }}>CI: {f.cedula_jja}</div>
          </div>
        </div>
      )
    },
    {
      clave: 'motivo_jja',
      titulo: 'Motivo',
      render: (v) => (
        <span style={{
          maxWidth: 300, display: 'inline-block', overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.88rem'
        }} title={v}>
          {v}
        </span>
      )
    },
    {
      clave: 'fecha_inicio_sancion_jja',
      titulo: 'Fecha Inicio',
      render: (v) => v ? new Date(v).toLocaleDateString('es-VE', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }) : '—'
    },
    {
      clave: 'fecha_fin_sancion_jja',
      titulo: 'Fecha Fin',
      render: (v) => v ? new Date(v).toLocaleDateString('es-VE', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }) : (
        <span style={{ color: '#dc2626', fontWeight: 600, fontSize: '0.82rem' }}>
          ⛔ Indefinida
        </span>
      )
    },
    {
      clave: 'activa_jja',
      titulo: 'Estado',
      render: (v) => {
        const activa = v === 1 || v === '1'
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
            background: activa ? 'rgba(220, 38, 38, 0.12)' : 'rgba(16, 185, 129, 0.12)',
            color: activa ? '#dc2626' : '#10b981',
            border: `1px solid ${activa ? 'rgba(220, 38, 38, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: activa ? '#dc2626' : '#10b981',
              boxShadow: `0 0 6px ${activa ? 'rgba(220, 38, 38, 0.5)' : 'rgba(16, 185, 129, 0.5)'}`
            }} />
            {activa ? 'Sancionado' : 'Levantada'}
          </span>
        )
      }
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      render: (_, f) => {
        const activa = f.activa_jja === 1 || f.activa_jja === '1'
        if (!activa) return <span style={{ color: 'var(--texto-terciario-jja)', fontSize: '0.82rem' }}>—</span>
        return (
          <BotonAccion_jja
            variante="exito"
            size="sm"
            icono={<IconoCheck_jja />}
            onClick={() => setModalLevantar_jja({ visible: true, sancion: f })}
          >
            Levantar
          </BotonAccion_jja>
        )
      }
    },
  ]

  // ── Filtrar según tab ──
  const datosFiltrados_jja = tabActivo_jja === 'activas' ? sancionesActivas_jja
    : tabActivo_jja === 'levantadas' ? sancionesLevantadas_jja
    : sanciones_jja

  const tabs_jja = [
    { clave: 'activas', label: 'Sanciones Activas', count: sancionesActivas_jja.length },
    { clave: 'levantadas', label: 'Levantadas', count: sancionesLevantadas_jja.length },
    { clave: 'todas', label: 'Todas', count: sanciones_jja.length },
  ]

  return (
    <div>
      {/* ── Header ── */}
      <div className="pagina-header-jja">
        <div>
          <h1 className="pagina-titulo-jja" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconoSancion_jja style={{ fontSize: '1.3rem', color: '#dc2626' }} />
            Lista Negra
          </h1>
          <p className="pagina-subtitulo-jja">
            Gestiona los usuarios sancionados por incumplimiento en la devolución de activos
          </p>
        </div>
        <BotonAccion_jja
          variante="advertencia"
          icono={<IconoAlertaTriangulo_jja />}
          onClick={ejecutarAutoSancion_jja}
          cargando={autoSancionando_jja}
        >
          Ejecutar Auto-Sanción
        </BotonAccion_jja>
      </div>

      {/* ── KPIs ── */}
      <div className="kpi-grid-jja" style={{ marginBottom: 24 }}>
        <KpiCard_jja
          icono={<IconoUsuarios_jja />}
          valor={sanciones_jja.length}
          etiqueta="Total Registros"
          color="var(--kpi-1-jja)"
          bgColor="var(--kpi-1-bg-jja)"
        />
        <KpiCard_jja
          icono={<IconoSancion_jja />}
          valor={sancionesActivas_jja.length}
          etiqueta="Sanciones Activas"
          color="#dc2626"
          bgColor="rgba(220, 38, 38, 0.1)"
        />
        <KpiCard_jja
          icono={<IconoCheck_jja />}
          valor={sancionesLevantadas_jja.length}
          etiqueta="Sanciones Levantadas"
          color="#10b981"
          bgColor="rgba(16, 185, 129, 0.1)"
        />
      </div>

      {/* ── Tabs ── */}
      <div className="tabs-jja">
        {tabs_jja.map(t => (
          <button
            key={t.clave}
            className={`tab-btn-jja ${tabActivo_jja === t.clave ? 'activo-jja' : ''}`}
            onClick={() => setTabActivo_jja(t.clave)}
          >
            {t.label}
            {t.count > 0 && (
              <span className="sidebar-item-badge-jja" style={{
                marginLeft: 6,
                background: t.clave === 'activas' ? '#dc2626' : undefined
              }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tabla ── */}
      <DataTable_jja
        columnas={columnas_jja}
        datos={datosFiltrados_jja}
        cargando={cargando_jja}
        placeholderBusqueda="Buscar usuario sancionado..."
      />

      {/* ── Modal confirmar levantar sanción ── */}
      <ActionModal_jja
        visible={modalLevantar_jja.visible}
        titulo="Levantar Sanción"
        onCerrar={() => setModalLevantar_jja({ visible: false, sancion: null })}
        onConfirmar={levantarSancion_jja}
        textoConfirmar="Sí, Levantar Sanción"
        variante="exito"
        cargando={levantando_jja}
        ancho="480px"
      >
        {modalLevantar_jja.sancion && (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.12)', margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <IconoCheck_jja style={{ fontSize: '1.8rem', color: '#10b981' }} />
            </div>
            <p style={{ fontSize: '1rem', marginBottom: 8 }}>
              ¿Deseas levantar la sanción del usuario
              <strong style={{ color: '#dc2626' }}> {modalLevantar_jja.sancion.usuario_jja}</strong>?
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--texto-terciario-jja)', lineHeight: 1.5 }}>
              <strong>Motivo original:</strong> {modalLevantar_jja.sancion.motivo_jja}
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--texto-terciario-jja)', marginTop: 8 }}>
              El usuario podrá volver a solicitar préstamos de activos una vez levantada la sanción.
            </p>
          </div>
        )}
      </ActionModal_jja>

      {/* ── Modal resultado ── */}
      <ActionModal_jja
        visible={modalResultado_jja.visible}
        titulo={modalResultado_jja.titulo}
        variante={modalResultado_jja.variante}
        sinFooter={true}
        onCerrar={() => setModalResultado_jja(prev => ({ ...prev, visible: false }))}
      >
        <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '1.05rem' }}>
          {modalResultado_jja.mensaje}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <button
            className={`btn-jja btn-${modalResultado_jja.variante}-jja`}
            onClick={() => setModalResultado_jja(prev => ({ ...prev, visible: false }))}
            style={{ width: '100%' }}
          >
            Aceptar
          </button>
        </div>
      </ActionModal_jja>
    </div>
  )
}

export default ListaNegraPage_jja
