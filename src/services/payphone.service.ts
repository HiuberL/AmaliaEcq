'use server'

import { uuidToNumberFecha } from "@/utils/cryptoInfo.utils";
import { payphoneClient } from "./clientes.api";

const TOKEN_PAYPHONE = process.env.API_PAYPHONE_TOKEN;
const STOREID_PAYPHONE = process.env.API_PAYPHONE_STOREID;
const API_PAYPHONE_CONFIRM = process.env.API_PAYPHONE_CONFIRM || '';

export const bodyPayphonePay = async (totalPagar:number,carrito:string, reference:string) => {
    return {
            token: TOKEN_PAYPHONE,
            clientTransactionId: uuidToNumberFecha(carrito),
            amount: totalPagar * 100,
            amountWithoutTax: totalPagar * 100,
            amountWithTax: 0,
            tax: 0,
            service: 0,
            tip: 0,
            currency: "USD",
            storeId: STOREID_PAYPHONE,
            reference: reference,
            lang: "es",
    }
}

export const confirmPayment = async (id: string, transaction: string) => {
    try {
        const idNumero = parseInt(id, 10);

        if (isNaN(idNumero)) {
            throw new Error("El ID de pago no es un número válido.");
        }

        const response = await payphoneClient.post(API_PAYPHONE_CONFIRM, {
            id: idNumero,
            clientTxId: transaction
        });
        return {
            provider: 'PAYPHONE',
            cardBrand: response.data.cardBrand,
            cardType: response.data.cardType,
            deferredMessage: response.data.deferredMessage,
            transactionId: response.data.transactionId,
            statusCode:response.data.statusCode,
            amount: Number(response.data.amount) / 100,
            message: response.data.message,
        };

    } catch (error: any) {
        console.error("Error confirmando pago en servidor:", error.response?.data || error.message);
        return { 
            error: true, 
            message: error.response?.data?.message || error.message || "Error en la pasarela" 
        };
    }
}