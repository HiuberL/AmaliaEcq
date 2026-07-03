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
        handleConsultMetodoEnvio
    } = handler;

    const {
        formData,
        payPhoneReady,
        setCarrito,
        setFormData,
        setInfoPerson,
        setProvincia,
        setCiudad,
        setSector, infoPerson,carrito
    } = state;


    useEffect(() => {
        const consultarCatalogos = async () => {
            const idGuardado = await getSessionCookie('amalia_cliente_id');
            await handleConsultMetodoEnvio();
            if (idGuardado) {
                const response = await searchPersonById(idGuardado);
                setInfoPerson(response);
            }
            const provincias = await consultaConfiguracionByTabla('TL_PROVINCIAS');
            setProvincia(provincias);
            const ciudades = await consultaConfiguracionByTablaCondicion('TL_CIUDADES', provincias[0].codigo);
            setCiudad(ciudades);
            const sector = await consultaConfiguracionByTablaCondicion('TL_PARROQUIAS', ciudades[0].codigo);
            setSector(sector);
            setFormData(infoPerson);

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
        if (!payPhoneReady) return;
        if (!window.PPaymentButtonBox) return;
        const generarRender = async () => {
            const config = await bodyPayphonePay(totalPagar, carrito, formData.celular ? `Compra amalia - ${formData.celular}` : `ID pago - ${id}`);

            new window.PPaymentButtonBox(
                config
            ).render("pp-button");

        }
        generarRender();
    }, [payPhoneReady]);
}