import React, { useState, useEffect, useRef } from 'react'

const Testimonios = () => {
  const [testimonios, setTestimonios] = useState([])
  const [cargando, setCargando] = useState(true)
  const tarjetasRef = useRef([])

  const textoTestimonios_jja = [
    "JoAnJe Coders transformó nuestra gestión de activos: rápido, seguro y confiable con tecnología NFC y QR.",
    "Con JoAnJe Coders reducimos pérdidas y controlamos préstamos de forma eficiente y automática.",
    "La automatización con NFC y QR nos ahorra horas semanales y elimina errores de registro manual.",
    "Nunca fue tan sencillo gestionar equipos; JoAnJe Coders superó todas nuestras expectativas.",
    "La trazabilidad en tiempo real nos da tranquilidad operativa y control total de activos.",
    "JoAnJe Coders simplificó procesos críticos de préstamos de forma radical y profesional.",
    "Implementamos JoAnJe Coders en días y vimos resultados inmediatos en control de inventario.",
    "Con JoAnJe Coders, el equipo se enfoca en producción, no en buscar equipos perdidos.",
    "Los reportes y alertas automáticas habilitan decisiones estratégicas sobre nuestros activos.",
    "JoAnJe Coders se integró perfectamente con nuestros sistemas; justo lo que necesitábamos.",
    "El sistema NFC de JoAnJe Coders revolucionó cómo prestamos y devolvemos equipos tecnológicos.",
    "Reducimos tiempos de préstamo  con un simple toque NFC / QR.",
    "La interfaz es intuitiva y el equipo adoptó JoAnJe Coders sin necesidad de capacitación extensa.",
    "Finalmente tenemos visibilidad completa de quién tiene qué equipo y por cuánto tiempo.",
    "JoAnJe Coders eliminó el papeleo y los formatos manuales de préstamos definitivamente."
  ]

  const cargos_jja = [
    "Gerente de Operaciones",
    "Director de TI",
    "Jefe de Logística",
    "Coordinador de Inventarios",
    "Gerente de Proyectos",
    "Administrador de Activos",
    "Supervisor de Tecnología",
    "Encargado de Préstamos",
    "Director de Operaciones",
    "Jefe de Sistemas"
  ]

  const obtenerAleatorios_jja = (array_jja, cantidad_jja) => {
    const copia_jja = [...array_jja]
    const seleccionados_jja = []
    for (let i_jja = 0; i_jja < cantidad_jja; i_jja++) {
      const indice_jja = Math.floor(Math.random() * copia_jja.length)
      seleccionados_jja.push(copia_jja.splice(indice_jja, 1)[0])
    }
    return seleccionados_jja
  }

  useEffect(() => {
    const cargarTestimonios_jja = async () => {
      try {
        setCargando(true)

        const respuestaUsuarios_jja = await fetch('https://jsonplaceholder.typicode.com/users')
        const todosUsuarios_jja = await respuestaUsuarios_jja.json()

        const usuarios_jja = todosUsuarios_jja.filter(u => u.id !== 2)

        const usuariosAleatorios_jja = obtenerAleatorios_jja(usuarios_jja, 3)

        const testimoniosAleatorios_jja = obtenerAleatorios_jja(textoTestimonios_jja, 3)

        const cargosAleatorios_jja = obtenerAleatorios_jja(cargos_jja, 3)

        const testimoniosFinales_jja = usuariosAleatorios_jja.map((usuario_jja, indice_jja) => ({
          id: usuario_jja.id,
          nombre: usuario_jja.name,
          cargo: cargosAleatorios_jja[indice_jja],
          texto: testimoniosAleatorios_jja[indice_jja],
          avatarUrl: `https://i.pravatar.cc/150?img=${usuario_jja.id}`,
          estrellas: 5
        }))

        setTestimonios(testimoniosFinales_jja)
        setCargando(false)
      } catch (error_jja) {
        console.error('Error al cargar testimonios:', error_jja)
        setTestimonios([
          {
            id: 1,
            nombre: "Usuario Demo",
            cargo: "Gerente de Operaciones",
            texto: "Sistema excelente para gestión de activos con NFC.",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
            estrellas: 5
          }
        ])
        setCargando(false)
      }
    }

    cargarTestimonios_jja()
  }, [])

  useEffect(() => {
    if (testimonios.length === 0) return

    const observador_jja = new IntersectionObserver(
      (entradas_jja) => {
        entradas_jja.forEach((entrada_jja) => {
          if (entrada_jja.isIntersecting) {
            entrada_jja.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.2 }
    )

    tarjetasRef.current.forEach((tarjeta_jja) => {
      if (tarjeta_jja) observador_jja.observe(tarjeta_jja)
    })

    return () => {
      tarjetasRef.current.forEach((tarjeta_jja) => {
        if (tarjeta_jja) observador_jja.unobserve(tarjeta_jja)
      })
    }
  }, [testimonios])

  const generarEstrellas_jja = (cantidad_jja) => '★'.repeat(cantidad_jja)

  return (
    <section id="testimonios" className="seccion testimonios">
      <div className="contenedor">
        <h2 className="seccion-titulo">Testimonios</h2>

        {cargando ? (
          <div className="tarjetas-testimonios">
            {[1, 2, 3].map((item_jja) => (
              <div key={item_jja} className="tarjeta-testimonio" style={{ opacity: 0.5 }}>
                <div className="testimonio-avatar" style={{ backgroundColor: '#e0e0e0' }}></div>
                <p className="testimonio-texto">Cargando testimonio...</p>
                <div className="testimonio-estrellas">★★★★★</div>
                <h4 className="testimonio-nombre">...</h4>
                <p className="testimonio-cargo">...</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="tarjetas-testimonios">
            {testimonios.map((testimonio_jja, indice_jja) => (
              <div
                key={testimonio_jja.id}
                className="tarjeta-testimonio"
                ref={(elemento_jja) => (tarjetasRef.current[indice_jja] = elemento_jja)}
              >
                <img
                  src={testimonio_jja.avatarUrl}
                  alt={`Avatar de ${testimonio_jja.nombre}`}
                  className="testimonio-avatar"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 20px'
                  }}
                />
                <p className="testimonio-texto">"{testimonio_jja.texto}"</p>
                <div className="testimonio-estrellas">
                  {generarEstrellas_jja(testimonio_jja.estrellas)}
                </div>
                <h4 className="testimonio-nombre">{testimonio_jja.nombre}</h4>
                <p className="testimonio-cargo">{testimonio_jja.cargo}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Testimonios
