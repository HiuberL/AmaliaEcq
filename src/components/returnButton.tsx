'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import style from '@styles/shared/return-button.module.css'; // Ajusta la ruta a tu estructura

interface BotonRegresarProps {
  fallbackRoute: string; // La ruta segura a donde irá si no hay historial previo
  label?: string;        // Texto opcional (por defecto será "VOLVER")
}

export default function BotonRegresar({ fallbackRoute, label = 'VOLVER' }: BotonRegresarProps) {
  const router = useRouter();

  const handleBack = () => {
    const tieneHistorial = typeof window !== 'undefined' && window.history.length > 1;

    if (tieneHistorial) {
      router.back();
    } else {
      router.push(fallbackRoute);
    }
  };

  return (
    <button onClick={handleBack} className={style.backButton} aria-label="Regresar">
      <span className={style.arrow}>←</span>
      <span className={style.text}>{label}</span>
    </button>
  );
}