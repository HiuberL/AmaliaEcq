import { usePaymentPageEffects } from "./usePaymentPageEffects";
import { usePaymentPageHandler } from "./usePaymentPageHandler";
import { usePaymentPageState } from "./usePaymentPageState"

export const usePaymentPage = (id: string, carrito: any) => {
    const state = usePaymentPageState();



    const handler = usePaymentPageHandler(state,carrito);

    usePaymentPageEffects(handler, state, id, Number(handler.totalPagar ?? 0));


    return {
        paso: state.paso,
        setPaso: state.setPaso,
        formData: state.formData,
        setFormData: state.setFormData,
        metodoEnvio: state.metodoEnvio,
        onChangeData: handler.handleChange,
        payPhoneReady: state.payPhoneReady,
        onFinishForm: handler.onFinishForm,
        setCarrito: state.setCarrito,
        porcentajeProgreso: handler.porcentajeProgreso,
        metodoSeleccionado: handler.metodoSeleccionado,
        esEnvioDomicilio: handler.esEnvioDomicilio,
        puntosDisponibles: handler.puntosDisponibles,
        dineroPuntos: handler.dineroPuntos,
        detalles: handler.detalles,
        subtotalCompleto: handler.subtotalCompleto,
        costoEnvio: handler.costoEnvio,
        descuentoPuntos: handler.descuentoPuntos,
        totalPagar: handler.totalPagar,
        provincia: state.provincia,
        ciudad: state.ciudad,
        sector: state.sector,
        onLostFocusCell: handler.handleSearchClient,
        valorUnPunto: handler.valorUnPunto,
        formRef: state.formRef
    }

}