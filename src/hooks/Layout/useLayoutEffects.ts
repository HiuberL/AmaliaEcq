import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLayoutState } from "./useLayoutState";
import { existsToken } from "@/utils/cookies.utils";
import { analiticaCliente } from "@/app/actions/geolocalizacion.server";

export const useLayoutEffects = (
    state: ReturnType<typeof useLayoutState>
) => {
    const {
        setShowFooter,
        setShowHeader,
        setIsHeaderTransparent,
        setIsLogin
    } = state;
    const pathname = usePathname();

    // 3. El useEffect escucha activamente cada vez que el "pathname" cambia
    useEffect(() => {
        // Definimos las condiciones dentro del efecto
        const esPaginaPago = pathname === '/paymentpage' || pathname.startsWith('/paymentpage/');
        const ocultarFooter = (pathname === '/' || pathname === '/inicio'  || pathname === '/login' || esPaginaPago);
        const hacerTransparente = pathname === '/' || pathname === '/inicio' ;
        const ocultarHeader = pathname === '/login' || esPaginaPago;
        analiticaCliente('PAGINA', pathname);
        
        // Actualizamos los estados
        setShowFooter(!ocultarFooter);
        setShowHeader(!ocultarHeader);
        setIsHeaderTransparent(hacerTransparente);
        // 2. Manejo del Await dentro del Effect
        const comprobarSesion = async () => {
            try {
                const estado = await existsToken(); // 🔥 Aquí esperas el valor real (true/false)
                setIsLogin(estado); // Seteas el booleano correcto en tu estado
            } catch (error) {
                console.error("Error al comprobar el token:", error);
                setIsLogin(false);
            }
        };

        comprobarSesion(); // 🚀 La ejecutas de inmediato
    }, [pathname]); // <-- Obligatorio pasar pathname aquí para que reaccione al cambiar de página


}