import { useEffect } from "react";
import { usePaymentPageHandler } from "./usePaymentPageHandler";

export const usePaymentPageEffects = (
    handler: ReturnType<typeof usePaymentPageHandler>
) => {
    const {
        handleConsultMetodoEnvio
    } = handler;

    useEffect(() => {
        const consultarCatalogos = async () => {
            await handleConsultMetodoEnvio();
        };
        consultarCatalogos();
    }, []); // <-- Obligatorio pasar pathname aquí para que reaccione al cambiar de página


}