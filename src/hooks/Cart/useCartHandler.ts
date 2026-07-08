import { actualizarCantidadDetalle, agregarAlCarrito, consultarCarritoCompleto } from "@/services/cart.service";
import { useCartState } from "./useCartState";
import { getSessionCookie } from "@/utils/cookies.utils";
import { useRouter } from "next/navigation";


export const useCartHandler = (
    setCartOpen: (estado: boolean) => void,
    state: ReturnType<typeof useCartState>
) => {
    const {
        setLoading,
        setCarrito,
        carrito
    } = state;
      const router = useRouter();
    
    const handlerConsultCarrito = async () => {
        try {
            const carrito = await consultarCarritoCompleto();
            return carrito;
        } catch (error: any) {
            window.showAlert(error.message || "No se pudo consultar el carrito.", 'ERROR');
            return null;
        }
    }
    const handlerAddCarrito = async (varianteId: string, cantidad: number) => {
        try {
            if(!carrito){
                await cargarInformacion();
            }
            await agregarAlCarrito(varianteId, cantidad);
            setCartOpen(true);
        } catch (error: any) {
            window.showAlert(error.message || "No se pudo agregar el producto al carrito.", 'ERROR');
        }
    }
    const handlerUpdateCarrito = async (detalleId: string, cantidad: number) => {
        try {
            await actualizarCantidadDetalle(detalleId, cantidad);
        } catch (error: any) {
            window.showAlert(error.message || "No se pudo actualizar la cantidad del carrito.", 'ERROR');
        }
    }
    const cargarInformacion = async () => {
        setLoading(true);
        try {
            const data = await handlerConsultCarrito();
            setCarrito(data);
        } catch (error: any) {
            window.showAlert(error.message || "No se pudo cargar la información del carrito.", 'ERROR');
        } finally {
            setLoading(false);
        }
    };

    const handlerGoPagePayment = async () =>{ 
        try {
            const guestCartId= await getSessionCookie('guest_cart_id');
            router.push(`/paymentpage/${guestCartId}`); //
        } catch (error: any) {
            window.showAlert(error.message || "No se pudo abrir la página de pago.", 'ERROR');
        }
    }

    // 2. Manejar el cambio de cantidad (+ / - / eliminar si es 0)
    const handleCambiarCantidad = async (detalleId: string, nuevaCantidad: number) => {
        try {
            // Optimistic UI: actualizamos la vista antes de esperar al servidor para máxima fluidez
            await handlerUpdateCarrito(detalleId, nuevaCantidad);

            setCarrito((prev: any) => {
                if (!prev) return prev;
                const detallesActualizados = prev.carrito_detalle
                    .map((item: any) => item.id === detalleId ? { ...item, cantidad: nuevaCantidad } : item)
                    .filter((item: any) => item.cantidad > 0);
                return { ...prev, carrito_detalle: detallesActualizados };
            });

            // Sincronizamos de vuelta para reflejar stock o datos frescos de Postgres
            const dataFresca = await handlerConsultCarrito();
            setCarrito(dataFresca);
        } catch (error: any) {
            window.showAlert(error.message || "No se pudo actualizar la cantidad por falta de stock.", 'ERROR');
            cargarInformacion(); // Si falla, revertimos al estado real en DB
        }
    };
    return {
        handlerConsultCarrito,
        handlerAddCarrito,
        handlerUpdateCarrito,
        cargarInformacion,
        handleCambiarCantidad,
        handlerGoPagePayment
    }

};