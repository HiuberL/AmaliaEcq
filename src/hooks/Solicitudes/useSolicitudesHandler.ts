import { useState } from "react";
import { useSolicitudesState } from "./useSolicitudesState";
import { guardarSolicitudCliente } from "@/services/solicitudes.service";
export const useSolicitudesHandler = (
  state: ReturnType<typeof useSolicitudesState>
) => {
  const {
    nombre, setNombre,
    apellido, setApellido,
    telefono, setTelefono,
    email, setEmail,
    mensaje, setMensaje,
    idCliente,
    setEnviando,
    setEstadoEnvio
  } = state;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setEstadoEnvio(null);

    // --- VALIDACIÓN CON ID CLIENTE ---
    if (idCliente) {
      if (!mensaje) {
        const errorMsg = 'Por favor, llena los campos mandatorios (Mensaje).';
        setEstadoEnvio({ exito: false, msg: errorMsg });
        setEnviando(false);
        window.showAlert(errorMsg, "ERROR"); // 👈 Mensaje directo
        return;
      }
    } else {
      // --- VALIDACIÓN SIN ID CLIENTE ---
      if (!nombre || !email || !mensaje || !telefono) {
        const errorMsg = 'Por favor, llena los campos mandatorios (Nombre, Email, telefono y Mensaje).';
        setEstadoEnvio({ exito: false, msg: errorMsg });
        setEnviando(false);
        window.showAlert(errorMsg, "ERROR"); // 👈 Mensaje directo
        return;
      }
    }

    try {
      const request = {
        nombres: nombre,
        apellidos: apellido,
        telefono: telefono,
        correo: email,
        solicitud: mensaje
      };

      const returnResult = await guardarSolicitudCliente(request, idCliente);
      
      if (returnResult) {
        const okMsg = 'Tu solicitud ha sido recibida con éxito. Un asesor de Amalia se pondrá en contacto contigo muy pronto.';
        setEstadoEnvio({ exito: true, msg: okMsg });
        window.showAlert(okMsg, "INFO"); // 👈 Mensaje directo
        
        // Limpiamos inputs únicamente en caso de éxito
        setNombre('');
        setApellido('');
        setEmail('');
        setTelefono('');
        setMensaje('');
      } else {
        const failMsg = 'Tu solicitud no se ha podido enviar, inténtalo de nuevo en breve.';
        setEstadoEnvio({ exito: false, msg: failMsg });
        window.showAlert(failMsg, "WARNING"); // 👈 Mensaje directo
      }

    } catch (error: any) {
      console.error('Error al insertar la solicitud en Directus:', error);
      const catchMsg = error?.message || 'Hubo un inconveniente al procesar tu solicitud. Por favor, intenta de nuevo o escríbenos por WhatsApp.';
      setEstadoEnvio({ exito: false, msg: catchMsg });
      window.showAlert(catchMsg, "ERROR"); // 👈 Mensaje directo
    } finally {
      setEnviando(false);
    }
  };

  return {
    handleSubmit
  };
};