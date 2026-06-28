import { Metadata } from 'next';
import ProfilePage from './EspacioCliente';


export const generateMetadata: Metadata = {    
    title: `Mi espacio | Ecuador | Amalia Ec`,
    description: `Entendemos que tengas muchas preguntas, por eso recopilamos todas las preguntas que nos han realizado para tu facilidad.`,
    openGraph: {
      title: `Mi espacio | Ecuador | Amalia Ec`,
      description: `Entendemos que tengas muchas preguntas, por eso recopilamos todas las preguntas que nos han realizado para tu facilidad.`,
      type: 'website',
    }
}

export default function FaqPage() {
  return <ProfilePage />;
}