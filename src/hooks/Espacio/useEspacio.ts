import { useEspacioEffects } from "./useEspacioEffects";
import { useEspacioHandler } from "./useEspacioHandler";
import { useEspacioState } from "./useEspacioState";


export const useEspacio = () => {
    const state = useEspacioState();
    const handler = useEspacioHandler(state);
    const effect = useEspacioEffects (handler,state);

    return{
        cliente: state.cliente,
        formatearFecha: handler.formatearFecha,
        formatearPuntos: handler.formatearPuntos,
        activeSidebar: state.activeSidebar, 
        setActiveSidebar: state.setActiveSidebar,
        activeTab: state.activeTab, 
        setActiveTab:state.setActiveTab,
        locations: state.locations, 
        setLocations: state.setLocations,
        handleSetPreferred: handler.handleSetPreferred
    }
}