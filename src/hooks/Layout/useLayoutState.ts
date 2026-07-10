import { useState } from "react";

export const useLayoutState = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [showFooter, setShowFooter] = useState(true);
    const [showHeader, setShowHeader] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [isHeaderTransparent, setIsHeaderTransparent] = useState(false);    
    return{
        menuOpen, setMenuOpen,
        isHeaderTransparent, setIsHeaderTransparent,
        showFooter, setShowFooter,
        showHeader,setShowHeader,
        isLogin, setIsLogin,
    }
}