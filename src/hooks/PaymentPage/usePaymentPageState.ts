import { useState } from "react";
interface FormData {
  idCliente: string;
  usarPuntos: boolean;
  nombre: string;
  apellido: string;
  correo: string;
  celular: string;
  identificacion: string;
  metodoEnvio: 'retiro' | 'domicilio';
  provincia: string;
  ciudad: string;
  sector: string;
  direccion: string;
  referencia: string;
  urlMapa: string;
  metodoPago: 'tarjeta' | 'transferencia';
}

export const usePaymentPageState = () => {
  const [paso, setPaso] = useState<number>(1);
  const [carrito, setCarrito] = useState<string>('');
  const [metodoEnvio, setMetodoEnvio] = useState<any>(null);
  const [payPhoneReady, setPayPhoneReady] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    idCliente: '',
    usarPuntos:false,
    nombre: '',
    apellido: '',
    correo: '',
    celular: '',
    identificacion: '',
    metodoEnvio: 'retiro',
    provincia: '',
    ciudad: '',
    sector: '',
    direccion: '',
    referencia: '',
    urlMapa: '',
    metodoPago: 'transferencia'
  });

  return {
    paso, setPaso,
    formData, setFormData,
    metodoEnvio,setMetodoEnvio,
    payPhoneReady, setPayPhoneReady,
    carrito, setCarrito
  }
}