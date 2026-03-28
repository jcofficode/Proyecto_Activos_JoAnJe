// ============================================================
// GlobalModal_jja.jsx — Componente Visual del Modal Global
// Usa Glassmorphism y diseño premium.
// ============================================================
import React from 'react';
import { useModal_jja } from '../../context/ModalContext_jja';

const GlobalModal_jja = () => {
  const { isOpen, titulo, mensaje, tipo, onConfirm, cerrarModal } = useModal_jja();

  if (!isOpen) return null;

  // Iconos según el tipo de modal
  const getTypeIcon = () => {
    switch (tipo) {
      case 'success':
        return <span style={{ color: '#10b981', fontSize: '2rem' }}>✔️</span>;
      case 'error':
        return <span style={{ color: '#ef4444', fontSize: '2rem' }}>❌</span>;
      case 'warning':
        return <span style={{ color: '#f59e0b', fontSize: '2rem' }}>⚠️</span>;
      default:
        return <span style={{ color: '#3b82f6', fontSize: '2rem' }}>ℹ️</span>;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    cerrarModal();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: "'Inter', 'Poppins', sans-serif"
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '24px 32px',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid rgba(255,255,255,0.7)',
        position: 'relative'
      }}>
        {/* Icono */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '64px', height: '64px',
            borderRadius: '50%',
            backgroundColor: '#f8fafc',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
          }}>
            {getTypeIcon()}
          </div>
        </div>

        {/* Textos */}
        <h3 style={{
          margin: '0 0 12px',
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#1e293b'
        }}>
          {titulo}
        </h3>
        
        <p style={{
          margin: '0 0 24px',
          color: '#64748b',
          fontSize: '0.95rem',
          lineHeight: '1.5'
        }}>
          {mensaje}
        </p>

        {/* Botones */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center'
        }}>
          {onConfirm && (
            <button 
              onClick={cerrarModal}
              style={{
                flex: 1,
                padding: '10px 16px',
                border: '1px solid #cbd5e1',
                backgroundColor: 'transparent',
                borderRadius: '8px',
                color: '#475569',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Cancelar
            </button>
          )}

          <button 
            onClick={handleConfirm}
            style={{
              flex: 1,
              padding: '10px 16px',
              border: 'none',
              backgroundColor: tipo === 'error' ? '#ef4444' : '#4f46e5',
              backgroundImage: tipo !== 'error' ? 'linear-gradient(135deg, #4f46e5, #3b82f6)' : 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 10px rgba(79, 70, 229, 0.3)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(79, 70, 229, 0.2)';
            }}
          >
            Aceptar
          </button>
        </div>

        <style>{`
          @keyframes modalSlideIn {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default GlobalModal_jja;
