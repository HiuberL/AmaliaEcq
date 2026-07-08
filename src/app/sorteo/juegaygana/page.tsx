import { Metadata } from 'next';
import JuegaGanaCliente from './JuegaGanaClient';


export const metadata: Metadata = {    
    title: `Juega y Gana | Ecuador | Amalia Ec`,
    description: `En Amalia premiamos tu confianza y lealtad, por eso te invitamos a participar en nuestro sorteo "Juega y Gana" y tener la oportunidad de ganar increíbles premios`,
    openGraph: {
      title: `Juega y Gana | Ecuador | Amalia Ec`,
      description: `En Amalia premiamos tu confianza y lealtad, por eso te invitamos a participar en nuestro sorteo "Juega y Gana" y tener la oportunidad de ganar increíbles premios`,
      type: 'website',
    }
}

export default function SolicitudPage() {
  return <JuegaGanaCliente />;
}