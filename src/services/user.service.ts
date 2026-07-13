'use server'

import { cookies } from "next/headers"
import { createItem, readItems, updateCollection, updateItem, withToken } from "@directus/sdk"
import { directusAuthUser } from "./directus.config"
import { renovarSesionServidor } from "./login.service";
import { FormDataPosition } from "@/hooks/Espacio/useEspacioState";

const dataClienteFiltrado = (data: any) => {
    return {
        ...data,
        direcciones: data.direcciones.map((v: any) => {
            return {
                id: v.id,
                ciudad: v.ciudad.split("-")[1],
                provincia: v.provincia.split("-")[1],
                sector: v.sector.split("-")[1],
                direccion: v.direccion,
                referencia: v.referencia,
                preferencia: v.preferencia,
                ubicacion_url: v.ubicacion_url
            }
        })
    }
}



export async function updatePreferentDireccionCliente(token: string | null, idDireccion: string | null) {
    if (!token || !idDireccion) {
        throw new Error('No existen identificadores de direccion');
    }
    try {
        await renovarSesionServidor();
        const direccionCliente = await directusAuthUser.request(
            withToken(token, updateItem('cliente_direccion', idDireccion, {
                preferencia: true,
            }))
        );
        return;
    } catch (error: any) {
        if (error.message?.includes('expired') || error.status === 401) {

            // Volvemos a forzar el refresco para asegurar el cambio de cookies
            await renovarSesionServidor();

            // Leemos el token fresco que renovarSesionServidor acaba de inyectar en las cookies
            const cookieStore = await cookies();
            const tokenFresco = cookieStore.get('amalia_token')?.value;

            if (!tokenFresco) {
                console.error("No se pudo recuperar un token fresco tras la renovación.");
                return null;
            }

            try {
                // 3. Segundo intento con el token extraído del servidor
                const direccionClienteIntento2 = await directusAuthUser.request(
                    withToken(token, updateItem('cliente_direccion', idDireccion, {
                        preferencia: true,
                    }))
                );
                return;
            } catch (reintentoError) {
                console.error("El reintento con el token nuevo también falló:", reintentoError);
                return null;
            }
        }

        console.error("Error no relacionado con autenticación:", error);
        throw error;
    }
}



export async function crearDireccionCliente(token: string | null, idCliente: string | null, formData: FormDataPosition) {
    if (!token || !idCliente) {
        throw new Error('No existen identificadores de cliente');
    }
    try {
        await renovarSesionServidor();

        const direccionCliente = await directusAuthUser.request(
            withToken(token, createItem('cliente_direccion', {
                preferencia: false,
                cliente_id: idCliente,
                ubicacion_url: formData.urlMapa,
                ciudad: formData.ciudad,
                sector: formData.sector,
                provincia: formData.provincia,
                direccion: formData.direccion,
                referencia: formData.referencia
            }))
        );
        return;
    } catch (error: any) {
        if (error.message?.includes('expired') || error.status === 401) {

            // Volvemos a forzar el refresco para asegurar el cambio de cookies
            await renovarSesionServidor();

            // Leemos el token fresco que renovarSesionServidor acaba de inyectar en las cookies
            const cookieStore = await cookies();
            const tokenFresco = cookieStore.get('amalia_token')?.value;

            if (!tokenFresco) {
                console.error("No se pudo recuperar un token fresco tras la renovación.");
                return null;
            }

            try {
                // 3. Segundo intento con el token extraído del servidor
                const direccionCliente = await directusAuthUser.request(
                    withToken(token, createItem('cliente_direccion', {
                        preferencia: false,
                        cliente_id: idCliente,
                        ubicacion_url: formData.urlMapa,
                        ciudad: formData.ciudad,
                        sector: formData.sector,
                        provincia: formData.provincia,
                        direccion: formData.direccion,
                        referencia: formData.referencia
                    }))
                );
                return;
            } catch (reintentoError) {
                console.error("El reintento con el token nuevo también falló:", reintentoError);
                return null;
            }
        }

        console.error("Error no relacionado con autenticación:", error);
        throw error;
    }
}


export async function modificarCelularCliente(token: string | null, idCliente: string | null, telefono: string) {
    if (!token || !idCliente) {
        throw new Error('No existen identificadores de cliente');
    }
    try {
        await renovarSesionServidor();

        const clienteRenovado = await directusAuthUser.request(
            withToken(token, updateItem('cliente', idCliente, {
                telefono: telefono
            }))
        );
        return;
    } catch (error: any) {
        if (error.message?.includes('expired') || error.status === 401) {

            // Volvemos a forzar el refresco para asegurar el cambio de cookies
            await renovarSesionServidor();

            // Leemos el token fresco que renovarSesionServidor acaba de inyectar en las cookies
            const cookieStore = await cookies();
            const tokenFresco = cookieStore.get('amalia_token')?.value;

            if (!tokenFresco) {
                console.error("No se pudo recuperar un token fresco tras la renovación.");
                return null;
            }

            try {
                // 3. Segundo intento con el token extraído del servidor
                const clienteReintento = await directusAuthUser.request(
                    withToken(token, updateItem('cliente', idCliente, {
                        telefono: telefono
                    }))
                );
                return;
            } catch (reintentoError) {
                console.error("El reintento con el token nuevo también falló:", reintentoError);
                return null;
            }
        }

        console.error("Error no relacionado con autenticación:", error);
        throw error;
    }
}
export async function consultarDatosCliente(token: string | null, idCliente: string | null) {
    if (!token || !idCliente) {
        throw new Error('No existen identificadores de cliente');
    }
    const queryOptions = {
        filter: {
            id: { _eq: idCliente }
        },
        fields: [
            "nombres",
            "apellidos",
            "telefono",
            "identificacion",
            "correo",
            { citas: ["tipo", "dia", "hora","estado"] },
            { solicitudes: ["atendido", "solicitud","date_created"] },
            {
                billetera_id: ["id", "saldo_disponible", "saldo_bloqueado", {
                    historial_puntos: [
                        "id",
                        "tipo",
                        "puntos",
                        "detalle",
                        "date_created"
                    ]
                }]
            },
            { direcciones: ["id", "ciudad", "provincia", "sector", "direccion", "referencia", "preferencia", "ubicacion_url"] },
            {
                pedidos: [
                    'secuencial',
                    {
                        metodo_envio_id: [
                            'nombre'
                        ]
                    },
                    'estado',
                    'puntos_usados',
                    'forma_pago',
                    'total',
                    'valor_pagado',
                    'updated_at'
                ]
            }
        ],
        deep: {
            billetera_id: {
                historial_puntos: {
                    _sort: ["-date_created"],
                    _limit: 5
                }
            }
        }
    };

    try {
        await renovarSesionServidor();

        const cliente = await directusAuthUser.request(
            withToken(token, readItems('cliente', queryOptions))
        );

        return dataClienteFiltrado(cliente[0]);

    } catch (error: any) {
        // 2. ETAPA DE REINTENTO: Si falló por Token Expired o código 401
        if (error.message?.includes('expired') || error.status === 401) {

            // Volvemos a forzar el refresco para asegurar el cambio de cookies
            await renovarSesionServidor();

            // Leemos el token fresco que renovarSesionServidor acaba de inyectar en las cookies
            const cookieStore = await cookies();
            const tokenFresco = cookieStore.get('amalia_token')?.value;

            if (!tokenFresco) {
                console.error("No se pudo recuperar un token fresco tras la renovación.");
                return null;
            }

            try {
                const clienteReintento = await directusAuthUser.request(
                    withToken(tokenFresco, readItems('cliente', queryOptions))
                );

                return dataClienteFiltrado(clienteReintento[0]);
            } catch (reintentoError) {
                console.error("El reintento con el token nuevo también falló:", reintentoError);
                return null;
            }
        }

        console.error("Error no relacionado con autenticación:", error);
        throw error;
    }
}