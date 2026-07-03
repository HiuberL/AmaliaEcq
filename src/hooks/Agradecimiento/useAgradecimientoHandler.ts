import { useState } from "react";
import { useAgradecimientoState } from "./useAgradecimientoState";
import { confirmPayment } from "@/services/payphone.service";
import { obtenerPedidoCompleto } from "@/services/pedidos.service";



export const useAgradecimientoHandler = (
    state: ReturnType<typeof useAgradecimientoState>
) => {
    const {
        idPay,
        transactionId,
        loading,
        setLoading,
        setError,
        setPedido,
        ejecutado,
        setPaymentResponse
    } = state;

    const procesarPostPago = async () => {
        try {
            const uuidPedido = transactionId.split("-")[0].trim();
            const pedido = await obtenerPedidoCompleto(uuidPedido);
            console.log("Pedido obtenido:", pedido);
            setPedido(pedido);
            if (pedido.formaPago === 'TARJETA'){
                if(ejecutado.current) return;
                const response = await confirmPayment(idPay, transactionId);
                ejecutado.current = true;
                setPaymentResponse(response);
            }else{
                setPaymentResponse({
                    cardBrand: 'TRANSFERENCIA',
                    cardType: '',
                    deferredMessage: '',
                    statusCode: 0,
                    message: 'En proceso de revisión',
                })
            }
        } catch (err: any) {
            setError(err.message || "Error procesando el flujo de agradecimiento.");
        } finally {
            setLoading(false);
        }

    };

    return {
        procesarPostPago
    }
}