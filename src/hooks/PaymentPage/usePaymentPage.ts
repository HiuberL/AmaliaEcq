import { usePaymentPageEffects } from "./usePaymentPageEffects";
import { usePaymentPageHandler } from "./usePaymentPageHandler";
import { usePaymentPageState } from "./usePaymentPageState"

export const usePaymentPage = () => {
    const state = usePaymentPageState();
    const handler = usePaymentPageHandler(state);
    const effects = usePaymentPageEffects(handler);
    return{
        paso: state.paso,
        setPaso: state.setPaso,
        formData: state.formData,
        setFormData: state.setFormData,
        metodoEnvio: state.metodoEnvio,
        onChangeData: handler.handleChange
    }

}