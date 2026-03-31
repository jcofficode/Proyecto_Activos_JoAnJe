// ============================================================
// ModalSancion_jja.jsx — Modal rojo profesional de sanción
// Se muestra a clientes sancionados de forma persistente
// Sistema JoAnJe Coders — Sufijo: _jja
// ============================================================
import React, { useEffect, useState } from 'react'
import { IconoSancion_jja } from './Iconos_jja'

const ModalSancion_jja = ({ visible = false, motivo = '', onCerrar }) => {
  const [animando_jja, setAnimando_jja] = useState(false)

  useEffect(() => {
    if (visible) {
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden'
      // Pequeña demora para la animación de entrada
      requestAnimationFrame(() => setAnimando_jja(true))
    } else {
      document.body.style.overflow = ''
      setAnimando_jja(false)
    }
    return () => { document.body.style.overflow = '' }
  }, [visible])

  if (!visible) return null

  return (
    <div
      className={`modal-sancion-overlay-jja ${animando_jja ? 'visible-jja' : ''}`}
      style={{
        position: 'fixed',
        top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(15, 5, 5, 0.70)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        fontFamily: "'Inter', 'Poppins', sans-serif",
        opacity: animando_jja ? 1 : 0,
        transition: 'opacity 0.3s ease',
        padding: 16,
      }}
    >
      <div
        className="modal-sancion-card-jja"
        style={{
          background: 'linear-gradient(145deg, #1a0505 0%, #2d0a0a 40%, #1c0808 100%)',
          border: '2px solid rgba(220, 38, 38, 0.5)',
          borderRadius: '20px',
          padding: '36px 32px 28px',
          maxWidth: '460px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(220, 38, 38, 0.25), 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          transform: animando_jja ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.92)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Efecto de brillo rojo superior */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 200, height: 3,
          background: 'linear-gradient(90deg, transparent, #dc2626, transparent)',
          borderRadius: '0 0 50% 50%',
        }} />

        {/* Halo rojo de fondo */}
        <div style={{
          position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Icono de prohibición animado */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(145deg, rgba(220, 38, 38, 0.2), rgba(153, 27, 27, 0.3))',
          border: '2px solid rgba(220, 38, 38, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          animation: 'sancion-pulse-jja 2s ease-in-out infinite',
          position: 'relative',
        }}>
          <IconoSancion_jja style={{
            fontSize: '2.2rem', color: '#ef4444',
            filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))',
          }} />
        </div>

        {/* Título */}
        <h2 style={{
          color: '#fca5a5',
          fontSize: '1.15rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginBottom: 6,
          textShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
          lineHeight: 1.3,
        }}>
          ⛔ Acceso Restringido
        </h2>
        <h3 style={{
          color: '#dc2626',
          fontSize: '0.85rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: 20,
        }}>
          Sanción Activa
        </h3>

        {/* Mensaje principal */}
        <p style={{
          color: '#fecaca',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          marginBottom: 16,
          padding: '0 8px',
        }}>
          Usted se encuentra <strong style={{ color: '#f87171' }}>sancionado</strong> y{' '}
          <strong style={{ color: '#f87171' }}>no puede solicitar préstamos</strong> de activos.
          Diríjase a la administración para más información.
        </p>

        {/* Motivo de la sanción */}
        {motivo && (
          <div style={{
            background: 'rgba(220, 38, 38, 0.08)',
            border: '1px solid rgba(220, 38, 38, 0.2)',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: 24,
            textAlign: 'left',
          }}>
            <div style={{
              fontSize: '0.72rem', fontWeight: 700, color: '#f87171',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6,
            }}>
              Motivo de la sanción
            </div>
            <p style={{
              color: '#fecaca', fontSize: '0.85rem', lineHeight: 1.5, margin: 0,
            }}>
              {motivo}
            </p>
          </div>
        )}

        {/* Botón entendido */}
        <button
          onClick={onCerrar}
          style={{
            width: '100%',
            padding: '13px 24px',
            border: '1px solid rgba(220, 38, 38, 0.5)',
            background: 'linear-gradient(135deg, #991b1b, #dc2626)',
            borderRadius: '12px',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.4)'
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.3)'
          }}
        >
          Entendido
        </button>

        {/* Nota al pie */}
        <p style={{
          color: 'rgba(252, 165, 165, 0.5)',
          fontSize: '0.72rem',
          marginTop: 16,
          marginBottom: 0,
        }}>
          Esta notificación se mostrará periódicamente hasta que su sanción sea levantada.
        </p>

        {/* Animación de pulso */}
        <style>{`
          @keyframes sancion-pulse-jja {
            0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.3); }
            50% { box-shadow: 0 0 0 12px rgba(220, 38, 38, 0); }
          }
        `}</style>
      </div>
    </div>
  )
}

export default ModalSancion_jja
