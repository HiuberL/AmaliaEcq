import { usePaymentPageEffects } from "./usePaymentPageEffects";
import { usePaymentPageHandler } from "./usePaymentPageHandler";
import { usePaymentPageState } from "./usePaymentPageState"

export const usePaymentPage = (id: string, carrito: any) => {
    const state = usePaymentPageState();
    const handler = usePaymentPageHandler(state);
    const puntosDisponibles = 500;
    const valorUnPunto = 0.01;
    const dineroPuntos = puntosDisponibles * valorUnPunto;
    const porcentajeProgreso = ((state.paso - 1) / 2) * 100;

    // --- LÓGICA DE CÁLCULO DE PRECIOS Y DESCUENTOS ---

    let esEnvioDomicilio;
    let metodoSeleccionado;
    let costoEnvio;
    let descuentoPuntos;
    let totalPagar;

    const detalles = carrito?.carrito_detalle || [];
    const subtotalCompleto = detalles.reduce((acc:any, item:any) => {
        const precioBase = parseFloat(item.variante_id.precio);

        // Prioridad del descuento: 1. Producto ID, 2. Variante ID
        const descuentoAplicar = item.variante_id.producto_id.descuento > 0
            ? item.variante_id.producto_id.descuento
            : item.variante_id.descuento;

        // Calcular precio unitario con descuento restado
        const precioConDescuento = precioBase - (precioBase * (descuentoAplicar / 100));

        return acc + (precioConDescuento * item.cantidad);
    }, 0);
    // Costo de envío dinámico
    if(state.metodoEnvio != null){
        metodoSeleccionado = state.metodoEnvio.find((m: any) => m.id === state.formData.metodoEnvio);
        esEnvioDomicilio = metodoSeleccionado
            ? !metodoSeleccionado.nombre.toLowerCase().includes('retiro')
            : false;
        costoEnvio = metodoSeleccionado ? parseFloat(metodoSeleccionado.valor) : 0.00;
        descuentoPuntos = state.formData.usarPuntos
            ? Math.min(subtotalCompleto + costoEnvio, dineroPuntos)
            : 0.00;
        totalPagar = (subtotalCompleto + costoEnvio) - descuentoPuntos;

    }
    const effects = usePaymentPageEffects(handler, state, id,Number(totalPagar));


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
        porcentajeProgreso: porcentajeProgreso,
        metodoSeleccionado: metodoSeleccionado,
        esEnvioDomicilio: esEnvioDomicilio,
        puntosDisponibles: puntosDisponibles,
        dineroPuntos: dineroPuntos,
        detalles: detalles,
        subtotalCompleto: subtotalCompleto,
        costoEnvio: costoEnvio,
        descuentoPuntos: descuentoPuntos,
        totalPagar: totalPagar
    }

}