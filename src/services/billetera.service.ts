'use server'

import { directusClientFlow } from "./clientes.api";


const URLGAME = process.env.API_DIRECTUS_LOGIC_GAME || '';
export const obtenerRespuestaJuego = async (body:any) => {
    const response = await directusClientFlow.post( URLGAME, body);
    return response.data ;
}