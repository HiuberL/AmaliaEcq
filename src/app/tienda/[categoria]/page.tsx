// app/tienda/[categoria]/page.tsx (Server Component)
import { Metadata } from 'next';
import CategoriaClient from './CategoriaClient';

// Forzamos a TypeScript a reconocer que params es asíncrono en Next.js
interface CategoriaPageProps {
  params: Promise<{
    categoria: string;
  }>;
}
// 1. GENERACIÓN DE METADATOS DINÁMICOS PARA GOOGLE
export async function metadata({ params }: CategoriaPageProps): Promise<Metadata> {
  const parameter = await params;
  
  // Ponemos la primera letra en mayúscula para el título de Google
  const nombreCategoria = parameter.categoria.charAt(0).toUpperCase() + parameter.categoria.slice(1).toLowerCase();
  
  return {
    title: `${nombreCategoria} Exclusivos de Alta Gama | Amalia EQ`,
    description: `Explora nuestro catálogo exclusivo de ${nombreCategoria.toLowerCase()} en Ecuador. Encuentra las mejores marcas internacionales, decants personalizados y productos en stock con envíos a todo el país.`,
    openGraph: {
      title: `${nombreCategoria} Exclusivos de Alta Gama | Amalia EQ`,
      description: `Compra lo mejor en ${nombreCategoria.toLowerCase()} con envíos rápidos a nivel nacional.`,
      type: 'website',
    }
  };
}

// 2. COMPONENTE PRINCIPAL
export default async function CategoriaPage({ params }: CategoriaPageProps) {
  const parameter = await params;
  
  return <CategoriaClient categoriaSlug={parameter.categoria} />;
}