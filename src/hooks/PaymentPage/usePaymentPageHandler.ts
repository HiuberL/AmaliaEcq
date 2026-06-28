import { obtenerFormasEnvio } from "@/services/cart.service";
import { usePaymentPageState } from "./usePaymentPageState";


export const usePaymentPageHandler = (
    state: ReturnType<typeof usePaymentPageState>
) => {
    const {
        setFormData,
        formData,
        setMetodoEnvio
    } = state
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleConsultMetodoEnvio = async () => {
        const respuesta = await obtenerFormasEnvio();
        console.log(respuesta);
        setMetodoEnvio(respuesta);
        if (respuesta && respuesta.length > 0) {
            setFormData((prev) => ({
                ...prev,
                metodoEnvio: respuesta[0].id
            }));
        }

    }
    return {
        handleChange,
        handleConsultMetodoEnvio
    }
}