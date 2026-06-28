import { useProductoEffects } from "./useProductoEffects";
import { useProductoHandler } from "./useProductoHandler";
import { useProductoState } from "./useProductoState";


export const useProducto = (slugCategoria:string) => {
    const state = useProductoState(slugCategoria);
    const handlers = useProductoHandler(state);
    const effects = useProductoEffects(handlers,state);
    return{
        products:state.products,
        loading:state.loading,
        page:state.page,
        totalPage: state.maxPage,
        listCategoria: state.listCategoria,
        subCategoria: state.subCategoria,
        onChangePage: handlers.handleChangePage,
        onChangeSearch: handlers.handleChangeSearch,
        onChangeSubCategoria:handlers.handleChangeSubCategoria,
        onClickGoProductPage: handlers.handleOpenPageProduct
    }
}