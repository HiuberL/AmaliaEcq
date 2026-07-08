import { useEffect } from "react";
import { useBlogHandler } from "./useBlogHandler";
import { useBlogState } from "./useBlogState";


export const useBlogEffects = (
    handler: ReturnType<typeof useBlogHandler>,
    state:ReturnType<typeof useBlogState>
) => {
    const {
        onInit
    } = handler;

    const{
        categoria,
        setCategoria,
        setPage,
        setBusquedaDebounced,
        busqueda,
        busquedaDebounced,
        page,
        setLoading
    }=state;
    useEffect(() => {
        setLoading(true);
        onInit();
        setLoading(false);
    },[page,categoria,busquedaDebounced])

    useEffect(() => {
        if (categoria) {
            setCategoria(categoria);
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
    
}