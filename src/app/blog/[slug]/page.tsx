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

  const title = `${info.meta_title || info.titulo} | Ecuador | Amalia Ec`;
  const description =
    info.meta_description ||
    `En Amalia también reseñamos, por esta razón tenemos mucha información para ti.`;

  // 🖼️ URL armada usando el campo 'imagen_principal' (o una por defecto)
  const imageUrl = info.imagen_principal;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.amaliaecq.com/blog/${slug}`,
      siteName: 'Amalia Ec',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: info.titulo,
        },
      ],
      locale: 'es_EC',
      type: 'article', // Cambio clave para contenido de tipo blog/artículo
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
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