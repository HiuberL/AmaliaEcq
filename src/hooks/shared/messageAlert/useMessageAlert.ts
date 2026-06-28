import { useMessageAlertEffects } from "./useMessageAlertEffects";
import { useMessageAlertState } from "./useMessageAlertState";

export const useMessageAlert = () => {
    const state = useMessageAlertState();
    const effects = useMessageAlertEffects(state);
    return{
        type: state.type,
        message: state.message
    }
}