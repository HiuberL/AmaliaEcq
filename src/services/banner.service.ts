'use server'

import { readItems } from "@directus/sdk";
import { directusPublic } from "./directus.config";

const URL_ASSET = process.env.ASSETS_URL;

export const obtenerBanners = async () => {
    try {
        const banner = await directusPublic.request(
            readItems('Banner', {
                fields: [
                    'banner',
                    'boton'
                ],
                filter: {
                    activo: {
                        _eq: true
                    }
                }
            }),
        );
        const response = banner
            .filter(v => v.banner) // Filtrar elementos válidos
            .map(v => ({
                image_url: `${URL_ASSET}/${v.banner}.webp`,
                link_url: v.boton || null // Si existe el campo botón, lo asigna; si no, queda en null
            }));

        return response;
    } catch (error) {
        console.error("No se pueden obtener los banners: ", error);
    }
};