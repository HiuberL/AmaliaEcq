import { useState } from "react"

export const useBlogState = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [categoriaT, setCategoriaT] = useState<any>(null);
    const [blogPost, setBlogPost] = useState<any>(null);
    const [page, setPage] = useState<number>(1);
    const [busqueda, setBusqueda] = useState<string>("");
    const [busquedaDebounced, setBusquedaDebounced] = useState<string>("");
    const [categoria,setCategoria] = useState<string>("Resena");
    const [maxPage, setMaxPage] = useState<number>(1);

    return {
        loading, setLoading,
        categoriaT, setCategoriaT,
        blogPost, setBlogPost,
        busqueda,setBusqueda,
        page, setPage,
        busquedaDebounced, setBusquedaDebounced,
        categoria,setCategoria,
        maxPage, setMaxPage
    }
}