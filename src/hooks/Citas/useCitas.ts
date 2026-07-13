import { useCitasEffects } from "./useCitasEffects";
import { useCitasHandler } from "./useCitasHandler";
import { useCitasState } from "./useCitasState";


export const useCitas = () => {
    const state = useCitasState();
    const handler = useCitasHandler(state);
    const effect = useCitasEffects(state);

    return{
        handleSubmit: handler.handleSubmit,
        nombre: state.nombre, 
        setNombre: state.setNombre,
        apellido: state.apellido, 
        setApellido: state.setApellido,
        telefono: state.telefono, 
        setTelefono: state.setTelefono,
        email: state.email, 
        setEmail: state.setEmail,
        mensaje: state.mensaje, 
        setMensaje: state.setMensaje,
        enviando: state.enviando, 
        setEnviando: state.setEnviando,
        estadoEnvio: state.estadoEnvio, 
        setEstadoEnvio: state.setEstadoEnvio,
        tipo: state.tipo,
        setTipo: state.setTipo,
        hora: state.hora,
        setHora: state.setHora,
        dia: state.dia,
        setDia: state.setDia,
        citasActivas: state.citasActivas,
        idCliente: state.idCliente
    }
}