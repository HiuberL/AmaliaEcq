'use server'

import { createItem, readItems } from "@directus/sdk";
import { directusPrivate } from "./directus.config"
import { FormDataPay } from "@/hooks/PaymentPage/usePaymentPageState";
import { create } from "domain";
import { uuidToNumber } from "@/utils/cryptoInfo.utils";


const URL_ASSET = process.env.ASSETS_URL;

interface ClienteDto {
    id: string,
    nombres: string,
    apellidos: string,
    correo: string,
    identificacion: string,
    telefono: string
    billetera_id: Billetera[] | null,
    direcciones: Direcciones[] | null

}
interface Direcciones {
    preferencia: boolean,
    ciudad: string,
    sector: string,
    provincia: string,
    direccion: string,
    referencia: string,
    ubicacion_url: string
}
interface Billetera {
    saldo_bloqueado: number,
    saldo_disponible: number
}

const enmascararTexto = (
    texto: string,
    inicio = 2,
    fin = 2
) => {
    if (texto.length <= inicio + fin) return texto;

    return (
        texto.slice(0, inicio) +
        '*'.repeat(texto.length - inicio - fin) +
        texto.slice(-fin)
    );
}

const convertObjetPersontoForm = (cliente: any,telefono:string=''): FormDataPay => {
    const clientePrimero = cliente[0];
    let direccion;
    if (clientePrimero) {
        if ((clientePrimero.direcciones?.length || 0) > 1) {
            const informacion = clientePrimero.direcciones?.filter((v: any) => v.preferencia == true).map((s: any) => {
                return {
                    ciudad: s.ciudad,
                    sector: s.sector,
                    provincia: s.provincia,
                    direccion: s.direccion,
                    referencia: s.referencia,
                    ubicacion_url: s.ubicacion_url
                }
            });
            console.log(informacion);
            direccion = informacion?.[0] || {
                ciudad: "",
                sector: "",
                provincia: "",
                direccion: "",
                referencia: "",
                ubicacion_url: ""
            };
        } else if ((clientePrimero.direcciones?.length || 0) === 1) {
            direccion = {
                ciudad: clientePrimero.direcciones?.[0].ciudad,
                sector: clientePrimero.direcciones?.[0].sector,
                provincia: clientePrimero.direcciones?.[0].provincia,
                direccion: clientePrimero.direcciones?.[0].direccion,
                referencia: clientePrimero.direcciones?.[0].referencia,
                ubicacion_url: clientePrimero.direcciones?.[0].ubicacion_url
            }
        } else {
            direccion = {
                ciudad: "",
                sector: "",
                provincia: "",
                direccion: "",
                referencia: "",
                ubicacion_url: ""
            }
        }
    return {
        apellido: clientePrimero.apellidos || '',
        nombre: clientePrimero.nombres || '',
        celular: clientePrimero.telefono || '',
        correo: clientePrimero.correo || '',
        idCliente: clientePrimero.id || '',
        usarPuntos: false,
        puntosUsados: 0,
        puntosDisponibles: clientePrimero.billetera_id.saldo_disponible,
        metodoEnvio: '71f045a5-36b6-484e-996e-dd3e69e3644b',
        provincia: direccion.provincia || '',
        ciudad: direccion.ciudad || '',
        direccion: direccion.direccion || '',
        identificacion: enmascararTexto(clientePrimero.identificacion) || '',
        metodoPago: 'transferencia',
        referencia: direccion.referencia || '',
        sector: direccion.sector || '',
        urlMapa: direccion.ubicacion_url || ''
    }
    }
    return {
        apellido: '',
        nombre:  '',
        celular:telefono,
        correo:  '',
        idCliente: '',
        usarPuntos: false,
        puntosUsados: 0,
        puntosDisponibles: 0,
        metodoEnvio: '71f045a5-36b6-484e-996e-dd3e69e3644b',
        provincia:  '',
        ciudad:  '',
        direccion:  '',
        identificacion:  '',
        metodoPago: 'transferencia',
        referencia: '',
        sector:  '',
        urlMapa: ''
    }
}

export const searchPersonById = async (idClient: string) => {
    try {
        const clientes = await directusPrivate.request(readItems('cliente', {
            filter: {
                id: { _eq: idClient }
            },
            fields: ['id',
                'apellidos',
                'telefono',
                'correo',
                'identificacion',
                'nombres',
                {
                    billetera_id: [
                        'saldo_bloqueado',
                        'saldo_disponible'
                    ]
                },
                {
                    direcciones: [
                        'preferencia',
                        'ciudad',
                        'sector',
                        'provincia',
                        'direccion',
                        'referencia',
                        'ubicacion_url'
                    ]
                }
            ]
        }
        ));
        return convertObjetPersontoForm(clientes);
    } catch (e) {
        throw new Error((e as Error).message);
    }
}

export const searchPersonByPhone = async (telefono: string) => {
    try {
        const clientes = await directusPrivate.request(readItems('cliente', {
            filter: {
                telefono: { _eq: telefono }
            },
            fields: [
                'id',
                'apellidos',
                'telefono',
                'correo',
                'identificacion',
                'nombres',
                {
                    billetera_id: [
                        'saldo_bloqueado',
                        'saldo_disponible'
                    ]
                },
                {
                    direcciones: [
                        'ciudad',
                        'sector',
                        'provincia',
                        'direccion',
                        'referencia',
                        'ubicacion_url'
                    ]
                }
            ]
        }
        ));
        return convertObjetPersontoForm(clientes,telefono);
    } catch (e) {
        throw new Error((e as Error).message);
    }
}





export const guardarPedido = async (body:FormDataPay, idCarrito:string,valorEnvio: number,subtotal:number,total:number,descuento:number) => {
    /* CREAR PEDIDO PARA OBTENER ID DE PEDIDO - SI EL CLIENTE EXISTE CLARAMENTE */
    let clienteIdDireccion;
    
    await directusPrivate.request(createItem('pedidos', {
        carrito_id: idCarrito,
        secuencial: uuidToNumber(idCarrito),
        cliente_id: body.idCliente,
        cliente_direccion_id: clienteIdDireccion,
        metodo_envio_id: body.metodoEnvio,
        factura: false,
        estado: 'CREADO',
        puntos_usados: body.puntosUsados,
        forma_pago: body.metodoPago.toUpperCase(),
        costo_real_envio: valorEnvio,
        idpago: null,
        valor_pagado: 0,
        subtotal: subtotal,
        impuestos:0,
        descuento: descuento * 0.01,
        total: total
    }));


    return true;
}





export const obtenerPedidoCompleto = async (secuencial:string) => {
    try {
        const pedido = await directusPrivate.request(readItems('pedidos', {
            filter: {
                secuencial: { _eq: secuencial }
            },
            fields: [
                'secuencial',
                {
                    cliente_id: [
                        'nombres',
                        'apellidos'
                    ]
                },
                {
                    cliente_direccion_id:[
                        "ciudad",
                        "sector",
                        "provincia"
                    ]
                },
                {
                    metodo_envio_id:[
                        'nombre',
                        'detalles'
                    ]
                },
                'forma_pago',
                'subtotal',
                'descuento',
                'costo_real_envio',
                'total',
                'created_at',
                {
                    detalle_pedidos: [
                        'cantidad',
                        'subtotal',
                        {
                            variant_id:[
                                'sku',
                                {
                                    producto_id:[
                                        'imagen',
                                        'nombre'
                                    ]

                                }
                            ]
                        }
                    ]
                }
            ]
        }
        ));
        return simplificarPedido(pedido[0]);
    } catch (e) {
        throw new Error((e as Error).message);
    }
}



const simplificarPedido = (pedidoRaw: any) => {
    return {
        secuencial: pedidoRaw.secuencial,
        formaPago: pedidoRaw.forma_pago,
        subtotal: parseFloat(pedidoRaw.subtotal),
        descuento: parseFloat(pedidoRaw.descuento),
        total: parseFloat(pedidoRaw.total),
        fecha: new Date(pedidoRaw.created_at),
        formaEnvio: pedidoRaw.metodo_envio_id.nombre,
        valorEnvio: `${pedidoRaw.costo_real_envio}`,
        detalleEnvio: pedidoRaw.metodo_envio_id.detalles,
        cliente: pedidoRaw.cliente_id 
            ? `${pedidoRaw.cliente_id.nombres} ${pedidoRaw.cliente_id.apellidos}`
            : 'Cliente no registrado',
            
        // Aplanamos el detalle de los pedidos para que sea un array simple
        productos: (pedidoRaw.detalle_pedidos || []).map((item: any) => ({
            cantidad: item.cantidad,
            subtotal: parseFloat(item.subtotal),
            sku: item.variant_id?.sku || 'N/A',
            // Traemos los datos del producto al primer nivel del objeto
            nombre: item.variant_id?.producto_id?.nombre ,
            imagen: item.variant_id?.producto_id?.imagen   ? `${URL_ASSET}/${item.variant_id?.producto_id?.imagen}.webp` : null ,
        }))
    };
};