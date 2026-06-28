
import { useLayoutEffects } from "./useLayoutEffects";
import { useLayoutHandler } from "./useLayoutHandler";
import { useLayoutState } from "./useLayoutState";

export const useLayout = () => {
    const state = useLayoutState();
    const handler = useLayoutHandler();
    const effects = useLayoutEffects(state);
    return{
        menuOpen: state.menuOpen,
        setMenuOpen: state.setMenuOpen,
        isHeaderTransparent: state.isHeaderTransparent,
        showFooter: state.showFooter,
        showHeader : state.showHeader,
        isLogin: state.isLogin,
        onLogout: handler.onLogout,
    }
}