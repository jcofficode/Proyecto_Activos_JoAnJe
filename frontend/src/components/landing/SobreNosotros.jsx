import React from 'react'
import imagennosotros_jja from "../../assets/equipocode.png";
const SobreNosotros = () => {
  return (
    <section id="sobre-nosotros" className="seccion sobre-nosotros">
      <div className="contenedor">
        <h2 className="seccion-titulo">Sobre Nosotros</h2>
        
        <div className="sobre-nosotros-contenido">
          <div className="sobre-nosotros-texto">
            <p>
              JoAnJe Coders es una empresa dedicada al desarrollo de soluciones tecnológicas innovadoras. Nos 
              especializamos en la creación de sistemas de gestión eficientes que optimizan los procesos 
              empresariales. Nuestro equipo está conformado por profesionales apasionados que trabajan para 
              ofrecer productos de la más alta calidad, combinando experiencia técnica con un profundo 
              entendimiento de las necesidades del mercado.
            </p>
            
            <p>
              Con años de experiencia en el sector tecnológico, hemos desarrollado soluciones que transforman 
              la manera en que las empresas gestionan sus recursos. Creemos en la innovación constante y en 
              el uso de las últimas tecnologías para crear sistemas que realmente marquen la diferencia.
            </p>
          </div>

          <div className="sobre-nosotros-imagen">
            <img 
              src={imagennosotros_jja}
              alt="Equipo JoAnJe Coders"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SobreNosotros
