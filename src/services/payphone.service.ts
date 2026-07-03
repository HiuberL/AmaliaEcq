'use server'

import { uuidToNumberFecha } from "@/utils/cryptoInfo.utils";

const TOKEN_PAYPHONE = process.env.API_PAYPHONE_TOKEN;
const STOREID_PAYPHONE = process.env.API_PAYPHONE_STOREID;

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