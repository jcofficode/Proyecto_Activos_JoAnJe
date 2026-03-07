import React from 'react'
import imagenpoliticas1_jja from "../../assets/usuario.png"
import imagenpoliticas2_jja from "../../assets/periodos.png"
import imagenpoliticas3_jja from "../../assets/daños.png"

const tarjetas_jc = [
  {

    imagen: imagenpoliticas1_jja,
    titulo: '¿Quién puede prestar?',
    descripcionFrente: 'Solo usuarios registrados y autorizados pueden solicitar préstamos.',
    descripcionDorso: 'El sistema verifica en tiempo real que el usuario tenga perfil activo, permisos asignados y no tenga préstamos vencidos pendientes antes de autorizar cualquier solicitud nueva.',
    color: '#ff6b35',
  },
  {

    imagen: imagenpoliticas2_jja,
    titulo: 'Tiempos Flexibles',
    descripcionFrente: 'Periodos personalizados con recordatorios automáticos antes del vencimiento.',
    descripcionDorso: 'Define plazos de horas, días o semanas según la categoría del activo. El sistema envía alertas por correo al usuario y al administrador 24h antes del vencimiento para evitar retrasos.',
    color: '#7b2fff',
  },
  {

    imagen: imagenpoliticas3_jja,
    titulo: 'Gestión de Daños',
    descripcionFrente: 'Reporta y gestiona incidencias, daños o pérdidas con seguimiento completo.',
    descripcionDorso: ' El administrador puede generar reportes de daños, gestionar reposiciones y mantener un historial auditado de todos los eventos.',
    color: '#ff6b35',
  },
]

const Politicas = () => {
  return (
    <section id="politicas" className="seccion politicas politicas-geo">
      {/* Fondo geométrico decorativo */}
      <div className="geo-fondo" aria-hidden="true">
        <div className="geo-circulo geo-c1"></div>
        <div className="geo-circulo geo-c2"></div>
        <div className="geo-forma geo-f1"></div>
        <div className="geo-forma geo-f2"></div>
      </div>

      <div className="contenedor" style={{ position: 'relative', zIndex: 1 }}>
        <h2 className="seccion-titulo titulo-claro">POLÍTICAS DE PRÉSTAMO</h2>
        <p className="seccion-subtitulo subtitulo-claro">Pasa el cursor sobre cada tarjeta para ver más detalles.</p>

        <div className="flip-grid">
          {tarjetas_jc.map((t, i) => (
            <div key={i} className="flip-card" tabIndex={0}>
              <div className="flip-inner">

                {/* ── FRENTE ── */}
                <div className="flip-frente" style={{ '--acento': t.color }}>
                  <img src={t.imagen} alt={t.titulo} className="flip-imagen" />
                  <h3 className="flip-titulo">{t.titulo}</h3>
                  <p className="flip-desc">{t.descripcionFrente}</p>
                  
                </div>

                {/* ── DORSO ── */}
                <div className="flip-dorso" style={{ '--acento': t.color }}>
                  <h3 className="flip-titulo">{t.titulo}</h3>
                  <p className="flip-dorso-texto">{t.descripcionDorso}</p>
                  <a href="#contacto" className="flip-cta">Saber más →</a>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Politicas
