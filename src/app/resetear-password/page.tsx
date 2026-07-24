import { Metadata } from 'next';
import ResetearPasswordView from './ResetearPasswordClient';


export const metadata: Metadata = {    
    title: `Resetear Password | Ecuador | Amalia Ec`,
    description: `Página para resetear password`,
    robots:{
      index: false,
      follow: false,
      nocache: true,
    }
}

export default function ResetearPasswordPage() {
  return <ResetearPasswordView />;
}