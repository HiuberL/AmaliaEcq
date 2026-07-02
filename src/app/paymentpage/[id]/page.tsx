import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import PaymentCliente from './PaymentCliente';
import { consultarCarritoCompleto } from '@/services/cart.service';

interface Props {
  params: Promise<{ id: string }>;
}

const getCarrito = cache(async (id: string) => {
  return await consultarCarritoCompleto(id);
});

// 🚀 1. METADATOS: Intentamos resolver rápido
export async function generateMetadata(): Promise<Metadata> {
  
  return {
    title: ' Página de Pago | Amalia Ec',
    description: '',
    robots:{
      index: false,
      follow: false,
      nocache: true,
    }
  };
}

export default async function PaymentPage({ params }: Props) {
  const { id } = await params;

  // Creamos un componente interno asíncrono para obligar al streaming a activarse
  return (
    <SuspenseData id={id} />
  );
}

// ⚡ Componente auxiliar que maneja la carga pesada asíncrona desvinculada de los metadatos
async function SuspenseData({ id }: { id: string }) {
  const carrito = await getCarrito(id);
  const info = Array.isArray(carrito) ? carrito[0] : carrito;
  if (!info || (info.estado !== 'N')) {

    notFound();
  }

  return <PaymentCliente carrito={info} id={id} />;
}