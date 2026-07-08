import { useEffect } from "react";
import { useCartHandler } from "./useCartHandler";
import { useCartState } from "./useCartState";

export const useCartEffects = (
    handler: ReturnType<typeof useCartHandler>,
    state: ReturnType<typeof useCartState>
) => {
    const{
        carrito,
        loading
    }=state;
    const {
        cargarInformacion,
    } = handler;
    useEffect(() => {
        if(carrito) return; 
        cargarInformacion();
    }, [carrito]);
}