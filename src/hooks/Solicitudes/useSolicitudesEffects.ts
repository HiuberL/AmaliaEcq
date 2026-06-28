import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { existsToken, getSessionCookie } from "@/utils/cookies.utils";
import { useSolicitudesState } from "./useSolicitudesState";

export const useSolicitudesEffects = (
    state: ReturnType<typeof useSolicitudesState>
) => {
    const {
        setIdCliente,
    } = state;

    useEffect(() => {
        const guardarIdCliente = async () =>{
            const idGuardado = await getSessionCookie('amalia_cliente_id');
            setIdCliente(idGuardado || null);
        };
        guardarIdCliente();
    }, []); // <-- Obligatorio pasar pathname aquí para que reaccione al cambiar de página


}