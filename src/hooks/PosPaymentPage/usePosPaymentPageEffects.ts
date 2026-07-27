import { useEffect } from "react";
import { searchPersonById } from "@/services/pedidos.service";
import { getSessionCookie } from "@/utils/cookies.utils";
import { consultaConfiguracionByTabla, consultaConfiguracionByTablaCondicion } from "@/services/configuraciones";
import { bodyPayphonePay } from "@/services/payphone.service";
import { usePosPaymentPageHandler } from "./usePosPaymentPageHandler";
import { usePosPaymentPageState } from "./usePosPaymentPageState";

declare global {
    interface Window {
        PPaymentButtonBox: any;
    }
}

export const usePosPaymentPageEffects = (
    handler: ReturnType<typeof usePosPaymentPageHandler>,
    state: ReturnType<typeof usePosPaymentPageState>
) => {

    const {
        infoPedido
    } = state;

    const {
        handleConsultMetodoPago
    }=handler;
    useEffect(() => {
        if (infoPedido.formaPago === 'TRANSFERENCIA') {
            const consultarCatalogos = async () => {
                await handleConsultMetodoPago();
            }            
            consultarCatalogos();
            return;
        }
        if (!window.PPaymentButtonBox) return;
        const generarRender = async () => {
            const config = await bodyPayphonePay(infoPedido.total, infoPedido.id, infoPedido.cliente ? `Compra amalia - ${ infoPedido.cliente}` : `ID pago - ${infoPedido.secuencial}`);
            new window.PPaymentButtonBox(
                config
            ).render("pp-button");
        }
        generarRender();
    }, [infoPedido.formaPago]);

}