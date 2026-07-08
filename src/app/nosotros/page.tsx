// app/tienda/[categoria]/page.tsx (Server Component)
import { Metadata } from 'next';
import RootLayout from '../layout';
import InicioClient from './AboutClient';
import AboutClient from './AboutClient';


// 1. GENERACIÓN DE METADATOS DINÁMICOS PARA GOOGLE
export const metadata: Metadata = {    
    title: `Productos Originales | Ecuador | Amalia Ec`,
    description: `Conóce nuestra historia, Amalia nació con la premisa de entregar originalidad y seguridad a nuestros clientes`,
    openGraph: {
      title: `Productos Originales | Ecuador | Amalia Ec`,
      description: `Conóce nuestra historia, Amalia nació con la premisa de entregar originalidad y seguridad a nuestros clientes`,
      type: 'website',
    }
}

// 2. COMPONENTE PRINCIPAL
export default function AboutPage() {
  return <AboutClient />;
}