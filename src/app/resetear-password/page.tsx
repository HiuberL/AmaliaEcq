import { Metadata } from 'next';
import ResetearPasswordView from './ResetearPasswordClient';


export const metadata: Metadata = {    
    title: `Login | Ecuador | Amalia Ec`,
    description: `Página de inicio de sesión`,
    robots:{
      index: false,
      follow: false,
      nocache: true,
    }
}

export default function ResetearPasswordPage() {
  return <ResetearPasswordView />;
}