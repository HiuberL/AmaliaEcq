import { useEffect } from "react";
import { usePaymentPageHandler } from "./usePaymentPageHandler";
import { usePaymentPageState } from "./usePaymentPageState";
import { searchPersonById } from "@/services/pedidos.service";
import { getSessionCookie } from "@/utils/cookies.utils";
import { consultaConfiguracionByTabla, consultaConfiguracionByTablaCondicion } from "@/services/configuraciones";
import { bodyPayphonePay } from "@/services/payphone.service";

declare global {
    interface Window {
        PPaymentButtonBox: any;
    }
}

export const usePaymentPageEffects = (
    handler: ReturnType<typeof usePaymentPageHandler>,
    state: ReturnType<typeof usePaymentPageState>,
    id: string,
    totalPagar: number
) => {
    const {
        handleConsultMetodoEnvio,
        handleConsultMetodoPago,
        aplicarDireccionEnForm
    } = handler;

    const {
        formData,
        payMethodReady,
        setCarrito,
        setFormData,
        setInfoPerson,
        setProvincia,
        setCiudad,
        setSector, carrito,
        direccionesCliente,
        setDireccionesCliente,
        setDireccionSeleccionadaId,
    } = state;


    useEffect(() => {
        const consultarCatalogos = async () => {
            const idGuardado = await getSessionCookie('amalia_cliente_id');
            await handleConsultMetodoEnvio();
            await handleConsultMetodoPago();
            const provincias = await consultaConfiguracionByTabla('TL_PROVINCIAS');
            setProvincia(provincias);
            const ciudades = await consultaConfiguracionByTablaCondicion('TL_CIUDADES', provincias[0].codigo);
            setCiudad(ciudades);
            const sector = await consultaConfiguracionByTablaCondicion('TL_PARROQUIAS', ciudades[0].codigo);
            setSector(sector);

            if (idGuardado) {
                const response = await searchPersonById(idGuardado);
                setInfoPerson(response.form);
                setFormData(response.form);
                setDireccionesCliente(response.direcciones);
            }

            setCarrito(id);
        };
        consultarCatalogos();
    }, []);

    useEffect(() => {
        const consultarCatalogosProvincia = async () => {
            if (formData.provincia !== '') {
                const ciudades = await consultaConfiguracionByTablaCondicion('TL_CIUDADES', formData.provincia.split('-')[0]);
                setCiudad(ciudades);
                if (formData.sector === '') {
                    const sector = await consultaConfiguracionByTablaCondicion('TL_PARROQUIAS', ciudades[0]?.codigo);
                    setSector(sector);
                }
            }
        };
        consultarCatalogosProvincia();
    }, [formData.provincia]);

    useEffect(() => {
        const consultarCatalogosCiudad = async () => {
            if (formData.ciudad !== '') {
                const sector = await consultaConfiguracionByTablaCondicion('TL_PARROQUIAS', formData.ciudad.split('-')[0]);
                setSector(sector);
            }
        };
        consultarCatalogosCiudad();
    }, [formData.ciudad]);

    useEffect(() => {
        if (!payMethodReady || formData.metodoPago === 'TRANSFERENCIA') return;
        if (!window.PPaymentButtonBox) return;
        const generarRender = async () => {
            const config = await bodyPayphonePay(totalPagar, carrito, formData.celular ? `Compra amalia - ${formData.celular}` : `ID pago - ${id}`);

            new window.PPaymentButtonBox(
                config
            ).render("pp-button");

        }
        generarRender();
    }, [payMethodReady]);

    useEffect(() => {
        if (direccionesCliente && direccionesCliente.length > 0) {
            const preferida = direccionesCliente.find((dir: any) => dir.preferencia);
            const idInicial = preferida ? preferida.id : direccionesCliente[0].id;

            setDireccionSeleccionadaId(idInicial);

            // Opcional: Autocompletar formData con la dirección preferida
            const dirActiva = preferida || direccionesCliente[0];
            aplicarDireccionEnForm(dirActiva);
        } else {
            setDireccionSeleccionadaId('otra');
        }
    }, [direccionesCliente]);

}