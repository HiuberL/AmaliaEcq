import { useCartHandler } from "./useCartHandler";
import { useLayoutContext } from "@/app/layoutContext";
import { useCartState } from "./useCartState";
import { useCartEffects } from "./useCartEffects";


export const useCart= (effectsActive: boolean=false) =>{

    const {
        setCartOpen
    } = useLayoutContext();
    const state = useCartState();
    const handler = useCartHandler(setCartOpen,state);
    if(effectsActive){
        const effects = useCartEffects(handler,state);
    }        
    return {
        onSelectCart: handler.handlerConsultCarrito,
        onAddCart: handler.handlerAddCarrito,
        onUpdateCart: handler.handlerUpdateCarrito,
        loading: state.loading,
        carrito:state.carrito,
        onChangeValue: handler.handleCambiarCantidad,
        onGoPagePayment: handler.handlerGoPagePayment,
        onChargeInformation: handler.cargarInformacion
    }
};