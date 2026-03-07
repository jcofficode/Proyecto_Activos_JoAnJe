import React from 'react'
import Users from '../components/sistema/Users'
import Card from '../components/ui/Card'

export default function UsersPage(){
  return (
    <div className="container seccion">
      <div className="page-hero">
        <div>
          <div className="page-title">Usuarios</div>
          <div className="page-subtitle">Gestiona los usuarios que pueden solicitar activos.</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary">Agregar usuario</button>
        </div>
      </div>

      <div className="page-content">
        <div className="content-grid">
          <div>
            <Users />
          </div>
        </div>
      </div>
    </div>
  )
}
