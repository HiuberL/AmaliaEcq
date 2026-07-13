import { useRef, useState } from "react";
export interface FormDataPay {
  idCliente: string;
  usarPuntos: boolean;
  nombre: string;
  apellido: string;
  correo: string;
  celular: string;
  identificacion: string;
  metodoEnvio: string;
  provincia: string;
  ciudad: string;
  sector: string;
  direccion: string;
  referencia: string;
  urlMapa: string;
  puntosUsados:number;
  puntosDisponibles: number,
  metodoPago: 'tarjeta' | 'transferencia';
}

export interface FormTransfer{
  cuentaSeleccionada: string;
  secuencia: string;
  imagen: string
}

export const usePaymentPageState = () => {
  const [paso, setPaso] = useState<number>(1);
  const [carrito, setCarrito] = useState<string>('');
  const [nombreArchivo, setNombreArchivo] = useState<any>(null);

  const [provincia,setProvincia] = useState<any>(null);
  const [ciudad,setCiudad] = useState<any>(null);
  const [sector,setSector] = useState<any>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const [metodoEnvio, setMetodoEnvio] = useState<any>(null);
  const [metodoPago, setMetodoPago] = useState<any>(null);
  const [payMethodReady, setPayMethodReady] = useState(false);
  const [infoPerson, setInfoPerson] = useState<FormDataPay>({
    idCliente: '',
    usarPuntos:false,
    puntosUsados: 0,
    nombre: '',
    apellido: '',
    correo: '',
    celular: '',
    identificacion: '',
    metodoEnvio: '71f045a5-36b6-484e-996e-dd3e69e3644b',
    puntosDisponibles: 0,
    provincia: '',
    ciudad: '',
    sector: '',
    direccion: '',
    referencia: '',
    urlMapa: '',
    metodoPago: 'transferencia'
  });
  const [formTransfer, setFormTransfer] = useState<FormTransfer>({
    cuentaSeleccionada: "",
    secuencia:"",
    imagen: ""
  });
  const [formData, setFormData] = useState<FormDataPay>({
    idCliente: '',
    usarPuntos:false,
    puntosUsados:0,
    nombre: '',
    apellido: '',
    correo: '',
    celular: '',
    identificacion: '',
    metodoEnvio: '71f045a5-36b6-484e-996e-dd3e69e3644b',
    puntosDisponibles: 0,
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
    payMethodReady, setPayMethodReady,
    carrito, setCarrito,
    infoPerson, setInfoPerson,
    provincia,setProvincia,
    ciudad,setCiudad,
    sector,setSector,
    formRef,
    metodoPago, setMetodoPago,
    formTransfer, setFormTransfer,
    nombreArchivo, setNombreArchivo
  }
}