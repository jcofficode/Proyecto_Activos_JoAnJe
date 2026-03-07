import React from 'react'
import useForm from '../../hooks/useForm'
import { API_URL_JC } from '../../api.config'
import { pistas } from '../../utils/validation'

export default function ContactForm({ navegarA_jc }) {
  const { values, validation, handleChange, setValues } = useForm({
    nombre_jc: '', correo_jc: '', telefono_jc: '', empresa_jc: '', mensaje_jc: ''
  })

  const [estado, setEstado] = React.useState({ cargando: false, mensaje: '', tipo: '' })

  const claseInput = (name) => {
    const v = validation[name]
    if (v === 'valido') return 'input-valido'
    if (v === 'invalido') return 'input-invalido'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEstado({ cargando: true, mensaje: '', tipo: '' })
    const params = new URLSearchParams()
    params.append('accion_jc', 'registrar')
    params.append('nombre_jc', values.nombre_jc)
    params.append('correo_jc', values.correo_jc)
    params.append('telefono_jc', values.telefono_jc)
    params.append('empresa_jc', values.empresa_jc)

    try {
      const res = await fetch(API_URL_JC, { method: 'POST', body: params })
      const data = await res.json()
      if (data.exito) {
        setEstado({ cargando: false, mensaje: '✅ ¡Registro exitoso! Revisa tu correo — te enviamos tu clave de acceso.', tipo: 'exito' })
        setValues({ nombre_jc: '', correo_jc: '', telefono_jc: '', empresa_jc: '', mensaje_jc: '' })
        if (typeof navegarA_jc === 'function') setTimeout(() => navegarA_jc('login'), 3500)
      } else {
        setEstado({ cargando: false, mensaje: '❌ ' + (data.mensaje || 'Error'), tipo: 'error' })
      }
    } catch (err) {
      setEstado({ cargando: false, mensaje: '❌ Error de conexión, pruebe más tarde.', tipo: 'error' })
    }
  }

  return (
    <form className="formulario-contacto" onSubmit={handleSubmit} noValidate>
      <div className="grupo-formulario">
        <label htmlFor="nombre_jc">Nombre <span className="requerido">*</span></label>
        <input
          type="text" id="nombre_jc" name="nombre_jc"
          value={values.nombre_jc} onChange={handleChange}
          placeholder="Tu nombre completo" required disabled={estado.cargando}
          className={claseInput('nombre_jc')}
        />
        <span className={`pista-campo pista-${validation.nombre_jc}`}>{pistas.nombre_jc}</span>
      </div>

      <div className="grupo-formulario">
        <label htmlFor="correo_jc">Correo <span className="requerido">*</span></label>
        <input
          type="email" id="correo_jc" name="correo_jc"
          value={values.correo_jc} onChange={handleChange}
          placeholder="tu@email.com" required disabled={estado.cargando}
          className={claseInput('correo_jc')}
        />
        <span className={`pista-campo pista-${validation.correo_jc}`}>{pistas.correo_jc}</span>
      </div>

      <div className="grupo-formulario">
        <label htmlFor="telefono_jc">Teléfono <span className="opcional">(Opcional)</span></label>
        <input
          type="tel" id="telefono_jc" name="telefono_jc"
          value={values.telefono_jc} onChange={handleChange}
          placeholder="+58 414 000 0000" disabled={estado.cargando}
          className={claseInput('telefono_jc')}
        />
        <span className={`pista-campo pista-${validation.telefono_jc}`}>{pistas.telefono_jc}</span>
      </div>

      <div className="grupo-formulario">
        <label htmlFor="empresa_jc">Empresa <span className="opcional">(Opcional)</span></label>
        <input
          type="text" id="empresa_jc" name="empresa_jc"
          value={values.empresa_jc} onChange={handleChange}
          placeholder="Nombre de tu empresa" disabled={estado.cargando}
          className={claseInput('empresa_jc')}
        />
        <span className={`pista-campo pista-${validation.empresa_jc}`}>{pistas.empresa_jc}</span>
      </div>

      {estado.mensaje && (
        <div className={`mensaje-resultado mensaje-${estado.tipo}`}>{estado.mensaje}</div>
      )}

      <button
        type="submit" className="boton-enviar"
        disabled={estado.cargando}
        style={{ opacity: estado.cargando ? 0.85 : 1, cursor: estado.cargando ? 'wait' : 'pointer' }}
      >
        {estado.cargando ? (<><div className="loader-jc" /><span>Enviando...</span></>) : 'Solicitar Demo'}
      </button>
    </form>
  )
}
