import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';
import { consultBlogBySlug } from '@/services/blog.service';
import BlogDetalleCliente from './BlogDetalleCliente';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

const getBlogSecure = cache(async (slug: string) => {
  return await consultBlogBySlug(slug);
});

// 🚀 1. METADATOS: Intentamos resolver rápido
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogSecure(slug);

  // Si no encuentra el elemento en el array base devuelto por consultProductoEspecifico
  const info = Array.isArray(blog) ? blog[0] : blog;

  if (!info) {
    return { title: 'Blog no encontrado | Ecuador | Amalia Ec' };
  }

  return {
    title: `${info.meta_title || info.titulo} | Ecuador | Amalia Ec`,
    description: info.meta_description || `En amalia también reseñamos por esta razón tenemos mucha información para ti`,
  };
}

// 📦 2. COMPONENTE PRINCIPAL (Ruta del Servidor)
export default async function Page({ params }: Props) {
  const { slug } = await params;

  // Creamos un componente interno asíncrono para obligar al streaming a activarse
  return (
    <SuspenseData slug={slug} />
  );
}

// ⚡ Componente auxiliar que maneja la carga pesada asíncrona desvinculada de los metadatos
async function SuspenseData({ slug }: { slug: string }) {
  const blog = await getBlogSecure(slug);
  const info = Array.isArray(blog) ? blog[0] : blog;
  if (!info) {
    notFound();
  }

  return (
    <Suspense>
      <BlogDetalleCliente blog={info} />
    </Suspense>

  );
}