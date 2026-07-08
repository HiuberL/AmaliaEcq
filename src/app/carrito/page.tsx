import { Metadata } from 'next';
import CarritoClient from './CarritoClient';


export const metadata: Metadata = {    
    title: `Productos Originales | Ecuador | Amalia Ec`,
    description: `Estamos listos y escuchamos atentamente tus solicitudes, en esta sección puedes solicitar cotizaciones, enviarnos comentarios o mensajes`,
    robots:{
      index: false,
      follow: false,
      nocache: true,
    }
}

export default function CarritoPage() {
  return <CarritoClient />;
}