'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import style from '@styles/not-found.module.css'; // Ajusta la ruta a tus estilos

export default function NotFound() {
  return (
    <div className={style.notFoundContainer}>
      <motion.div 
        className={style.contentBox}
        initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className={style.errorCode}>404</h1>
        <h2 className={style.title}>Página no encontrada</h2>
        <p className={style.description}>
          Lo sentimos, no hemos encontrado algo relacionado, posiblemente ya no esté disponible.
        </p>
        
        <Link href="/" className={style.backButton}>
          Volver al Inicio
        </Link>
      </motion.div>
    </div>
  );
}