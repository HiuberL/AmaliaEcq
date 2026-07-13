import { useEffect } from "react";
import { useEspacioHandler } from "./useEspacioHandler";
import { useEspacioState } from "./useEspacioState";
import { consultaConfiguracionByTabla, consultaConfiguracionByTablaCondicion } from "@/services/configuraciones";

export const useEspacioEffects = (
  handler: ReturnType<typeof useEspacioHandler>,
  state: ReturnType<typeof useEspacioState>
) => {
  const {
    handleConsultInformacion
  } = handler;

  const {
    cliente,
    setCliente,
    setLocations,
    setCelular,
    setProvincia,
    setCiudad,
    setSector,
    formData,
    setFormData
  } = state;

  useEffect(() => {
    if (cliente?.direcciones && Array.isArray(cliente.direcciones)) {
      const direccionesMapeadas = cliente.direcciones.map((dir: any) => ({
        id: dir.id, // ID primario de la tabla en Directus
        ciudad: dir.ciudad,
        sector: dir.sector,
        direccion: dir.direccion,
        isPreferred: dir.preferencia === true // Mapeamos el booleano de Directus
      }));
      setLocations(direccionesMapeadas);
    }
  }, [cliente?.direcciones]);


  useEffect(() => {
    const constultarInformacion = async () => {
      const response = await handleConsultInformacion();
      setCliente(response);
      setCelular(response.telefono);
      const provincias = await consultaConfiguracionByTabla('TL_PROVINCIAS');
      setProvincia(provincias);
      const ciudades = await consultaConfiguracionByTablaCondicion('TL_CIUDADES', provincias[0].codigo);
      setCiudad(ciudades);
      const sector = await consultaConfiguracionByTablaCondicion('TL_PARROQUIAS', ciudades[0].codigo);
      setSector(sector);
      if (provincias.length > 0 && ciudades.length > 0 && sector.length > 0) {
        setFormData(prev => ({
          ...prev,
          provincia: `${provincias[0].codigo}-${provincias[0].valor}`,
          ciudad: `${ciudades[0].codigo}-${ciudades[0].valor}`,
          sector: `${sector[0].codigo}-${sector[0].valor}`
        }));
      }
    }
    constultarInformacion();
  }, []); // <-- Obligatorio pasar pathname aquí para que reaccione al cambiar de página
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
}