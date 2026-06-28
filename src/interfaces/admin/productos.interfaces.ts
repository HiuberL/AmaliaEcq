import { Pagination } from "../api-cliente.interface"

export interface Producto{
    id : string,
    nombre: string,
    slug: string | null,
    metaInfo: MetaInfo,
    stock: string,
    marca:string,
    estado:boolean,
    valor: Valores,
    descuento: number
}


export interface MetaInfo{
    title: string | undefined,
    description: string | undefined
}
export interface Valores{
    minimo: number,
    maximo: number
}