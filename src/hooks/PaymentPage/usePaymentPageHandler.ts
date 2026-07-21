import { obtenerFormasEnvio } from "@/services/cart.service";
import { FormDataPay, usePaymentPageState } from "./usePaymentPageState";
import { guardarPedido, obtenerPedidoCompleto, pagarPedido, searchPersonByPhone } from "@/services/pedidos.service";
import { removeSessionCookie } from "@/utils/cookies.utils";
import { consultarMetodosPago } from "@/services/metodoPago.service";
import { convertToBase64, uuidToNumberFecha } from "@/utils/cryptoInfo.utils";
import { useRouter } from "next/navigation";


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
        metodoEnvio,
        formTransfer,
        setNombreArchivo,
        provincia,
        ciudad,
        sector,
        setDireccionesCliente,
        metodoEnvioSeleccionado, setMetodoEnvioSeleccionado, setDireccionSeleccionadaId
    } = state

    const router = useRouter();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name == 'metodoEnvio') {
            setMetodoEnvioSeleccionado(
                state.metodoEnvio?.find(
                    (m: any) => m.id === value
                ));
        }

    };

    const handleChangeTransfer = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
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
        const celular = e.target.value || '';

        if (celular === '') {
            const data: FormDataPay = {
                idCliente: '',
                usarPuntos: false,
                puntosUsados: 0,
                nombre: '',
                apellido: '',
                correo: '',
                celular: '',
                identificacion: '',
                metodoEnvio: '71f045a5-36b6-484e-996e-dd3e69e3644b',
                puntosDisponibles: 0,
                idDireccion: '',
                provincia: `${provincia[0].codigo}-${provincia[0].valor}`,
                ciudad: `${ciudad[0].codigo}-${ciudad[0].valor}`,
                sector: `${sector[0].codigo}-${sector[0].valor}`,
                direccion: '',
                referencia: '',
                urlMapa: '',
                metodoPago: 'TRANSFERENCIA'
            }
            setInfoPerson(data);
            setFormData(data);
            setDireccionesCliente([]);
            setMetodoEnvioSeleccionado(
                metodoEnvio?.find(
                    (m: any) => m.id === '71f045a5-36b6-484e-996e-dd3e69e3644b'
                ));

        } else {
            const response = await searchPersonByPhone(celular);
            const responseData = {
             ...response.form,
             provincia: response.form.provincia === ''? `${provincia[0].codigo}-${provincia[0].valor}`:response.form.provincia,
             ciudad: response.form.ciudad === ''? `${ciudad[0].codigo}-${ciudad[0].valor}`:response.form.ciudad,
             sector: response.form.sector === ''?  `${sector[0].codigo}-${sector[0].valor}`:response.form.sector,
            };
            setInfoPerson(responseData);
            setFormData(responseData);
            setDireccionesCliente(response.direcciones);
            setMetodoEnvioSeleccionado(
                metodoEnvio?.find(
                    (m: any) => m.id === '71f045a5-36b6-484e-996e-dd3e69e3644b'
                ));
            

        }


    }
    const handleConsultMetodoEnvio = async () => {
        const respuesta = await obtenerFormasEnvio();
        setMetodoEnvio(respuesta);
        if (respuesta && respuesta.length > 0) {
            setFormData((prev) => ({
                ...prev,
                metodoEnvio: respuesta[0].id
            }));
        }
        setMetodoEnvioSeleccionado(
            respuesta?.find(
                (m: any) => m.id === '71f045a5-36b6-484e-996e-dd3e69e3644b'
            ));
    }

    const handleConsultMetodoPago = async () => {
        const metodoPago = await consultarMetodosPago();
        setMetodoPago(metodoPago);
    }






    const onFinishFormTransfer = async () => {

        if (formTransfer.secuencia === "") {
            window.showAlert("La secuencia es necesaria para grabar el comprobante", "WARNING");
            return;
        }
        if (formTransfer.imagen === "") {
            window.showAlert("La imagen es necesaria para grabar el comprobante", "WARNING");
            return;
        }
        if (formTransfer.cuentaSeleccionada.includes("Selecciona el banco de destino")) {
            window.showAlert("El banco es necesario para grabar el comprobante", "WARNING");
            return;
        }
        if (formTransfer.monto === 0 || !formTransfer.monto) {
            window.showAlert("El monto es necesario para grabar el comprobante, debe colocar el valor que transfirió", "WARNING");
            return;
        }
        if (formTransfer.monto < 0) {
            window.showAlert("El monto debe ser positivo", "WARNING");
            return;
        }

        const transactionId = uuidToNumberFecha(carrito);
        const uuidPedido = transactionId.split("-")[0].trim();
        const pedido = await obtenerPedidoCompleto(uuidPedido);

        try {
            const body = {
                statusCode: 0,
                provider: formTransfer.cuentaSeleccionada,
                cardBrand: formTransfer.cuentaSeleccionada,
                transactionId: transactionId,
                message: "Pago en espera de verificación",
                amount: formTransfer.monto
            }
            await pagarPedido(pedido.id, body, formTransfer.imagen);
            router.push(`/agradecimiento?id=${formTransfer.secuencia}&clientTransactionId=${transactionId}`);
        } catch (e) {
            console.log(e);
            window.showAlert("No se pudo grabar el pago, escríbenos a whatsapp para realizar el soporte");
        }
    }



    // --- LÓGICA DE CÁLCULO DE PRECIOS Y DESCUENTOS ---

    let esEnvioDomicilio;
    let costoEnvio;
    let descuentoPuntos;
    let totalPagar;



    esEnvioDomicilio =
        metodoEnvioSeleccionado
            ? !metodoEnvioSeleccionado.nombre.toLowerCase().includes("retiro")
            : false;

    costoEnvio = metodoEnvioSeleccionado
        ? Number(metodoEnvioSeleccionado.valor)
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
        if(totalPagar === 0 ){
            window.showAlert('No se puede proceder a un pago en cero, contacte con la tienda para informar su problema', 'WARNING')
            return false
        }

        if (body.puntosUsados > 0) {
            if ((body.puntosUsados * 0.01) > totalPagar ){
                window.showAlert('El valor no puede ser negativo, utiliza tus puntos con una cifra menor', 'WARNING')
                return false
            }
        }

        if (body.metodoEnvio !== "71f045a5-36b6-484e-996e-dd3e69e3644b") {
            if (!body.identificacion?.trim()) {
                window.showAlert('La identificación es requerida para realizar un pedido', 'WARNING')
                return false
            }
            if (!body.provincia?.trim()) {
                window.showAlert('La provincia es requerida para realizar un pedido', 'WARNING')
                return false
            }
            if (!body.ciudad?.trim()) {
                window.showAlert('La ciudad es requerida para realizar un pedido', 'WARNING')
                return false
            }
            if (!body.sector?.trim()) {
                window.showAlert('El sector es requerida para realizar un pedido', 'WARNING')
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

    const onFinishForm = async () => {
        try{
            const respuesta = validarFormulario(formData);
            if (respuesta) {
                await guardarPedido(formData, carrito, costoEnvio, subtotalCompleto, totalPagar, formData.puntosUsados);
                setPayMethodReady(true);
            }
        }catch (e){
            window.showAlert('No se pudo registrar el pedido, contacte con la tienda','ERROR');
        }
    }
    const seleccionarDireccionGuardada = (dir: any) => {
        setDireccionSeleccionadaId(dir.id);
        aplicarDireccionEnForm(dir);
    };

    const seleccionarOtraDireccion = () => {
        setDireccionSeleccionadaId('otra');
        const dir = {
            provincia: formData.provincia,
            ciudad: formData.ciudad,
            sector: formData.sector,
            direccion: '',
            referencia: '',
            mapa: ''
        }
        aplicarDireccionEnForm(dir);
    };

    const aplicarDireccionEnForm = (dir: any) => {
        setFormData((prev: any) => ({
            ...prev,
            provincia: dir.provincia,
            ciudad: dir.ciudad,
            sector: dir.sector,
            direccion: dir.direccion || '',
            referencia: dir.referencia || '',
            urlMapa: dir.ubicacion_url || ''
        }));
    };

    return {
        handleChange,
        handleConsultMetodoEnvio,
        handleSearchClient,
        onFinishForm,
        totalPagar,
        porcentajeProgreso,
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
        onFinishFormTransfer,
        seleccionarDireccionGuardada,
        seleccionarOtraDireccion,
        aplicarDireccionEnForm
    }
}