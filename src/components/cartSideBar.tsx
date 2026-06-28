'use client';

import React from 'react';
import styles from '@styles/shared/cartSidebar.module.css';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode; // Permite inyectar el <CartContent /> con la lógica de Directus
}

export default function CartSidebar({ isOpen, onClose, children }: CartSidebarProps) {
  
  // Si no está abierto, no renderiza nada para optimizar rendimiento y evitar llamadas prematuras
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* Detenemos la propagación del click para que el carrito no se cierre al interactuar por dentro */}
      <div className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
        
        {/* CABECERA ESTÁTICA */}
        <header className={styles.header}>
          <h2>Tu Carrito</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar carrito">
            &times;
          </button>
        </header>

        <div className={styles.content}>
          {children}
        </div>

      </div>
    </div>
  );
}