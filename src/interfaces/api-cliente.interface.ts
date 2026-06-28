export interface ApiGeneral<T>{
    codigo: number,
    mensajeSistema: string,
    mensajeUsuario: string,
    data: T | null,
    pagination: Pagination | null
};

export interface Pagination{
    page: number,
    size: number,
    totalItems: number,
    totalPages: number,
    hasNext: boolean,
    hasPrevious: boolean,
}
