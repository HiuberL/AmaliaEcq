import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { existsToken, getSessionCookie } from "@/utils/cookies.utils";
import { useCitasState } from "./useCitasState";
import { analiticaCliente } from "@/app/actions/geolocalizacion.server";
import { consultarCitas } from "@/services/citas.service";

export const useCitasEffects = (
    state: ReturnType<typeof useCitasState>
) => {
    const {
        setIdCliente,
        setCitasActivas
    } = state;

    useEffect(() => {
        const guardarIdCliente = async () =>{
            const idGuardado = await getSessionCookie('amalia_cliente_id');
            setIdCliente(idGuardado || null);
            const citas = await consultarCitas();
            setCitasActivas(citas);
        };
        guardarIdCliente();
    }, []); // <-- Obligatorio pasar pathname aquí para que reaccione al cambiar de página


}