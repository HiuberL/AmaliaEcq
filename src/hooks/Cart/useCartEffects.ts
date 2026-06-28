import { useEffect } from "react";
import { useCartHandler } from "./useCartHandler";

export const useCartEffects = (
    handler: ReturnType<typeof useCartHandler>
) => {
    const {
        cargarInformacion
    } = handler;
    useEffect(() => {
        cargarInformacion();
    }, []);
}