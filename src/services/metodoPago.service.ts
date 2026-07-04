'use server'

import { readItems } from "@directus/sdk";
import { directusPrivate } from "./directus.config"



export const consultarMetodosPago = async () => {
    try {
        const metodoPago = await directusPrivate.request(readItems('metodo_pago', {
            fields: [
                'logo',
                'banco',
                'informacion',
                'cuenta'
            ]
        }
        ));
        return metodoPago;
    } catch (e) {
        throw new Error((e as Error).message);
    }
}
