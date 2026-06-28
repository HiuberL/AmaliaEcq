'use server'
import { readItems, createItem, updateItem, deleteItem, readItem } from '@directus/sdk';
import { getSessionCookie, setSessionCookie } from '@/utils/cookies.utils';
import { directusPublic } from './directus.config';

/**
 * HELPER: OBTIENE EL STOCK DISPONIBLE EN TIEMPO REAL
 * Valida si es una variante regular o un decant (-99) resolviendo la relación profunda.
 */
const URL_ASSET = process.env.ASSETS_URL;

const obtenerStockVariante = async (varianteId: string): Promise<number> => {
    try {
        const variante = await directusPublic.request(
            readItem('variante', varianteId, {
                fields: [
                    'id',
                    'sku',
                    'stock'
                ]
            }),
        );

        if (!variante) throw new Error('La variante seleccionada no existe.');
        

        // Si es producto normal, usamos su stock por unidades
        return variante.stock ?? 0;
    } catch (error) {
        console.error("Error al consultar stock de la variante:", error);
        throw new Error("No se pudo verificar el inventario del producto.");
    }
};

export const obtenerFormasEnvio= async (): Promise<any> => {
    try {
        const metodoEnvio = await directusPublic.request(
            readItems('metodo_envio', {
                filter: {
                    estado: { _eq: 'V' } 
                },
                fields: ['id','nombre','valor','detalles'],
            }),
        );
        return metodoEnvio;
    } catch (error) {
        console.error("Error al verificar carrito activo:", error);
        return null;
    }
};
/**
 * 1. OBTENER ID DEL CARRITO VÁLIDO (Lógica de Cookies y Estado 'N')
 */
export const obtenerCarritoIdActivo = async (): Promise<string | null> => {
    const guestCartId = await getSessionCookie('guest_cart_id');
    const clienteId = await getSessionCookie('amalia_cliente_id');

    if (!guestCartId && !clienteId) return null;

    try {
        const carritos = await directusPublic.request(
            readItems('carrito', {
                filter: {
                    _and: [
                        {
                            _or: [
                                ...(guestCartId ? [{ id: { _eq: guestCartId } }] : []),
                                ...(clienteId ? [{ cliente_id: { _eq: clienteId } }] : [])
                            ]
                        },
                        { estado: { _eq: 'N' } }
                    ]
                },
                fields: ['id'],
            }),
        );
        return carritos.length > 0 ? carritos[0].id : null;
    } catch (error) {
        console.error("Error al verificar carrito activo:", error);
        return null;
    }
};

/**
 * 2. CONSULTAR EL CONTENIDO COMPLETO DEL CARRITO
 */
export const consultarCarritoCompleto = async (guestCartIdProvider: string = '') => {
    try {
        let guestCartId;
        if (guestCartIdProvider === ''){
            guestCartId= await getSessionCookie('guest_cart_id');

        }else{
            guestCartId = guestCartIdProvider;
        }
        if (!guestCartId) return null;

        // URL base para los assets que definas (puede venir de tus variables de entorno)

        const carrito = await directusPublic.request(
            readItems('carrito', {
                filter: {
                    id: { _eq: guestCartId },
                    estado: { _eq: 'N' }
                },
                fields: [
                    'id',
                    'cliente_id',
                    'metodo_envio',
                    'estado',
                    {
                        carrito_detalle: [
                            'id',
                            {
                                variante_id: [
                                    'sku',
                                    'precio', // Asegúrate de pedir el precio si lo necesitas en el front
                                    'descuento',
                                    {
                                        producto_id: [
                                            'imagen',
                                            'nombre',
                                            'descuento'
                                        ]
                                    }
                                ]
                            },
                            'cantidad'
                        ]
                    }
                ]
            }),
        );

        if (!carrito || carrito.length === 0) return null;

        const carritoActivo = carrito[0];

        // Validamos si el carrito tiene detalles antes de mapear
        if (carritoActivo.carrito_detalle && Array.isArray(carritoActivo.carrito_detalle)) {
            carritoActivo.carrito_detalle = carritoActivo.carrito_detalle.map((item: any) => {
                const producto = item.variante_id?.producto_id;

                return {
                    ...item,
                    variante_id: {
                        ...item.variante_id,
                        producto_id: {
                            ...producto,
                            // 🚀 Concatenamos la URL estructurada directamente aquí en el servidor
                            imagen: producto?.imagen 
                                ? `${URL_ASSET}/${producto.imagen}.webp` 
                                : null
                        }
                    }
                };
            });
        }
        return carritoActivo;
    } catch (error) {
        console.error("Error al consultar contenido del carrito:", error);
        return null;
    }
};

/**
 * 3. CREAR UN NUEVO CARRITO
 */
const crearNuevoCarritoEnBD = async (): Promise<string> => {
    const clienteId = await getSessionCookie('amalia_cliente_id');
    const guestCartId = await getSessionCookie('guest_cart_id');

    const nuevoCarrito = await directusPublic.request(
        createItem('carrito', {
            id: guestCartId || undefined,
            estado: 'N',
            cliente_id: clienteId || null
        })
    );

    return nuevoCarrito.id;
};

/**
 * 4. AÑADIR PRODUCTO/VARIANTE AL CARRITO (Con validación de Stock)
 */
export const agregarAlCarrito = async (varianteId: string, cantidadAñadir: number) => {
    try {
        // A. Validar stock físico/ml disponible en Directus en tiempo real
        const stockDisponible = await obtenerStockVariante(varianteId);

        const guestCartId = await getSessionCookie('guest_cart_id');
        let carritoId = await obtenerCarritoIdActivo();

        if (!carritoId) {
            carritoId = await crearNuevoCarritoEnBD();
            if (carritoId !== guestCartId) {
                await setSessionCookie('guest_cart_id', carritoId);
            }
        }

        // B. Buscar si ya tiene esta variante en el carrito para calcular el acumulado
        const detallesExistentes = await directusPublic.request(
            readItems('carrito_detalle', {
                filter: {
                    carrito_id: { _eq: carritoId },
                    variante_id: { _eq: varianteId }
                },
                fields: ['id', 'cantidad']
            }),
        );

        const cantidadActualEnCarrito = detallesExistentes.length > 0 ? detallesExistentes[0].cantidad : 0;
        const cantidadTotalSolicitada = cantidadActualEnCarrito + cantidadAñadir;

        // C. Romper el flujo si supera las existencias físicas reales
        if (cantidadTotalSolicitada > stockDisponible) {
            throw new Error(
                `Stock insuficiente. Solicitas ${cantidadTotalSolicitada} unidades, pero solo quedan ${stockDisponible} unidades disponibles.`
            );
        }

        if (detallesExistentes.length > 0) {
            // Caso A: Sumar al registro existente
            const detalle = detallesExistentes[0];
            return await directusPublic.request(
                updateItem('carrito_detalle', detalle.id, {
                    cantidad: cantidadTotalSolicitada
                })
            );
        } else {
            // Caso B: Insertar variante nueva en el detalle
            return await directusPublic.request(
                createItem('carrito_detalle', {
                    carrito_id: carritoId,
                    variante_id: varianteId,
                    cantidad: cantidadAñadir
                })
            );
        }
    } catch (error: any) {
        console.error("Error al añadir producto al carrito:", error);
        throw new Error(error.message || "Error inesperado al procesar el carrito.");
    }
};

/**
 * 5. ACTUALIZAR CANTIDAD DESDE EL CARRITO (Con validación de Stock)
 */
export const actualizarCantidadDetalle = async (detalleId: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
        return await eliminarItemDelCarrito(detalleId);
    }


    try {
        // A. Averiguar qué variante corresponde a este registro de detalle del carrito
        const detalleActual = await directusPublic.request(
            readItem('carrito_detalle', detalleId, {
                fields: ['id', 'variante_id']
            }),
        );

        if (!detalleActual) throw new Error('El elemento del carrito ya no existe.');

        // B. Validar el inventario disponible para esa variante
        const stockDisponible = await obtenerStockVariante(detalleActual.variante_id);
        const unidadMedida =  'unidades';

        if (nuevaCantidad > stockDisponible) {
            throw new Error(
                `No puedes cambiar la cantidad a ${nuevaCantidad}. El stock máximo disponible es de ${stockDisponible} ${unidadMedida}.`
            );
        }

        return await directusPublic.request(
            updateItem('carrito_detalle', detalleId, {
                cantidad: nuevaCantidad
            })
        );
    } catch (error: any) {
        console.error("Error al actualizar cantidad en el detalle:", error);
        throw new Error(error.message || "No se pudo actualizar la cantidad en el carrito.");
    }
};

/**
 * 6. ELIMINAR UN ELEMENTO DEL CARRITO
 */
export const eliminarItemDelCarrito = async (detalleId: string) => {
    try {
        await directusPublic.request(
            deleteItem('carrito_detalle', detalleId)
        );
        return { success: true };
    } catch (error) {
        console.error("Error al eliminar item del detalle:", error);
        throw error;
    }
};