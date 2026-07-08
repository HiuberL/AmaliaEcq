import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { consultBlogBySlug } from '@/services/blog.service';
import PoliticaDetalleCliente from './PoliticaDetalleCliente';
import { consultPoliticasBySlug } from '@/services/politica.service';

interface Props {
  params: Promise<{ slug: string }>;
}

const getPoliticaSecure = cache(async (slug: string) => {
  return await consultPoliticasBySlug(slug);
});

// 🚀 1. METADATOS: Intentamos resolver rápido
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const politica = await getPoliticaSecure(slug);
  
  // Si no encuentra el elemento en el array base devuelto por consultProductoEspecifico
  const info = Array.isArray(politica) ? politica[0] : politica;
  
  if (!info) {
    return { title: 'Política no encontrada | AmaliaEc' };
  }

  return {
    title: `${info.meta_title} | AmaliaEc` || `${info.titulo} | Amalia`,
    description: info.meta_description,
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
  const politica = await getPoliticaSecure(slug);
  const info = Array.isArray(politica) ? politica[0] : politica;
  if (!info) {
    notFound();
  }

  return <PoliticaDetalleCliente politica={info} />;
}