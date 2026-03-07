import React from 'react'
import imagenequipo1_jja from "../../assets/jorge.jpeg"
import imagenequipo2_jja from "../../assets/Padrino.jpeg"
import imagenequipo3_jja from "../../assets/jeannn.jpeg"

const Equipo = () => {
  const miembros = [
    {
      nombre: "Jorge Fanianos",
      cargo: "Desarrollador Frontend",
      imagenUrl:imagenequipo1_jja
    },
    {
      nombre: "Andrés Padrino",
      cargo: "Diseñador UX/UI",
      imagenUrl:imagenequipo2_jja
    },
    {
      nombre: "Jean Coffi",
      cargo: "Desarrollador Backend",
      imagenUrl:imagenequipo3_jja
    }
  ]

  return (
    <section className="seccion equipo">
      <div className="contenedor">
        <h2 className="seccion-titulo">Nuestro Equipo</h2>
        
        <div className="tarjetas-equipo">
          {miembros.map((miembro, index) => (
            <div key={index} className="tarjeta-miembro">
              <div className="miembro-avatar">
                <img 
                  src={miembro.imagenUrl} 
                  alt={`Foto de ${miembro.nombre}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>
              <div className="miembro-info">
                <h3 className="miembro-nombre">{miembro.nombre}</h3>
                <p className="miembro-cargo">{miembro.cargo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Equipo
