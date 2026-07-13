import { Metadata } from 'next';
import LoginClient from './LoginCliente';


export const metadata: Metadata = {    
    title: `Productos Originales | Ecuador | Amalia Ec`,
    description: `Página de inicio de sesión`,
    robots:{
      index: false,
      follow: false,
      nocache: true,
    }
}

export default function SolicitudPage() {
  return <LoginClient />;
}