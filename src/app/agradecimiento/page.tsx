// app/tienda/[categoria]/page.tsx (Server Component)
import { Metadata } from 'next';
import RootLayout from '../layout';
import InicioClient from './AgradecimientoClient';
import AgradecimientoClient from './AgradecimientoClient';


export async function generateMetadata(): Promise<Metadata> {
  
  return {
    title: 'Página de Agradecimiento | Amalia Ec',
    description: '',
    robots:{
      index: false,
      follow: false,
      nocache: true,
    }
  };
}

export default function AgradecimientoPage() {
  return <AgradecimientoClient />;
}