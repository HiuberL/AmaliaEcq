import { useEffect } from "react";
import { useAgradecimientoHandler } from "./useAgradecimientoHandler";
import { useAgradecimientoState } from "./useAgradecimientoState";



export const useAgradecimientoEffects = (
    state: ReturnType <typeof useAgradecimientoState>,
    handler: ReturnType <typeof useAgradecimientoHandler>
) => {
    const{
        idPay,
        transactionId,
        setError,
        setLoading
    }=state;

    const {
        procesarPostPago
    }= handler;
    useEffect(() => {
        if (!idPay || !transactionId) {
            setError("Faltan parámetros en la URL para procesar el pago.");
            setLoading(false);
            return;
        }
        const init = async () => {
            await procesarPostPago();

        }
    init();
    }, [idPay, transactionId]); // Se ejecuta solo cuando los parámetros están listos

}