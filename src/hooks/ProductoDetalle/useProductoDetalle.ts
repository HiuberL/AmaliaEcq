import { useProductoDetalleHandler } from "./useProductoDetalleHandler";
import { useProductoDetalleState } from "./useProductoDetalleState";


export const useProductoDetalle = (slug: string) => {
    const state = useProductoDetalleState(slug);
    const handler = useProductoDetalleHandler(state);
    return{
        varianteSeleccionada: state.varianteSeleccionada, 
        setVarianteSeleccionada: state.setVarianteSeleccionada,
        imagenActiva: state.imagenActiva, 
        setImagenActiva: state.setImagenActiva,
        cantidad: state.cantidad, 
        setCantidad: state.setCantidad,
        pestanaAbierta: state.pestanaAbierta, 
        setPestanaAbierta: state.setPestanaAbierta,
        togglePestana: handler.togglePestana
    }
}