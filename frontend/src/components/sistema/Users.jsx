import React, { useEffect, useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'

const USERS_KEY = 'joanje_demo_users'

function loadUsers(){
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch(e){return []}
}

export default function Users(){
  const [users, setUsers] = useState(loadUsers)

  useEffect(()=>{
    if(users.length===0){
      const demo = [{id:1,nombre:'Demo Usuario', correo:'demo@empresa.com', role:'Usuario'}]
      setUsers(demo)
      localStorage.setItem(USERS_KEY, JSON.stringify(demo))
    }
  },[])

  return (
    <div>
      <h3>Usuarios</h3>
      <Card className="p-16">
        <div className="muted">Administrar usuarios que pueden solicitar productos.</div>
        {users.map(u=> (
          <div key={u.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0'}}>
            <div>
              <strong>{u.nombre}</strong>
              <div className="muted">{u.correo} • {u.role}</div>
            </div>
            <div>
              <Button variant="ghost">Editar</Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
