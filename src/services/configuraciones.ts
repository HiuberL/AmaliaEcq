'use server'
import { readItems } from "@directus/sdk";
import { directusPrivate } from "./directus.config";



export const consultaConfiguracionByTabla = async (tabla: string) => {
        const datosTabla = await directusPrivate.request(readItems('detalle_configuracion',{
            filter:{
                _and: [
                    {
                        configuracion_id:{
                        tabla: {
                        _eq: tabla
                        }
                        }
                    },
                    {
                        estado: {
                        _eq: 'V'
                        }
                    }
                ]
            },
            fields:[
                    'codigo',
                    'valor'
            ]
        }
        ));
        return datosTabla || null;
}

export const consultaConfiguracionByTablaCondicion = async (tabla: string, condicion:string) => {
    console.log(condicion);
        const datosTabla = await directusPrivate.request(readItems('detalle_configuracion',{
            filter:{
                _and: [
                    {configuracion_id:{
                        tabla: {
                        _eq: tabla
                        }
                    }
                    },
                    {
                        estado: {
                        _eq: 'V'
                        }
                    },
                    {
                        codigo: {
                        _starts_with: condicion
                        }
                    },
                ]
            },
            fields:[
                'codigo',
                'valor'
            ]
        }
        ));
        return datosTabla || null;
}