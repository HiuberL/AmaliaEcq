import { Metadata } from 'next';
import FaqClient from './FaqClient';


export const generateMetadata: Metadata = {    
    title: `Productos Originales | Ecuador | Amalia Ec`,
    description: `Entendemos que tengas muchas preguntas, por eso recopilamos todas las preguntas que nos han realizado para tu facilidad.`,
    openGraph: {
      title: `Productos Originales | Ecuador | Amalia Ec`,
      description: `Entendemos que tengas muchas preguntas, por eso recopilamos todas las preguntas que nos han realizado para tu facilidad.`,
      type: 'website',
    }
}

export default function FaqPage() {
  return <FaqClient />;
}