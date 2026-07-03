import { useSearchParams } from "next/navigation";
import { useAgradecimientoEffects } from "./useAgradecimientoEffects";
import { useAgradecimientoHandler } from "./useAgradecimientoHandler";
import { useAgradecimientoState } from "./useAgradecimientoState"



export const useAgradecimiento = () =>{
    const searchParams = useSearchParams();
    const idPay = searchParams.get("id") || "";
    const transactionId = searchParams.get("clientTransactionId") || "";    

    const state = useAgradecimientoState(idPay,transactionId);
    const handler = useAgradecimientoHandler(state);
    const effect = useAgradecimientoEffects(state,handler);

    return {
        ...state,
        ...handler
    }
}