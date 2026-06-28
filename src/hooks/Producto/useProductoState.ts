import { LoginRequest } from "@/interfaces/admin/login.interface";
import { Producto } from "@/interfaces/admin/productos.interfaces";
import { useState } from "react";




export const useProductoState = (categoriaSlug:string) => {
    const [products, setProducts] = useState<any>(null);
    const [busqueda, setBusqueda] = useState<string>("");
    const [busquedaDebounced, setBusquedaDebounced] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [categoria,setCategoria] = useState<string>(categoriaSlug);
    const [subCategoria,setSubCategoria] = useState<string>(categoriaSlug);
    const [maxPage, setMaxPage] = useState<number>(1);
    const [listCategoria,setListCategoria] = useState<string[] | null>(null);
    return{
        products, setProducts,
        loading, setLoading,
        page, setPage,
        busqueda, setBusqueda,
        busquedaDebounced, setBusquedaDebounced,
        maxPage, setMaxPage,
        categoria,setCategoria,
        subCategoria,setSubCategoria,
        listCategoria,setListCategoria
    }
}