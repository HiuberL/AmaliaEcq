'use server'
import { createItem, readItems } from "@directus/sdk";
import { directusPrivate } from "./directus.config";
import { getSessionCookie } from "@/utils/cookies.utils";

const guardarSolicitudCliente = async (request: any,idGuardado:string | null) => {
    try {

        let clienteId: string | number;
        let clientesExistentes;


        // 1. 🔍 BUSCAR: Comprobamos si ya existe un cliente registrado con ese correo
        if (!idGuardado) {
            clientesExistentes = await directusPrivate.request(
                readItems('cliente', {
                    filter: {
                        _or: [
                            {
                                correo: { _eq: request.correo.trim().toLowerCase() }
                            },
                            {
                                // Filtramos por teléfono eliminando espacios en blanco por si acaso
                                telefono: { _eq: request.telefono.trim() }
                            }
                        ]
                    },
                    fields: ['id'] // Solo recuperamos el ID para hacer la relación
                })
            );
            if (clientesExistentes && clientesExistentes.length > 0) {
                clienteId = clientesExistentes[0].id;
            } else {
                const nuevoCliente = await directusPrivate.request(
                    createItem('cliente', {
                        nombres: request.nombres,
                        apellidos: request.apellidos,
                        telefono: request.telefono,
                        correo: request.correo.trim().toLowerCase(),
                        billetera_id: null
                    })
                );
                clienteId = nuevoCliente.id;
            }
        } else {
            clienteId = idGuardado;
        }

        const resultado = await directusPrivate.request(
            createItem('solicitudes', {
                solicitud: request.solicitud,
                cliente_id: clienteId
            })
        );

        return true;

    } catch (error) {
        console.error("Error al procesar la solicitud con relación de cliente:", error);
        throw error;
    }

};


const guardarSolicitudProducto = async (solicitud: any,idGuardado:string | null) => {
    try {
        const resultado = await directusPrivate.request(
            createItem('solicitudes', {
                solicitud: solicitud,
                cliente_id: null
            })
        );
    } catch (error) {
        console.error("Error al procesar la solicitud", error);
        throw error;
    }

};

export {
    guardarSolicitudCliente,
    guardarSolicitudProducto
}