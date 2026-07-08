import { useJuegaGanaEffects } from "./useJuegaGanaEffects";
import { useJuegaGanaHandler } from "./useJuegaGanaHandler";
import { useJuegaGanaState } from "./useJuegaGanaState";



export const useJuegaGana = () => {
    const state = useJuegaGanaState();
    const handler = useJuegaGanaHandler(state);
    useJuegaGanaEffects(state,handler);

    return { 
        ...state, 
        ...handler 
    };
}