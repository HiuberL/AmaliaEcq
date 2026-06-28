import { useEffect } from "react";
import { useEspacioHandler } from "./useEspacioHandler";
import { useEspacioState } from "./useEspacioState";

export const useEspacioEffects = (
    handler: ReturnType<typeof useEspacioHandler>,
    state: ReturnType<typeof useEspacioState>
) => {
    const {
        handleConsultInformacion
    } = handler;

    const{
        cliente,
        setCliente,
        setLocations
    }=state;

  useEffect(() => {
    if (cliente?.direcciones && Array.isArray(cliente.direcciones)) {
      const direccionesMapeadas = cliente.direcciones.map((dir:any) => ({
        id: dir.id, // ID primario de la tabla en Directus
        ciudad: dir.ciudad,
        sector: dir.sector,
        direccion: dir.direccion,
        isPreferred: dir.preferencia === true // Mapeamos el booleano de Directus
      }));
      setLocations(direccionesMapeadas);
    }
  }, [cliente?.direcciones]);    
  
    useEffect(() => {
        const constultarInformacion= async ()=>{
            const response = await handleConsultInformacion();
            setCliente(response);
        }
        constultarInformacion();
    }, []); // <-- Obligatorio pasar pathname aquí para que reaccione al cambiar de página

}