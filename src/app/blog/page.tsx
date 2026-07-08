// app/tienda/[categoria]/page.tsx (Server Component)
import { Metadata } from 'next';
import CategoriaClient from './BlogClient';
import BlogClient from './BlogClient';

export const generateMetadata = (): Metadata => {  
  return {
    title: `Blog | AmaliaEc`,
    description: `Amalia también realiza reseñas de productos y artículos relacionados con el mundo de la perfumería y la cosmética. Descubre nuestros consejos, recomendaciones y novedades en nuestro blog.`,
    openGraph: {
      title: `Blog | AmaliaEc`,
      description: `Amalia también realiza reseñas de productos y artículos relacionados con el mundo de la perfumería y la cosmética. Descubre nuestros consejos, recomendaciones y novedades en nuestro blog.`,
      type: 'website',
    }
  };
}

export default function BlogPage() {
  return <BlogClient />;
}