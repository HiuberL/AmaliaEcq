// app/tienda/[categoria]/page.tsx (Server Component)
import { Metadata } from 'next';
import RootLayout from '../layout';
import InicioClient from './InicioClient';


// 1. GENERACIÓN DE METADATOS DINÁMICOS PARA GOOGLE
export const generateMetadata: Metadata = {    
    title: `Productos Originales | Ecuador | Amalia Ec`,
    description: `Explora nuestro catálogo exclusivo de productos originales en Ecuador. Encuentra las mejores marcas internacionales, perfumes y maquillajes en stock con envíos a todo el país.`,
    openGraph: {
      title: `Productos Originales | Ecuador | Amalia Ec`,
      description: `Compra lo mejor en perfumes y maquillajes con envíos rápidos a nivel nacional en Ecuador`,
      type: 'website',
    }
}

// 2. COMPONENTE PRINCIPAL
export default function InicioPage() {
  return <InicioClient />;
}