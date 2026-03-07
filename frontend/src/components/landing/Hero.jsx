import React, { useState, useEffect } from 'react'
import imagencarrusel1_jja from "../../assets/laptop.png"
import imagencarrusel2_jja from "../../assets/libro.png"
import imagencarrusel3_jja from "../../assets/video.png"
const Hero = () => {
  const [imagenActiva, setImagenActiva] = useState(0)

  const imagenes = [
    imagencarrusel1_jja,imagencarrusel2_jja,imagencarrusel3_jja
   
  ]

  useEffect(() => {
    const intervalo_jja = setInterval(() => {
      setImagenActiva((prevImagen) => (prevImagen + 1) % imagenes.length)
    }, 5000) 

    return () => clearInterval(intervalo_jja)
  }, [imagenes.length])

  return (
    <section id="inicio" className="hero">
      <div className="contenedor">
        <div className="hero-contenido">
          <div className="hero-texto">
            <h1>Sistema inteligente de préstamos de activos con QR / NFC</h1>
            <p>Gestiona y controla el inventario y los flujos de préstamos de activos institucionales.</p>
            
            <div className="hero-botones">
              <a href="#funcionalidades" className="boton-secundario">
                Saber Más
              </a>
              <a href="#contacto" className="boton-primario">
                Empezar ya
              </a>
            </div>
          </div>

          <div className="hero-imagen">
            <div className="carrusel-imagenes">
              {imagenes.map((img, index) => (
                <div
                  key={index}
                  className={`imagen-carrusel ${index === imagenActiva ? 'activa' : ''}`}
                >
                  <div
                    className="imagen-placeholder"
                    style={{
                      backgroundImage: `url(${img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="caracteristicas-rapidas">
          <div className="caracteristica-item">
            <div className="caracteristica-item-icono"></div>
            <p>Escanea préstamos de activos</p>
          </div>
          <div className="caracteristica-item">
            <div className="caracteristica-item-icono"></div>
            <p>Control automático con QR /NFC</p>
          </div>
          <div className="caracteristica-item">
            <div className="caracteristica-item-icono"></div>
            <p>Historial de préstamos</p>
          </div>
          <div className="caracteristica-item">
            <div className="caracteristica-item-icono"></div>
            <p>Interfaz clara y rápida</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
