import { useState } from "react";

export const useCitasState = () => {
  const [idCliente, setIdCliente] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] = useState('');
  const [dia, setDia] = useState('');
  const [hora, setHora] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [citasActivas,setCitasActivas] = useState<any[]>();
  const [estadoEnvio, setEstadoEnvio] = useState<{ exito: boolean; msg: string } | null>(null);


    return{
        nombre, setNombre,
        apellido, setApellido,
        telefono, setTelefono,
        email, setEmail,
        tipo, setTipo,
        dia, setDia,
        hora, setHora,
        enviando, setEnviando,
        estadoEnvio, setEstadoEnvio,
        mensaje, setMensaje,
        idCliente, setIdCliente,
        citasActivas,setCitasActivas
    }
}