import { useEffect, useRef } from "react"; // 1. Importamos useRef
import { useAgradecimientoHandler } from "./useAgradecimientoHandler";
import { useAgradecimientoState } from "./useAgradecimientoState";
import { obtenerPedidoCompleto } from "@/services/pedidos.service";

export const useAgradecimientoEffects = (
    state: ReturnType<typeof useAgradecimientoState>,
    handler: ReturnType<typeof useAgradecimientoHandler>
) => {
    const {
        idPay,
        transactionId,
        loading, // Traemos loading para validar
        setError,
        setLoading,
        setPedido,
    } = state;

    const { procesarPostPago } = handler;
    

    useEffect(() => {
        if (!idPay || !transactionId) {
            setError("Faltan parámetros en la URL para procesar el pago.");
            setLoading(false);
            return;
        }
        const initPay = async()=>{
            await procesarPostPago();
        }
        initPay();

    }, [idPay, transactionId]); 
};