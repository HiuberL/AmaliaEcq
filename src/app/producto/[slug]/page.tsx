import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import ProductoDetalleClient from './ProductoDetalleCliente';
import { consultProductoEspecifico } from '@/services/producto.service';

interface Props {
  params: Promise<{ slug: string }>;
}

const getProductoSeguro = cache(async (slug: string) => {
  return await consultProductoEspecifico(slug);
});

// 🚀 1. METADATOS: Intentamos resolver rápido
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producto = await getProductoSeguro(slug);
  
  // Si no encuentra el elemento en el array base devuelto por consultProductoEspecifico
  const info = Array.isArray(producto) ? producto[0] : producto;
  
  if (!info || !info.activo) {
    return { title: 'Producto no encontrado | Ecuador | Amalia Ec' };
  }

  const title = `${info.meta_title || info.nombre} | Ecuador | Amalia Ec`;
  const description = info.meta_description || `Descubre ${info.nombre} de la marca ${info.marca}.`;

  // 🖼️ URL armada que viene del producto (o una por defecto si viene vacía)
  const imageUrl = info.imagen;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.amaliaecq.com/productos/${slug}`,
      siteName: 'Amalia Ec',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: info.nombre,
        },
      ],
      locale: 'es_EC',
      type: 'website',
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
  const producto = await getProductoSeguro(slug);
  const info = Array.isArray(producto) ? producto[0] : producto;

  if (!info || !info.activo) {
    notFound();
  }

  return <ProductoDetalleClient product={info} />;
}