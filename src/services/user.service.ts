'use server'

import { cookies } from "next/headers"
import { readItems, withToken } from "@directus/sdk"
import { directusAuthUser } from "./directus.config"
import { renovarSesionServidor } from "./login.service";

export async function consultarDatosCliente(token: string | null, idCliente: string | null) {
    if (!token || !idCliente) {
        return null;
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
            { citas: ["tipo", "dia", "hora"] },
            { solicitudes: ["atendido", "solicitud"] },
            {
                billetera_id: ["saldo_disponible", "saldo_bloqueado", {
                    historial_puntos: [
                        "id",
                        "tipo",
                        "puntos",
                        "detalle",
                        "date_created"
                    ]
                }]
            },
            { direcciones: ["id", "ciudad", "provincia", "sector", "direccion", "referencia", "preferencia", "ubicacion_url"] }
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

        return cliente[0];

    } catch (error: any) {
        // 2. ETAPA DE REINTENTO: Si falló por Token Expired o código 401
        if (error.message?.includes('expired') || error.status === 401) {
            console.log("Amalia Backend: Token expirado detectado. Intentando rescate...");

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
                console.log("Reintentando consulta de datos con el token renovado...");
                // 3. Segundo intento con el token extraído del servidor
                const clienteReintento = await directusAuthUser.request(
                    withToken(tokenFresco, readItems('cliente', queryOptions))
                );

                return clienteReintento[0];
            } catch (reintentoError) {
                console.error("El reintento con el token nuevo también falló:", reintentoError);
                return null;
            }
        }

        // Si es un error diferente (error de sintaxis, base de datos, etc.), lo lanzamos
        console.error("Error no relacionado con autenticación:", error);
        throw error;
    }
}