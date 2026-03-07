import React, { useState, useEffect } from 'react'

const STORAGE_KEY = 'joanje_company'

export default function CompanySetup({ onSaved, onCancel }) {
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
      alert('No se pudo guardar la configuración en el navegador.')
    }
  }

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY)
    setNombre('')
    setLogoData(null)
    if (typeof onSaved === 'function') onSaved(null)
  }

  return (
    <aside className="company-setup">
      <h3>Configura tu Cuenta de Empresa</h3>
      <p>Completa el nombre de tu empresa y sube un logo para personalizar tu panel.</p>
      <div className="grupo-formulario">
        <label>Nombre de la empresa</label>
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: ACME C.A." />
      </div>
      <div className="grupo-formulario">
        <label>Logo (PNG/JPG)</label>
        <input type="file" accept="image/*" onChange={handleFile} />
        {logoData && <div className="logo-preview"><img src={logoData} alt="Logo" style={{ height: 60 }} /></div>}
      </div>
      <div className="company-setup-actions">
        <button onClick={handleSave} disabled={saving || !nombre.trim()} className="boton-enviar">
          {saving ? 'Guardando...' : 'Guardar configuración'}
        </button>
        <button onClick={handleClear} className="boton-ligero">Restablecer</button>
        <button onClick={() => { if (typeof onCancel === 'function') onCancel() }} className="boton-ligero">Cerrar</button>
      </div>
    </aside>
  )
}
