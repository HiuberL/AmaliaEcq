import { consultProductoEspecifico } from "@/services/producto.service";
import { useProductoDetalleState } from "./useProductoDetalleState";


export const useProductoDetalleHandler = (
    state: ReturnType<typeof useProductoDetalleState>
) => {
    const {
        setPestanaAbierta,
        pestanaAbierta
    }=state;
    const togglePestana = (id: string) => {
        setPestanaAbierta(pestanaAbierta === id ? null : id);
    };

    return{
        togglePestana
    }
};