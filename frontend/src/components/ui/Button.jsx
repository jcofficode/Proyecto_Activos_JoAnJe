import React from 'react'

export default function Button({ children, variant = 'primary', className = '', ...rest }){
  const v = variant === 'primary' ? 'btn-primary' : variant === 'ghost' ? 'btn-ghost' : 'btn-light'
  return (
    <button className={`btn ${v} ${className}`} {...rest}>{children}</button>
  )
}
