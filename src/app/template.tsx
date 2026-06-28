'use client';

import { motion, Variants } from 'framer-motion'; // 1. Importamos 'Variants'

// 2. Le asignamos el tipo ': Variants' al contenedor padre
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, 
      delayChildren: 0.05,
    },
  },
};

// 3. Le asignamos el tipo ': Variants' también a los elementos hijos
const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    filter: 'blur(4px)' 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      // Al usar ': Variants', TypeScript ya entiende perfectamente este arreglo
      ease: [0.16, 1, 0.3, 1], 
    },
  },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export { itemVariants };