import { useEffect } from "react";
import { useJuegaGanaState } from "./useJuegaGanaState";
import { useJuegaGanaHandler } from "./useJuegaGanaHandler";



export const useJuegaGanaEffects = (
    state: ReturnType<typeof useJuegaGanaState>,
    handler: ReturnType<typeof useJuegaGanaHandler>
) => {
    const{
        setMounted,
        setLoading
    }= state;
    const{
        handleConsultInformacion
    }= handler;
    useEffect(() => {
        setLoading(true);
        setMounted(true);
        handleConsultInformacion();
        setLoading(false);
    }, []);
}