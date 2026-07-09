import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';
import PoliticaDetalleCliente from './PoliticaDetalleCliente'; // Asegúrate de que PoliticaDetalleCliente use "export default"
import { consultPoliticasBySlug } from '@/services/politica.service';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

const getPoliticaSecure = cache(async (slug: string) => {
  return await consultPoliticasBySlug(slug);
});

// 🚀 1. METADATOS
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const politica = await getPoliticaSecure(slug);

  const info = Array.isArray(politica) ? politica[0] : politica;

  if (!info) {
    return { title: 'Política no encontrada | AmaliaEc' };
  }

  return {
    title: info.meta_title ? `${info.meta_title} | AmaliaEc` : `${info.titulo || 'Política'} | Amalia`,
    description: info.meta_description || '',
  };
}

// 📦 2. COMPONENTE PRINCIPAL
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const politica = await getPoliticaSecure(slug);
  const info = Array.isArray(politica) ? politica[0] : politica;

  if (!info) {
    notFound();
  }

  return (
  <Suspense>
    <PoliticaDetalleCliente politica={info} />
  </Suspense>  
  );
}