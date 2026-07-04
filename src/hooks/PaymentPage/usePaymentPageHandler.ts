import { obtenerFormasEnvio } from "@/services/cart.service";
import { FormDataPay, usePaymentPageState } from "./usePaymentPageState";
import { guardarPedido, searchPersonByPhone } from "@/services/pedidos.service";
import { removeSessionCookie } from "@/utils/cookies.utils";
import { consultarMetodosPago } from "@/services/metodoPago.service";
import { convertToBase64 } from "@/utils/cryptoInfo.utils";


export const usePaymentPageHandler = (
    state: ReturnType<typeof usePaymentPageState>,
    carritoInfo: any
) => {
    const {
        setFormData,
        formData,
        setMetodoEnvio,
        setInfoPerson,
        setPayMethodReady,
        carrito,
        setMetodoPago,
        setFormTransfer,
        formTransfer,
        setNombreArchivo
    } = state
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeTransfer = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log(name);
        setFormTransfer((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setNombreArchivo(file.name); // Guardamos el nombre para mostrarlo en el input custom

            const base64 = await convertToBase64(file);
            setFormTransfer((prev: any) => ({ ...prev, imagen: base64 })); // Guardamos el resultado Base64 listo para tu API
        } catch (error) {
            console.error("Error al convertir el archivo a Base64:", error);
            alert("No se pudo cargar la imagen, intenta con otra.");
        }
    };

    const handleSearchClient = async (e: React.FocusEvent<HTMLInputElement>) => {
        const celular = e.target.value;
        const response = await searchPersonByPhone(celular);
        console.log(response);
        setInfoPerson(response);
        setFormData(response);

    }
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

    const handleConsultMetodoPago = async () => {
        const metodoPago = await consultarMetodosPago();
        setMetodoPago(metodoPago);
    }


    const validarFormulario = (body: FormDataPay) => {
        if (!body.celular?.trim()) {
            window.showAlert('El celular es requerido para realizar un pedido', 'WARNING')
            return false
        }
        if (!body.nombre?.trim()) {
            window.showAlert('Los nombres son requeridos para realizar un pedido', 'WARNING')
            return false
        }
        if (!body.apellido?.trim()) {
            window.showAlert('Los apellidos son requeridos para realizar un pedido', 'WARNING')
            return false
        }
        if (!body.correo?.trim()) {
            window.showAlert('El correo es requerido para realizar un pedido', 'WARNING')
            return false
        }
        if (body.metodoEnvio !== "71f045a5-36b6-484e-996e-dd3e69e3644b") {
            if (!body.identificacion?.trim()) {
                window.showAlert('La identificación es requerida para realizar un pedido', 'WARNING')
                return false
            }
            if (!body.direccion?.trim()) {
                window.showAlert('La dirección es requerida para realizar un pedido', 'WARNING')
                return false

            }
            if (!body.referencia?.trim()) {
                window.showAlert('La referencia es requerida para realizar un pedido', 'WARNING')
                return false
            }
        }
        return true;
    }


    // --- LÓGICA DE CÁLCULO DE PRECIOS Y DESCUENTOS ---

    let esEnvioDomicilio;
    let metodoSeleccionado;
    let costoEnvio;
    let descuentoPuntos;
    let totalPagar;

    metodoSeleccionado =
        state.metodoEnvio?.find(
            (m: any) => m.id === state.formData.metodoEnvio
        );

    esEnvioDomicilio =
        metodoSeleccionado
            ? !metodoSeleccionado.nombre.toLowerCase().includes("retiro")
            : false;

    costoEnvio = metodoSeleccionado
        ? Number(metodoSeleccionado.valor)
        : 0;


    const puntosDisponibles = state.formData.puntosDisponibles;
    const valorUnPunto = 0.01;
    const dineroPuntos = puntosDisponibles * valorUnPunto;
    const puntosUsados = state.formData.puntosUsados * valorUnPunto;
    const porcentajeProgreso = ((state.paso - 1) / 2) * 100;

    const detalles = carritoInfo?.carrito_detalle || [];
    const subtotalCompleto = detalles.reduce((acc: any, item: any) => {
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
    descuentoPuntos = state.formData.usarPuntos
        ? puntosUsados
        : 0;

    totalPagar =
        subtotalCompleto + costoEnvio - descuentoPuntos;

    const onFinishFormTransfer = async() =>{

    }

    const onFinishForm = async () => {
        const respuesta = validarFormulario(formData);
        if (respuesta) {
            await guardarPedido(formData, carrito, costoEnvio, subtotalCompleto, totalPagar, formData.puntosUsados);
            setPayMethodReady(true);

            if (formData.metodoPago === "tarjeta") {
            } else {
            }
        }
    }
    return {
        handleChange,
        handleConsultMetodoEnvio,
        handleSearchClient,
        onFinishForm,
        totalPagar,
        porcentajeProgreso,
        metodoSeleccionado,
        esEnvioDomicilio,
        puntosDisponibles,
        dineroPuntos,
        detalles,
        subtotalCompleto,
        costoEnvio,
        descuentoPuntos,
        valorUnPunto,
        handleConsultMetodoPago,
        handleChangeTransfer,
        handleFileChange,
        onFinishFormTransfer
    }
}