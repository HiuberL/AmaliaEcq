import { useState } from "react";
import { guardarSolicitudCliente } from "@/services/solicitudes.service";
import { useCitasState } from "./useCitasState";
import { guardarCitaCliente } from "@/services/citas.service";

export const useCitasHandler = (
  state: ReturnType<typeof useCitasState>
) => {
  const {
    nombre, setNombre,
    apellido, setApellido,
    telefono, setTelefono,
    email, setEmail,
    tipo, setTipo,
    dia, setDia,
    hora, setHora,
    enviando, setEnviando,
    idCliente,
    mensaje, setMensaje,
    estadoEnvio, setEstadoEnvio
  } = state;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setEstadoEnvio(null);

    // Validación básica
    if (idCliente){
      if (!tipo) {
        const errorMsg = 'Por favor, llena los campos mandatorios tipo'
        setEstadoEnvio({ exito: false, msg: errorMsg });
        setEnviando(false);
        window.showAlert(errorMsg,"ERROR");
        return;
      }
    }else{
      if ((!nombre || !apellido || !telefono || !email || !tipo)) {
        const errorMsg = 'Por favor, llena los campos mandatorios (Nombre, apellido, Email, telefono y tipo).'
        setEstadoEnvio({ exito: false, msg: errorMsg });
        setEnviando(false);
        window.showAlert(errorMsg,"ERROR");
        return;
      }
    }

    try {
      // Mandamos la data directamente a la tabla intermedia de Directus
      const request = {
        nombres: nombre,
        apellidos: apellido,
        telefono: telefono,
        correo: email,
        solicitud: mensaje,
        dia: dia,
        hora: hora,
        tipo:tipo
      }

      const returnResult = await guardarCitaCliente(request,idCliente);
      let okMsg = 'Tu solicitud ha sido recibida con éxito. Un asesor de Amalia se pondrá en contacto contigo muy pronto.';

      if (returnResult) {
        setEstadoEnvio({
          exito: true,
          msg: okMsg
        });

      window.showAlert(okMsg,"INFO");

      // Limpiamos los inputs si todo sale bien
      setNombre('');
      setApellido('');
      setEmail('');
      setTelefono('');
      setMensaje('');
      setHora('');
      setTipo('');
      setDia('');
    }else {
        okMsg = 'Tu solicitud no se ha podido enviar, inténtalo denuevo en breve.' 
        setEstadoEnvio({
          exito: false,
          msg: okMsg
        });
        window.showAlert(okMsg, "WARNING");

      }
    } catch (error) {
      console.error('Error al insertar la solicitud en Directus:', error);
      setEstadoEnvio({
        exito: false,
        msg: 'Hubo un inconveniente al procesar tu solicitud. Por favor, intenta de nuevo o escríbenos por WhatsApp.'
      });
      window.showAlert(estadoEnvio?.msg || '',"ERROR");
    } finally {
      setEnviando(false);
    }
  };
  return{
    handleSubmit
  }
}