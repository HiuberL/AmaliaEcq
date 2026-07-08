'use server'

import { readItems } from "@directus/sdk";
import { directusPublic } from "./directus.config";


export const consultPoliticasBySlug = async (slug: string) => {
    const filtros: any = {
        _and: [
            {
                slug: {
                    _icontains: slug
                }
            },
        ]
    };
    const blogInformacion = await directusPublic.request(
        readItems('Politicas', {
            fields: [
                'id',
                'slug',
                'titulo',
                'politica',
                'meta_title',
                'meta_description',
                'date_updated'
            ],
            filter: filtros
        })
    );

    return blogInformacion.length > 0 ? blogInformacion[0] : null;
}
