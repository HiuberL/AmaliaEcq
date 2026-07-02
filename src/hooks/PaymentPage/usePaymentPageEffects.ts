import { useEffect } from "react";
import { usePaymentPageHandler } from "./usePaymentPageHandler";
import { usePaymentPageState } from "./usePaymentPageState";

declare global {
  interface Window {
    PPaymentButtonBox: any;
  }
}

export const usePaymentPageEffects = (
    handler: ReturnType<typeof usePaymentPageHandler>,
    state: ReturnType<typeof usePaymentPageState>,
    id:string,
    totalPagar: number
) => {
    const {
        handleConsultMetodoEnvio
    } = handler;

    const {
        formData,
        payPhoneReady,
        setCarrito,
    } = state;


    useEffect(() => {
        const consultarCatalogos = async () => {
            await handleConsultMetodoEnvio();
            setCarrito(id);
        };
        consultarCatalogos();
    }, []); // <-- Obligatorio pasar pathname aquí para que reaccione al cambiar de página


    useEffect(() => {
        if (!payPhoneReady) return;
        if (!window.PPaymentButtonBox) return;
        
        new window.PPaymentButtonBox(
            bodyPayphonePay(totalPagar,formData.celular ? `Compra amalia - ${formData.celular}` : `ID pago - ${id}`)
        ).render("pp-button");

    }, [payPhoneReady]);
}