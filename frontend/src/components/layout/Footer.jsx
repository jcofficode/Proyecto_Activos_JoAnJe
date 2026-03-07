import React from 'react'

const Footer = () => {
  return (
    
    <footer className="footer">
      <div className="contenedor">
        <div className="footer-contenido">
          <div className="footer-columna">
            <h3>JoAnJe Coders</h3>
            <p>
              Soluciones tecnológicas innovadoras para la gestión inteligente de activos. 
              Transformamos la manera en que las empresas controlan sus recursos.
            </p>
          </div>

          <div className="footer-columna">
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#funcionalidades">Funcionalidades</a></li>
              <li><a href="#testimonios">Testimonios</a></li>
            </ul>
          </div>

          <div className="footer-columna">
            <h3>Contacto</h3>
            <ul>
              <li><a >+58 424 1539453</a></li>
              <li><a href="mailto:jeanmarcocoffi@gmail.com">contacto@joanje.com</a></li>
              <li><a href="#ubicacion">Venezuela</a></li>
            </ul>
          </div>

          <div className="footer-columna">
            <h3>Redes Sociales</h3>
            <div className="redes-sociales">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="red-social">
                <span>f</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="red-social">
                <span>𝕏</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="red-social">
                <span>in</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="red-social">
                <img src="/src/assets/ins.png" alt="Instagram" style={{ width: '24px', height: '24px' }} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 JoAnJe Coders. Todos los derechos reservados.</p>
          <p>Proyecto desarrollado por: JoAnJe Coders</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
