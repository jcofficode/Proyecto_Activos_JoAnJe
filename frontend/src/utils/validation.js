export const validarCampo = (name, value) => {
  if (!value) return 'neutral'
  switch (name) {
    case 'nombre_jc': return value.trim().length >= 3 ? 'valido' : 'invalido'
    case 'correo_jc': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'valido' : 'invalido'
    case 'telefono_jc': return value === '' || /^\+?[\d\s\-()]{7,20}$/.test(value) ? 'valido' : 'invalido'
    case 'empresa_jc': return value.trim().length >= 2 ? 'valido' : 'invalido'
    default: return 'neutral'
  }
}

export const pistas = {
  nombre_jc: 'Mínimo 3 caracteres. Ejemplo: Juan Pérez',
  correo_jc: 'Formato válido: usuario@dominio.com — se aceptan todos los dominios',
  telefono_jc: 'Formato: +58 414 000 0000 (7–20 dígitos, puede incluir +, espacios o guiones)',
  empresa_jc: 'Mínimo 2 caracteres. Ejemplo: Tech Solutions C.A.',
}
