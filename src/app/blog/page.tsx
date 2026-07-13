// app/tienda/[categoria]/page.tsx (Server Component)
import { Metadata } from 'next';
import CategoriaClient from './BlogClient';
import BlogClient from './BlogClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata : Metadata = {  
    title: `Blog | Ecuador | Amalia Ec`,
    description: `Amalia también realiza reseñas de productos y artículos relacionados con el mundo de la perfumería y la cosmética. Descubre nuestros consejos, recomendaciones y novedades en nuestro blog.`,
    openGraph: {
      title: `Blog | Ecuador | Amalia Ec`,
      description: `Amalia también realiza reseñas de productos y artículos relacionados con el mundo de la perfumería y la cosmética. Descubre nuestros consejos, recomendaciones y novedades en nuestro blog.`,
      type: 'website',
    }
}

export default function BlogPage() {
  return (
    <Suspense fallback={null}>
      <BlogClient />
    </Suspense>

  );
}