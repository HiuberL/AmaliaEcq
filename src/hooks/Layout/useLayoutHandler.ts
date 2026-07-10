import { logoutSoloCookies } from "@/utils/cookies.utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLayoutState } from "./useLayoutState";

export const useLayoutHandler = () => {
    const router = useRouter();
    const onLogout = async () => {
        try {
            await logoutSoloCookies();
            router.push('/inicio');
            router.refresh();
        } catch (error: any) {
            window.showAlert(error.message || "No se pudo cerrar la sesión.", 'ERROR');
        }
    };

    return{
        onLogout
    }

}