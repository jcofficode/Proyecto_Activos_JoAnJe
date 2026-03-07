import { useState } from 'react'
import { validarCampo } from '../utils/validation'

export default function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues)
  const [validation, setValidation] = useState(
    Object.keys(initialValues).reduce((acc, k) => ({ ...acc, [k]: 'neutral' }), {})
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    setValidation(prev => ({ ...prev, [name]: validarCampo(name, value) }))
  }

  const setField = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
    setValidation(prev => ({ ...prev, [name]: validarCampo(name, value) }))
  }

  return { values, validation, setValues, setField, handleChange }
}
