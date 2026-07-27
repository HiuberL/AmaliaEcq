import { logoutSoloCookies } from "@/utils/cookies.utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLayoutState } from "./useLayoutState";
import { obtenerBanners } from "@/services/banner.service";

export const useLayoutHandler = () => {
    const router = useRouter();
    const onLogout = async () => {
        try {
            await logoutSoloCookies();
            router.push('/');
            router.refresh();
        } catch (error: any) {
            window.showAlert(error.message || "No se pudo cerrar la sesión.", 'ERROR');
        }
    };

    const onGetBanners = async () => {
        try {
            // 1. Revisar si ya existen en sessionStorage
            const bannerCache = sessionStorage.getItem('promoBannersList');

            if (bannerCache) {
                return JSON.parse(bannerCache);
            }

            // 2. Si no están guardados, hacer la petición
            const banners = await obtenerBanners();

            // 3. Guardar en sessionStorage si obtuvimos resultados
            if (banners && banners.length > 0) {
                sessionStorage.setItem('promoBannersList', JSON.stringify(banners));
            }

            return banners;
        } catch (error) {
            console.error('Error al obtener los banners:', error);
            return [];
        }
    };

    return {
        onLogout,
        onGetBanners
    }

}