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
import FormGroup_jja from '../../components/ui_jja/FormGroup_jja'
import { useModal_jja } from '../../context/ModalContext_jja'
import {
  IconoSancion_jja, IconoCheck_jja, IconoUsuarios_jja,
  IconoAlertaTriangulo_jja, IconoReloj_jja,
} from '../../components/ui_jja/Iconos_jja'

const API_BASE_JJA = 'http://localhost:8000'

const ListaNegraPage_jja = () => {
  const { mostrarModal } = useModal_jja()
  const [sanciones_jja, setSanciones_jja] = useState([])
  const [cargando_jja, setCargando_jja] = useState(true)
  const [tabActivo_jja, setTabActivo_jja] = useState('activas')
  const [autoSancionando_jja, setAutoSancionando_jja] = useState(false)

  // Modal confirmar levantar sanción
  const [modalLevantar_jja, setModalLevantar_jja] = useState({ visible: false, sancion: null })
  const [motivoLevantar_jja, setMotivoLevantar_jja] = useState('')
  const [levantando_jja, setLevantando_jja] = useState(false)

  // Modal agregar sanción manual
  const [modalAgregar_jja, setModalAgregar_jja] = useState(false)
  const [usuarios_jja, setUsuarios_jja] = useState([])
  const [cargandoUsuarios_jja, setCargandoUsuarios_jja] = useState(false)
  const [formSancion_jja, setFormSancion_jja] = useState({
    id_usuario: '',
    motivo: '',
    dias_sancion: 0, // 0 = indefinida
  })
  const [creandoSancion_jja, setCreandoSancion_jja] = useState(false)

  // Modal resultado
  const [modalResultado_jja, setModalResultado_jja] = useState({ visible: false, titulo: '', mensaje: '', variante: 'exito' })

  useEffect(() => {
    ejecutarAutoSancionSilenciosa_jja()
  }, [])

  // ── Auto-sanción silenciosa al cargar la página ──
  async function ejecutarAutoSancionSilenciosa_jja() {
    try {
      await apiRequest('/lista-negra/auto-sancionar', { method: 'POST' })
    } catch (err_jja) {
      console.warn('Auto-sanción silenciosa falló:', err_jja)
    } finally {
      cargarSanciones_jja()
    }
  }

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

  // ── Cargar usuarios para el select ──
  async function cargarUsuarios_jja() {
    setCargandoUsuarios_jja(true)
    try {
      const resp_jja = await apiRequest('/usuarios')
      const datos_jja = Array.isArray(resp_jja) ? resp_jja : resp_jja?.datos || []
      // Filtrar solo clientes (rol_id 3 = cliente)
      const clientes_jja = datos_jja.filter(u =>
        u.nombre_rol_jja === 'cliente' || u.id_rol_jja === 3 || u.id_rol_jja === '3'
      )
      setUsuarios_jja(clientes_jja)
    } catch (err_jja) {
      console.error('Error al cargar usuarios:', err_jja)
    } finally {
      setCargandoUsuarios_jja(false)
    }
  }

  // ── Abrir modal agregar sanción ──
  function abrirModalAgregar_jja() {
    setFormSancion_jja({ id_usuario: '', motivo: '', dias_sancion: 0 })
    setModalAgregar_jja(true)
    cargarUsuarios_jja()
  }

  // ── Crear sanción manual ──
  async function crearSancionManual_jja() {
    if (!formSancion_jja.id_usuario || !formSancion_jja.motivo.trim()) {
      mostrarModal({ mensaje: 'Debes seleccionar un usuario y escribir un motivo.', tipo: 'error' })
      return
    }
    setCreandoSancion_jja(true)
    try {
      await apiRequest('/lista-negra', {
        method: 'POST',
        body: JSON.stringify({
          id_usuario: parseInt(formSancion_jja.id_usuario),
          motivo: formSancion_jja.motivo.trim(),
          dias_sancion: parseInt(formSancion_jja.dias_sancion) || 0,
        })
      })
      setModalAgregar_jja(false)
      setModalResultado_jja({
        visible: true,
        titulo: 'Sanción Aplicada',
        mensaje: 'El usuario ha sido añadido a la lista negra exitosamente. No podrá solicitar préstamos mientras la sanción esté activa.',
        variante: 'advertencia'
      })
      cargarSanciones_jja()
    } catch (err_jja) {
      setModalResultado_jja({
        visible: true,
        titulo: 'Error',
        mensaje: 'No se pudo crear la sanción: ' + err_jja.message,
        variante: 'error'
      })
    } finally {
      setCreandoSancion_jja(false)
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
    if (!motivoLevantar_jja.trim()) {
      mostrarModal({ mensaje: 'Debes escribir un motivo para levantar la sanción.', tipo: 'error' })
      return
    }
    setLevantando_jja(true)
    try {
      await apiRequest(`/lista-negra/${modalLevantar_jja.sancion.id_sancion_jja}/levantar`, {
        method: 'PATCH',
        body: JSON.stringify({ motivo: motivoLevantar_jja.trim() })
      })
      setModalLevantar_jja({ visible: false, sancion: null })
      setMotivoLevantar_jja('')
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
      render: (v, f) => {
        const imgUrl_jja = f.imagen_usuario_jja ? `${API_BASE_JJA}${f.imagen_usuario_jja}` : null
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {imgUrl_jja ? (
              <img
                src={imgUrl_jja}
                alt={v}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  objectFit: 'cover', flexShrink: 0,
                  border: (f.activa_jja === 1 || f.activa_jja === '1')
                    ? '2px solid #dc2626'
                    : '2px solid var(--borde-jja)',
                }}
              />
            ) : (
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
            )}
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{v}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--texto-terciario-jja)' }}>CI: {f.cedula_jja}</div>
            </div>
          </div>
        )
      }
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
            onClick={() => {
              setMotivoLevantar_jja('')
              setModalLevantar_jja({ visible: true, sancion: f })
            }}
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
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <BotonAccion_jja
            variante="error"
            icono={<IconoSancion_jja />}
            onClick={abrirModalAgregar_jja}
          >
            Agregar a Lista Negra
          </BotonAccion_jja>
          <BotonAccion_jja
            variante="advertencia"
            icono={<IconoAlertaTriangulo_jja />}
            onClick={ejecutarAutoSancion_jja}
            cargando={autoSancionando_jja}
          >
            Ejecutar Auto-Sanción
          </BotonAccion_jja>
        </div>
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

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── Modal: Agregar Sanción Manual ── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <ActionModal_jja
        visible={modalAgregar_jja}
        titulo="Agregar Usuario a Lista Negra"
        onCerrar={() => setModalAgregar_jja(false)}
        onConfirmar={crearSancionManual_jja}
        textoConfirmar="Aplicar Sanción"
        variante="error"
        cargando={creandoSancion_jja}
        ancho="520px"
      >
        <div style={{ padding: '4px 0' }}>
          {/* Alerta informativa */}
          <div style={{
            background: 'rgba(220, 38, 38, 0.08)',
            border: '1px solid rgba(220, 38, 38, 0.2)',
            borderRadius: 'var(--border-radius-sm-jja, 10px)',
            padding: '12px 16px',
            marginBottom: 20,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <IconoAlertaTriangulo_jja style={{ fontSize: '1.1rem', color: '#dc2626', flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: '0.82rem', color: '#dc2626', margin: 0, lineHeight: 1.5 }}>
              Al sancionar un usuario, este <strong>no podrá solicitar préstamos</strong> de activos mientras la sanción esté activa.
            </p>
          </div>

          {/* Select de usuario */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block', marginBottom: 6, fontWeight: 600,
              fontSize: '0.88rem', color: 'var(--texto-principal-jja)'
            }}>
              Usuario a sancionar <span style={{ color: '#dc2626' }}>*</span>
            </label>
            {cargandoUsuarios_jja ? (
              <div style={{
                padding: '10px 14px', borderRadius: 'var(--border-radius-sm-jja, 10px)',
                background: 'var(--bg-principal-jja)', border: '1px solid var(--borde-jja)',
                color: 'var(--texto-terciario-jja)', fontSize: '0.88rem'
              }}>
                Cargando usuarios...
              </div>
            ) : (
              <select
                value={formSancion_jja.id_usuario}
                onChange={(e) => setFormSancion_jja(prev => ({ ...prev, id_usuario: e.target.value }))}
                style={{
                  width: '100%', padding: '10px 14px',
                  borderRadius: 'var(--border-radius-sm-jja, 10px)',
                  border: '1px solid var(--borde-jja)',
                  background: 'var(--bg-tarjeta-jja)',
                  color: 'var(--texto-principal-jja)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  appearance: 'auto',
                }}
              >
                <option value="">— Seleccionar usuario —</option>
                {usuarios_jja.map(u => (
                  <option key={u.id_usuario_jja} value={u.id_usuario_jja}>
                    {u.nombre_jja} {u.apellido_jja} — CI: {u.cedula_jja}
                  </option>
                ))}
              </select>
            )}
            {usuarios_jja.length === 0 && !cargandoUsuarios_jja && (
              <p style={{ fontSize: '0.78rem', color: 'var(--texto-terciario-jja)', marginTop: 4 }}>
                No se encontraron clientes registrados.
              </p>
            )}
          </div>

          {/* Motivo */}
          <FormGroup_jja
            label="Motivo de la sanción"
            nombre="motivo_sancion"
            tipo="textarea"
            valor={formSancion_jja.motivo}
            onChange={(_, v) => setFormSancion_jja(prev => ({ ...prev, motivo: v }))}
            placeholder="Describe el motivo por el cual se sanciona al usuario..."
            helper="Obligatorio — máximo 255 caracteres"
            requerido
          />

          {/* Duración */}
          <div style={{ marginTop: 16 }}>
            <label style={{
              display: 'block', marginBottom: 6, fontWeight: 600,
              fontSize: '0.88rem', color: 'var(--texto-principal-jja)'
            }}>
              Duración de la sanción
            </label>
            <select
              value={formSancion_jja.dias_sancion}
              onChange={(e) => setFormSancion_jja(prev => ({ ...prev, dias_sancion: parseInt(e.target.value) }))}
              style={{
                width: '100%', padding: '10px 14px',
                borderRadius: 'var(--border-radius-sm-jja, 10px)',
                border: '1px solid var(--borde-jja)',
                background: 'var(--bg-tarjeta-jja)',
                color: 'var(--texto-principal-jja)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                appearance: 'auto',
              }}
            >
              <option value={0}>⛔ Indefinida (hasta levantar manualmente)</option>
              <option value={7}>7 días</option>
              <option value={15}>15 días</option>
              <option value={30}>30 días (1 mes)</option>
              <option value={60}>60 días (2 meses)</option>
              <option value={90}>90 días (3 meses)</option>
              <option value={180}>180 días (6 meses)</option>
              <option value={365}>365 días (1 año)</option>
            </select>
            <p style={{ fontSize: '0.78rem', color: 'var(--texto-terciario-jja)', marginTop: 4 }}>
              {formSancion_jja.dias_sancion === 0
                ? 'La sanción permanecerá activa hasta que un administrador o encargado la levante manualmente.'
                : `La sanción se levantará automáticamente después de ${formSancion_jja.dias_sancion} días.`}
            </p>
          </div>
        </div>
      </ActionModal_jja>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── Modal: Confirmar levantar sanción (con motivo) ── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <ActionModal_jja
        visible={modalLevantar_jja.visible}
        titulo="Levantar Sanción"
        onCerrar={() => { setModalLevantar_jja({ visible: false, sancion: null }); setMotivoLevantar_jja('') }}
        onConfirmar={levantarSancion_jja}
        textoConfirmar="Sí, Levantar Sanción"
        variante="exito"
        cargando={levantando_jja}
        ancho="520px"
      >
        {modalLevantar_jja.sancion && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
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
            </div>

            {/* Campo de motivo para levantar */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 'var(--border-radius-sm-jja, 10px)',
              padding: '14px 16px',
              marginTop: 12,
            }}>
              <FormGroup_jja
                label="Motivo del levantamiento"
                nombre="motivo_levantar"
                tipo="textarea"
                valor={motivoLevantar_jja}
                onChange={(_, v) => setMotivoLevantar_jja(v)}
                placeholder="Describe por qué se levanta esta sanción..."
                helper="Obligatorio — se registrará en el historial de la sanción"
                requerido
              />
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--texto-terciario-jja)', marginTop: 12, textAlign: 'center' }}>
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
