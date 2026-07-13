import { Metadata } from 'next';
import ProfilePage from './EspacioCliente';


export const metadata: Metadata = {    
    title: `Mi espacio | Ecuador | Amalia Ec`,
    description: `Entendemos que tengas muchas preguntas, por eso recopilamos todas las preguntas que nos han realizado para tu facilidad.`,
    robots:{
      index: false,
      follow: false,
      nocache: true,
    }
}

export default function FaqPage() {
  return <ProfilePage />;
}