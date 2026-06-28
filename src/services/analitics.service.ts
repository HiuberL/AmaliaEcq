'use server'
import { getSessionCookie, removeSessionCookie } from "@/utils/cookies.utils";
import { NextRequest } from "next/server";
// utils/analytics.server.ts
import { readItems, createItem, updateItem } from '@directus/sdk';
import { directusPrivate } from "./directus.config";

interface LocationData {
  pais: string;
  ciudad: string;
}
export const guardarAnaliticas = async (
  vercelId: string,
  idGuardado: string, // Guarda el tipo de evento ('VISITA', 'CLICK_X', etc.)
  location: LocationData,
  criterio: string = ''
) => {
  try {
    const clienteId = await getSessionCookie('amalia_cliente_id');

    // ⚡ OPTIMIZACIÓN: El proceso de buscar duplicados y actualizar SOLO aplica a 'VISITA'
    if (idGuardado === 'VISITA' && vercelId) {
      const registrosExistentes = await directusPrivate.request(
        readItems('analiticas_web', {
          filter: {
            _and: [
              {
                _or: [
                  { id_conexion: { _eq: vercelId } },
                  ...(clienteId ? [{ cliente_id: { _eq: clienteId } }] : [])
                ]
              },
              { analitica: { _eq: 'VISITA' } }
            ]
          },
          limit: 1,
          fields: ['id', 'cliente_id'] // Pedimos el campo plano o el objeto
        })
      );

      if (registrosExistentes && registrosExistentes.length > 0) {
        const registroActual = registrosExistentes[0];

        // 🛡️ Validación Segura: Verificamos si 'cliente_id' es null o si es un objeto sin ID poblado
        const tieneClienteAsignado = registroActual.cliente_id 
          ? (typeof registroActual.cliente_id === 'object' ? registroActual.cliente_id.id : registroActual.cliente_id)
          : null;

        // 🔄 Si la visita registrada era anónima, pero ahora ya tenemos un cliente logueado:
        if (!tieneClienteAsignado && clienteId) {
          console.log(`[Analíticas SDK] Vinculando usuario anónimo con el cliente: ${clienteId}`);

          await directusPrivate.request(
            updateItem('analiticas_web', registroActual.id, {
              cliente_id: clienteId
            })
          );
        }
        return; // Salimos del flujo de visita ya procesado
      }
    }

    // 🚀 INSERCIÓN DIRECTA: Si es una visita nueva, o es CUALQUIER otro evento (Agregar Carrito, clic, etc.)
    await directusPrivate.request(
      createItem('analiticas_web', {
        analitica: idGuardado,       // 'VISITA' o el tipo de evento personalizado
        id_conexion: vercelId,       
        pais: location.pais,
        criterio: criterio,          // Guarda qué producto miró o buscó
        ciudad: location.ciudad,
        cliente_id: clienteId || null 
      })
    );

    console.log(`[Analíticas SDK] Éxito: Registro '${idGuardado}' procesado desde ${location.ciudad}.`);

  } catch (error) {
    // ⚠️ Nota: Ten cuidado de no borrar la cookie del carrito en producción por un error de red con Directus
    // await removeSessionCookie('guest_cart_id'); 
    console.error('[Analíticas SDK Error]:', error);
  }
};