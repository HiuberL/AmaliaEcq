import { PedidoMapped } from "@/app/pospaymentpage/[id]/PosPaymentCliente";
import { usePosPaymentPageHandler } from "./usePosPaymentPageHandler";
import { usePosPaymentPageState } from "./usePosPaymentPageState"
import { usePosPaymentPageEffects } from "./usePosPaymentPageEffects";

export const usePosPaymentPage = (pedido: PedidoMapped) => {
    const state = usePosPaymentPageState(pedido);
    const handler = usePosPaymentPageHandler(state);
    const effects = usePosPaymentPageEffects(handler, state);


    return {
        ... state,
        ... handler,

    }

}