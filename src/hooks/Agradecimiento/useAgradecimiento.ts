import { useAgradecimientoEffects } from "./useAgradecimientoEffects";
import { useAgradecimientoHandler } from "./useAgradecimientoHandler";
import { useAgradecimientoState } from "./useAgradecimientoState"



export const useAgradecimiento = (id:string,transaction:string) =>{
    const state = useAgradecimientoState(id,transaction);
    const handler = useAgradecimientoHandler(state);
    const effect = useAgradecimientoEffects(state,handler);

    return {
        ...state,
        ...handler
    }
}