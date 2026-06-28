import { Metadata } from 'next';
import SolicitudesClient from './SolicitudesClient';


export const generateMetadata: Metadata = {    
    title: `Productos Originales | Ecuador | Amalia Ec`,
    description: `Estamos listos y escuchamos atentamente tus solicitudes, en esta sección puedes solicitar cotizaciones, enviarnos comentarios o mensajes`,
    openGraph: {
      title: `Productos Originales | Ecuador | Amalia Ec`,
      description: `Estamos listos y escuchamos atentamente tus solicitudes, en esta sección puedes solicitar cotizaciones, enviarnos comentarios o mensajes`,
      type: 'website',
    }
}

export default function SolicitudPage() {
  return <SolicitudesClient />;
}