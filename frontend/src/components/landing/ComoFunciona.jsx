import React, { useState } from 'react'
import imagenfunciona1_jja from "../../assets/equipos.png"
import imagenfunciona2_jja from "../../assets/qr-nfc.png"
import imagenfunciona3_jja from "../../assets/monitoreo.png"

const pasos_jc = [
  {
    numero: '01',
    titulo: 'Registro de Activos',
    resumen: 'Registra todos tus equipos rápidamente con QR o NFC.',
    descripcion: 'Registra todos tus equipos y activos de forma rápida utilizando etiquetas NFC o códigos QR. El sistema genera automáticamente un identificador único para cada activo, lo vincula a su propietario o área responsable y queda disponible para préstamo inmediato.',
    imagen: imagenfunciona1_jja,
    color: 'naranja',
  },
  {
    numero: '02',
    titulo: 'Préstamo con NFC o QR',
    resumen: 'Autoriza préstamos al instante con un solo escaneo.',
    descripcion: 'Escanea y autoriza el préstamo de equipos con solo un toque de tu dispositivo. El sistema verifica en tiempo real que el usuario esté habilitado, registra la fecha y hora del préstamo, y envía una notificación automática tanto al solicitante como al administrador.',
    imagen: imagenfunciona2_jja,
    color: 'morado',
  },
  {
    numero: '03',
    titulo: 'Monitoreo y Control Total',
    resumen: 'Visualiza en tiempo real el estado de todos tus activos.',
    descripcion: 'Visualiza en tiempo real quién tiene cada activo, desde cuándo y hasta cuándo. El panel administrativo muestra alertas de vencimiento, historial completo de préstamos, devoluciones y estadísticas generales.',
    imagen: imagenfunciona3_jja,
    color: 'naranja',
  },
]

const ComoFunciona = () => {
  const [abierto_jc, setAbierto_jc] = useState(0)

  return (
    <section id="funcionalidades" className="seccion como-funciona">
      <div className="contenedor">
        <h2 className="seccion-titulo">¿Cómo funciona?</h2>
        <p className="seccion-subtitulo">Tres pasos simples para gestionar todos tus activos.</p>

        <div className="acordeon-contenedor">
          {pasos_jc.map((paso, i) => {
            const estaAbierto = abierto_jc === i
            return (
              <div
                key={i}
                className={`acordeon-item ${estaAbierto ? 'abierto' : ''} acento-${paso.color}`}
              >
                <button
                  className="acordeon-cabecera"
                  onPointerDown={() => setAbierto_jc(estaAbierto ? -1 : i)}
                  aria-expanded={estaAbierto}
                >
                  <div className="acordeon-izquierda">
                    <span className="acordeon-numero">{paso.numero}</span>
                    <div>
                      <h3 className="acordeon-titulo">{paso.titulo}</h3>
                      {!estaAbierto && (
                        <p className="acordeon-resumen">{paso.resumen}</p>
                      )}
                    </div>
                  </div>
                  <span className={`acordeon-icono ${estaAbierto ? 'rotado' : ''}`}>
                    {estaAbierto ? '−' : '+'}
                  </span>
                </button>

                <div className={`acordeon-cuerpo ${estaAbierto ? 'visible' : ''}`}>
                  <div className="acordeon-inner">
                    <div className="acordeon-imagen-wrap">
                      <img src={paso.imagen} alt={paso.titulo} className="acordeon-imagen" />
                    </div>
                    <p className="acordeon-descripcion">{paso.descripcion}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="boton-conocer-mas">
          <a href="#contacto">
            <button className="boton-primario">Conocer Ahora</button>
          </a>
        </div>
      </div>
    </section>
  )
}

export default ComoFunciona
