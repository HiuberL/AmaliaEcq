import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { obtenerPedidoCompletoById } from '@/services/pedidos.service';
import PosPaymentCliente from './PosPaymentCliente';

interface Props {
  params: Promise<{ id: string }>;
}

const getPedido = cache(async (id: string) => {
  return await obtenerPedidoCompletoById(id);
});

// 🚀 1. METADATOS: Intentamos resolver rápido
export async function generateMetadata(): Promise<Metadata> {
  
  return {
    title: ' Página de Pago POS | Amalia Ec',
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

async function SuspenseData({ id }: { id: string }) {
  const pedido = await getPedido(id);
  const info = Array.isArray(pedido) ? pedido[0] : pedido;
  if (!info) {
    notFound();
  }

  return <PosPaymentCliente pedido={info} id={id} />;
}