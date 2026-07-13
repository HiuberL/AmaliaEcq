import { useState } from "react";
import { useAgradecimientoState } from "./useAgradecimientoState";
import { confirmPayment } from "@/services/payphone.service";
import { obtenerPedidoCompleto, pagarPedido } from "@/services/pedidos.service";
import { removeSessionCookie } from "@/utils/cookies.utils";



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
        setPaymentResponse,
        paymentResponse,
        notFound, setNotFound
    } = state;

    const procesarPostPago = async () => {
        try {
            await removeSessionCookie('guest_cart_id');
            const uuidPedido = transactionId.split("-")[0].trim();
            const pedido = await obtenerPedidoCompleto(uuidPedido);
            let response;
            setPedido(pedido);
            if(pedido.estado === 'CREADO'){
                if (pedido.formaPago === 'TARJETA'){
                    response = await confirmPayment(idPay, transactionId);
                }else{
                    response = {
                        provider: 'C2C',
                        cardBrand: 'TRANSFERENCIA',
                        cardType: '',
                        deferredMessage: '',
                        statusCode: 0,
                        amount: 0,
                        transactionId:'', //secuencial
                        message: 'En proceso de revisión',
                    }
                }
                setPaymentResponse(response);
                await pagarPedido(pedido.id,response);
            }else{
                const respuestaEstado = {
                    ...pedido.pagoUltimo,
                    amount: pedido.pagoTotal
                }
                setPaymentResponse(respuestaEstado);
            }
        } catch (err: any) {
            const errorMessage = err.message || "Error procesando el flujo de agradecimiento.";
            setError(errorMessage);
            const response = {
                    provider: 'Ninguno',
                    cardBrand: 'No encontrado',
                    cardType: '',
                    deferredMessage: '',
                    statusCode: 99,
                    amount: 0,
                    transactionId:'', //secuencial
                    message: 'Contacta con la tienda, posiblemente el pedido no se ha generado o fue eliminado.',
                }                
                setPaymentResponse(response);                    
                setNotFound(true);
                setLoading(false);
                return;            
            window.showAlert(errorMessage, 'ERROR');
        } finally {
            setLoading(false);
        }

    };

    return {
        procesarPostPago
    }
}