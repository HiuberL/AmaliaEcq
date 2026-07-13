import { Metadata } from 'next';
import AgradecimientoClient from './AgradecimientoClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata : Metadata  = {
    title: 'Página de Agradecimiento | Ecuador | Amalia Ec',
    description: 'Aquí podras revisar si tu pedido fue completado o tiene problemas, recuerda siempre contactarnos',
    robots:{
      index: false,
      follow: false,
      nocache: true,
    }
}

export default function AgradecimientoPage() {
return (
    <Suspense fallback={null}>
      <AgradecimientoClient />
    </Suspense>
  );
}