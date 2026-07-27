import { obtenerFormasEnvio } from "@/services/cart.service";
import { usePosPaymentPageState } from "./usePosPaymentPageState";
import { guardarPedido, obtenerPedidoCompleto, pagarPedido, searchPersonByPhone } from "@/services/pedidos.service";
import { removeSessionCookie } from "@/utils/cookies.utils";
import { consultarMetodosPago } from "@/services/metodoPago.service";
import { convertToBase64, uuidToNumberFecha } from "@/utils/cryptoInfo.utils";
import { useRouter } from "next/navigation";


export const usePosPaymentPageHandler = (
    state: ReturnType<typeof usePosPaymentPageState>
) => {
    const {
        setFormTransfer,
        setNombreArchivo,
        infoPedido,
        formTransfer,
        setMetodoPago
    } = state

    const router = useRouter();

    const handleConsultMetodoPago = async () => {
        const metodoPago = await consultarMetodosPago();
        setMetodoPago(metodoPago);
    }
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

        try {
            const body = {
                statusCode: 0,
                provider: formTransfer.cuentaSeleccionada,
                cardBrand: formTransfer.cuentaSeleccionada,
                transactionId: infoPedido.secuencial,
                message: "Pago en espera de verificación",
                amount: formTransfer.monto
            }
            await pagarPedido(infoPedido.id, body, formTransfer.imagen);
            router.push(`/agradecimiento?id=${formTransfer.secuencia}&clientTransactionId=${infoPedido.secuencial}`);
        } catch (e) {
            window.showAlert("No se pudo grabar el pago, escríbenos a whatsapp para realizar el soporte");
        }
    }

    return {
        handleChangeTransfer,
        handleFileChange,
        onFinishFormTransfer,
        handleConsultMetodoPago
    }
}