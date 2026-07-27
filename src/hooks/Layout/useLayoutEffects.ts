import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLayoutState } from "./useLayoutState";
import { existsToken } from "@/utils/cookies.utils";
import { analiticaCliente } from "@/app/actions/geolocalizacion.server";
import { useLayoutHandler } from "./useLayoutHandler";

export const useLayoutEffects = (
    state: ReturnType<typeof useLayoutState>,
    handler: ReturnType<typeof useLayoutHandler>

) => {
    const {
        setShowFooter,
        setShowHeader,
        setIsHeaderTransparent,
        setIsLogin
    } = state;

    const {
        onGetBanners
    } = handler;
    const pathname = usePathname();

    // 3. El useEffect escucha activamente cada vez que el "pathname" cambia
    useEffect(() => {
        // Definimos las condiciones dentro del efecto
        const esPaginaPago = pathname === '/paymentpage' || pathname.startsWith('/paymentpage/');
        const ocultarFooter = (pathname === '/' || pathname === '/inicio' || pathname === '/login' || esPaginaPago);
        const hacerTransparente = pathname === '/' || pathname === '/inicio';
        const ocultarHeader = pathname === '/login' || esPaginaPago;
        analiticaCliente('PAGINA', pathname);

        // Actualizamos los estados
        setShowFooter(!ocultarFooter);
        setShowHeader(!ocultarHeader);
        setIsHeaderTransparent(hacerTransparente);
        // 2. Manejo del Await dentro del Effect
        const verificarYBanners = async () => {
            // 1. Validamos si ya existe la llave en el sessionStorage
            const bannerCache = sessionStorage.getItem('promoBannersList');

            if (bannerCache) {
                // Si ya existe, lo parseamos y lo usas directamente sin llamar a la API
                const bannersGuardados = JSON.parse(bannerCache);
                // setTuEstado(bannersGuardados); // <--- Actualiza tu estado aquí si lo necesitas
                return;
            }

            // 2. Si no existe, llamamos a tu función
            await onGetBanners();
        };

        const comprobarSesion = async () => {
            try {
                const estado = await existsToken(); // 🔥 Aquí esperas el valor real (true/false)
                setIsLogin(estado); // Seteas el booleano correcto en tu estado
            } catch (error) {
                console.error("Error al comprobar el token:", error);
                setIsLogin(false);
            }
        };
        verificarYBanners();
        comprobarSesion(); // 🚀 La ejecutas de inmediato
    }, [pathname]); // <-- Obligatorio pasar pathname aquí para que reaccione al cambiar de página


}