import { useCartHandler } from "./useCartHandler";
import { useLayoutContext } from "@/app/layoutContext";
import { useCartState } from "./useCartState";
import { useCartEffects } from "./useCartEffects";


export const useCart= () =>{

    const {
        setCartOpen
    } = useLayoutContext();
    const state = useCartState();
    const handler = useCartHandler(setCartOpen,state);
    const effects = useCartEffects(handler)
    return {
        onSelectCart: handler.handlerConsultCarrito,
        onAddCart: handler.handlerAddCarrito,
        onUpdateCart: handler.handlerUpdateCarrito,
        loading: state.loading,
        carrito:state.carrito,
        onChangeValue: handler.handleCambiarCantidad,
        onGoPagePayment: handler.handlerGoPagePayment
    }
};