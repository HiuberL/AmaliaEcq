import { useRouter } from 'next/navigation';
import { useProductoState } from "./useProductoState";
import { consultProductoEspecifico, consultProducts } from "@/services/producto.service";

export const useProductoHandler = (
    state: ReturnType<typeof useProductoState>
) => {
    const {
        products,
        setProducts,
        page,
        setPage,
        setMaxPage,
        maxPage,
        setSubCategoria,
        setBusqueda
    }=state
    const router = useRouter();

    const handleChangeSearch = (text: string) => {
        setBusqueda(text);
    };    
    const handleConsultProduct = async (page:number, categoria:string, subCategoria: string,busqueda:string="") => {
        try {
            const response: any = await consultProducts(page,categoria,subCategoria,busqueda);
            setMaxPage(response.conteoTotal)
            setProducts(response.productosTransf);
        } catch (error: any) {
            window.showAlert(error.message || "No se pudieron cargar los productos.", 'ERROR');
        }
    };
    const handleChangeSubCategoria = (nuevaSub: string) => {
        setSubCategoria(nuevaSub);
        setPage(1); // Ultra importante reiniciar a la página 1 al cambiar de categoría
    };
    const handleOpenPageProduct = async (slug: string) => {
        router.push(`/producto/${slug}`);
    };
    const handleChangePage = async (page:number) =>{
        if (page < maxPage || page > 1){
            setPage(page);
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });        
    }
    
    return {
        handleConsultProduct,
        handleChangePage,
        handleChangeSearch,
        handleChangeSubCategoria,
        handleOpenPageProduct
    }
}