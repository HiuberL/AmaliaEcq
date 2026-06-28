import { useProductoState } from "./useProductoState";
import { useProductoHandler } from "./useProductoHandler";
import { useEffect } from "react";
import { consultCategorias } from "@/services/producto.service";

export const useProductoEffects = (
    handler: ReturnType<typeof useProductoHandler>,
    state: ReturnType<typeof useProductoState>
) => {
    const {
        handleConsultProduct
    }=handler
    const{
        page,
        subCategoria,
        categoria,
        setSubCategoria,
        setCategoria,
        setBusquedaDebounced,
        setPage,
        busquedaDebounced,
        busqueda,
        setListCategoria,
        setLoading
    }=state
    
    useEffect(() => {
        setLoading(true);
        if (categoria) {
            handleConsultProduct(page, categoria, subCategoria,busquedaDebounced);
            const cargarCategorias = async () => {
            try {
                // 2. Aquí sí podemos usar await de manera segura
                const listaCategorias = await consultCategorias(categoria);
                setListCategoria(listaCategorias);
            } catch (error) {
                console.error("Error al cargar las categorías en el cliente:", error);
            }
        };
        cargarCategorias();
        }
        setLoading(false);

    }, [page,categoria,subCategoria,busquedaDebounced,handleConsultProduct]);
    
    useEffect(() => {
        if (categoria) {
            setCategoria(categoria);
            setSubCategoria(subCategoria);
            setPage(1); // Reiniciamos a la página 1 si el usuario salta de una categoría a otra
        }
    }, [categoria]);

    useEffect(() => {
        const handlerTimer = setTimeout(() => {
            setBusquedaDebounced(busqueda);
            setPage(1); // Ultra importante: si busca algo nuevo, vuelve a la página 1
        }, 500);

        return () => clearTimeout(handlerTimer); // Limpia el timer si el usuario sigue escribiendo
    }, [busqueda]);
    return {
        handleConsultProduct
    }
}