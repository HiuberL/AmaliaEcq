import { consultarDatosCliente } from "@/services/user.service";
import { useJuegaGanaState } from "./useJuegaGanaState";
import { getSessionCookie } from "@/utils/cookies.utils";
import { obtenerRespuestaJuego } from "@/services/billetera.service";
import { useCart } from "@/hooks/Cart/useCart";



export const useJuegaGanaHandler = (
    state: ReturnType<typeof useJuegaGanaState>
) => {
    const {
        SIMBOLOS,
        puntosApuesta,
        puntosActuales,
        setPuntosActuales,
        setIsSpinning,
        idCliente,
        token,
        setIdCliente,
        setToken,
        setCarretes,
        setBilletera,
        billetera,
        puntosRecarga,
        idProductCharge
    } = state;

    const {
        onAddCart
    } = useCart();

    const handleConsultInformacion = async () => {
        let currentId = idCliente;
        let currentToken = token;

        if (!currentId) {
            const cookieId = await getSessionCookie('amalia_cliente_id');
            currentId = cookieId || null;
            setIdCliente(currentId);
        }

        if (!currentToken) {
            const cookieToken = await getSessionCookie('amalia_token');
            currentToken = cookieToken || null;
            setToken(currentToken);
        }

        if (!currentToken || !currentId) {
            console.warn("No se puede consultar la información: Falta token o ID de cliente.");
            return;
        }

        try {
            const datosCliente = await consultarDatosCliente(currentToken, currentId);
            setBilletera(datosCliente?.billetera_id || null);
            setPuntosActuales(datosCliente?.billetera_id?.saldo_disponible || 0);
            return datosCliente;
        } catch (error: any) {
            const errorMessage = error?.message || "No se pudo consultar la información del cliente.";
            console.error("Error al consultar datos del cliente:", error);
            window.showAlert(errorMessage, 'ERROR');
        }
    };

    const handleObtainResponseGame = async() => {
        
        const request = {
            "idWallet":billetera.id,
            "pointUsed": puntosApuesta
        };
        const respone = await obtenerRespuestaJuego(request);
        return respone;
    }

    const handleChargePoints = async () =>{
        await onAddCart(idProductCharge,puntosRecarga)
    }

    const handlePlay = async () => {
        if (puntosApuesta <= 0 || puntosActuales < puntosApuesta) return;

        // Restamos la apuesta del saldo actual
        setPuntosActuales((prev) => prev - puntosApuesta);
        setIsSpinning(true);
        const response = await handleObtainResponseGame();
        console.log("Respuesta del juego:", response);
        // 1. Iniciamos un intervalo que cambia los símbolos aleatoriamente cada 100ms
        const intervalo = setInterval(() => {
            setCarretes([
                SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)],
                SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)],
                SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)],
            ]);
        }, 100);

        // 2. Después de 2 segundos (2000ms), detenemos el giro y damos el resultado
        setTimeout(() => {
            clearInterval(intervalo); // Detiene el cambio rápido

            // Aquí defines el resultado final (puedes meter tu lógica de backend/azar real aquí)
            const resultadoFinal = [
                SIMBOLOS[response.resultadoVisual[0] - 1],
                SIMBOLOS[response.resultadoVisual[1] - 1],
                SIMBOLOS[response.resultadoVisual[2]- 1],
            ];
            handleConsultInformacion();
            setCarretes(resultadoFinal);
            setIsSpinning(false);
            if(response.tipo === "Ganancia"){
                window.showAlert(`¡Felicidades! Ganaste ${response.puntosGanados} puntos y recuperaste ${response.puntosApostados}`, 'INFO');
            }
        }, 2000);
    };
    return {
        handlePlay,
        handleConsultInformacion,
        handleChargePoints
    }
}