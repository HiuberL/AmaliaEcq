import { useState } from "react";

export const useSolicitudesState = () => {
  const [idCliente, setIdCliente] = useState<string | null>('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [estadoEnvio, setEstadoEnvio] = useState<{ exito: boolean; msg: string } | null>(null);


    return{
        nombre, setNombre,
        apellido, setApellido,
        telefono, setTelefono,
        email, setEmail,
        mensaje, setMensaje,
        enviando, setEnviando,
        estadoEnvio, setEstadoEnvio,
        idCliente, setIdCliente
    }
}