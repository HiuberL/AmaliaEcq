'use server'
import { createItem, readItems } from "@directus/sdk";
import { directusPrivate } from "./directus.config";
import { getSessionCookie } from "@/utils/cookies.utils";

const guardarCitaCliente = async (request: any, idGuardado:any) => {
    try {
        // 1. 🔍 BUSCAR: Comprobamos si ya existe un cliente registrado con ese correo
        
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


        // 3. 📝 GUARDAR SOLICITUD: Creamos la solicitud vinculándola limpiamente mediante el ID
        const resultado = await directusPrivate.request(
            createItem('citas', {
                dia: request.dia,
                hora: request.hora,
                tipo: request.tipo,
                mensaje: request.solicitud, // Aquí entra el HTML de Quill con las imágenes base64
                cliente_id: clienteId        // Pasamos el ID directamente (Relación Many-to-One limpia)
            })
        );

        return true;

    } catch (error) {
        console.error("Error al procesar la solicitud con relación de cliente:", error);
        throw error;
    }

};

export {
    guardarCitaCliente
}