import { useState } from "react";
import { useAgradecimientoState } from "./useAgradecimientoState";



export const useAgradecimientoHandler = (
    state: ReturnType<typeof useAgradecimientoState>
) => {
    const {
        idPay,
        transactionId,
        loading,
        setLoading,
        setError
    } = state;

    const procesarPostPago = async () => {
        try {
            const resApiX = await fetch('/api/confirmar-api-x', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idPay, transactionId })
            });

            if (!resApiX.ok) throw new Error('Falló la confirmación en la API X');

            // Tarea 2: Actualizar el pedido a pagado (en tu Directus o BD)
            const resDirectus = await fetch('/api/actualizar-pedido-pagado', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idPay, status: 'pagado' })
            });

            if (!resDirectus.ok) throw new Error('Falló la actualización del pedido en la base de datos');

            setLoading(false);
        } catch (err: any) {
            setError(err.message || "Ocurrió un error al procesar el pago.");
            setLoading(false);
        }
    };

    return {
        procesarPostPago
    }
}