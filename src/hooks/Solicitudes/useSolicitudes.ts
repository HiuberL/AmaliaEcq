import { useSolicitudesEffects } from "./useSolicitudesEffects";
import { useSolicitudesHandler } from "./useSolicitudesHandler";
import { useSolicitudesState } from "./useSolicitudesState";


export const useSolicitudes = () => {
    const state = useSolicitudesState();
    const handler = useSolicitudesHandler(state);
    useSolicitudesEffects(state);
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
        idCliente: state.idCliente
    }
}