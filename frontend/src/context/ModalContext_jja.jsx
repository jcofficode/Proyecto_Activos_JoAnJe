// ============================================================
// ModalContext_jja.jsx — Contexto Global para Modales Reutilizables
// Reemplaza el uso de alert() nativo en todo el sistema.
// ============================================================
import React, { createContext, useContext, useState, useCallback } from 'react';

// Contexto principal
export const ModalContext_jja = createContext();

// Hook para consumir fácilmente el Modal
export const useModal_jja = () => {
  const context = useContext(ModalContext_jja);
  if (!context) {
    throw new Error('useModal_jja debe usarse dentro de un ModalProvider_jja');
  }
  return context;
};

// Proveedor del estado global para el modal
export const ModalProvider_jja = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    titulo: '',
    mensaje: '',
    tipo: 'info', // 'info' | 'success' | 'warning' | 'error'
    onConfirm: null,
  });

  const mostrarModal = useCallback(({ titulo, mensaje, tipo = 'info', onConfirm = null }) => {
    setModalState({
      isOpen: true,
      titulo: titulo || 'Aviso',
      mensaje,
      tipo,
      onConfirm
    });
  }, []);

  const cerrarModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ModalContext_jja.Provider value={{
      ...modalState,
      mostrarModal,
      cerrarModal
    }}>
      {children}
    </ModalContext_jja.Provider>
  );
};
