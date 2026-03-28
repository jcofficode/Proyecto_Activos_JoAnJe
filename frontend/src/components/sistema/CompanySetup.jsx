import React, { useState, useEffect } from 'react'
import { useModal_jja } from '../../context/ModalContext_jja'

const STORAGE_KEY = 'joanje_company'

export default function CompanySetup({ onSaved, onCancel }) {
  const { mostrarModal } = useModal_jja()
  const [nombre, setNombre] = useState('')
  const [logoData, setLogoData] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const obj = JSON.parse(raw)
        setNombre(obj.nombre || '')
        setLogoData(obj.logo || null)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setLogoData(reader.result)
    reader.readAsDataURL(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files && e.dataTransfer.files[0]
    if (f) {
      const reader = new FileReader()
      reader.onload = () => setLogoData(reader.result)
      reader.readAsDataURL(f)
    }
  }

  const handleSave = () => {
    setSaving(true)
    const payload = { nombre: nombre.trim(), logo: logoData }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      setTimeout(() => {
        setSaving(false)
        if (typeof onSaved === 'function') onSaved(payload)
      }, 400)
    } catch (err) {
      setSaving(false)
      mostrarModal({ mensaje: 'No se pudo guardar la configuración en el navegador.', tipo: 'error' })
    }
  }

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY)
    setNombre('')
    setLogoData(null)
    if (typeof onSaved === 'function') onSaved(null)
  }

  return (
    <aside className="company-setup card">
      <div className="company-setup-grid">
        <div className="company-preview">
          <div className="company-preview-inner">
            <div className="company-preview-logo">
              {logoData ? <img src={logoData} alt="Logo" /> : <div className="placeholder-logo">AC</div>}
            </div>
            <div className="company-preview-info">
              <h4>{nombre || 'Nombre de tu empresa'}</h4>
              <p className="muted">Este será el nombre público que verán tus usuarios.</p>
            </div>
          </div>
        </div>

        <div className="company-form">
          <h3>Configura tu cuenta de empresa</h3>
          <p className="muted">Personaliza el panel con el nombre y logo de tu empresa. Esto es solo front-end; el backend lo integrará luego.</p>

          <div className="grupo-formulario">
            <label>Nombre de la empresa</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: ACME C.A." />
          </div>

          <div className="grupo-formulario">
            <label>Logo (PNG/JPG)</label>
            <div className="logo-drop" onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
              <input type="file" accept="image/*" onChange={handleFile} />
              <div className="logo-drop-help">Arrastra tu logo aquí o haz click para seleccionar</div>
            </div>
            {logoData && <div className="logo-preview"><img src={logoData} alt="Logo" /></div>}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleSave} disabled={saving || !nombre.trim()} className="boton-enviar">
              {saving ? 'Guardando...' : 'Guardar configuración'}
            </button>
            <button onClick={handleClear} className="boton-ligero">Restablecer</button>
            <button onClick={() => { if (typeof onCancel === 'function') onCancel() }} className="boton-ligero">Cerrar</button>
          </div>
        </div>
      </div>
    </aside>
  )
}
