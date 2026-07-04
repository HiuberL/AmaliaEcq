import { getSessionCookie } from "@/utils/cookies.utils";
import { consultarDatosCliente } from "@/services/user.service";
import { useEspacioState } from "./useEspacioState";

export const useEspacioHandler = (
  state: ReturnType<typeof useEspacioState>
) => {
  const {
    setIdCliente,
    idCliente,
    setToken,
    token,
    setLocations,
    locations
  } = state;

  const handleConsultInformacion = async () => {
    // 1. Inicializamos variables locales con lo que ya haya en el estado
    let currentId = idCliente;
    let currentToken = token;

    // 2. Si no están en el estado, los buscamos en las cookies
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

    // 3. Validamos que tengamos los datos necesarios antes de disparar la petición
    if (!currentToken || !currentId) {
      console.warn("No se puede consultar la información: Falta token o ID de cliente.");
      return;
    }

    try {
      // 4. Pasamos las variables locales (¡que ya tienen el valor fresco de la cookie!)
      const datosCliente = await consultarDatosCliente(currentToken, currentId);
      return datosCliente;
      // Aquí podrías guardar los datos del cliente en otro set de tu estado si es necesario

    } catch (error: any) {
      const errorMessage = error?.message || "No se pudo consultar la información del cliente.";
      console.error("Error al consultar datos del cliente:", error);
      window.showAlert(errorMessage, 'ERROR');
    }
  };

  const formatearFecha = (fechaString: string) => {
    if (!fechaString) return '';

    const fecha = new Date(fechaString);

    // Validamos que sea una fecha correcta por si viene un formato extraño
    if (isNaN(fecha.getTime())) return fechaString;

    // Formato elegante: "19 de junio, 2026"
    return new Intl.DateTimeFormat('es-EC', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(fecha);
  };
  const formatearPuntos = (mov:any) => {
    const tipo = mov.tipo?.toUpperCase();
    const puntos = mov.puntos;
    // 1. Caso Traspaso (Muestra el movimiento pero podrías no querer ponerle + o - directamente)
    if (tipo === 'TRASPASO') {
      return `⇄ ${puntos}`; // O el formato que prefieras para el traspaso
    }

    // 2. Casos de Suma
    if (tipo === 'RECARGA' || tipo === 'ABONO' || tipo === 'REGALO') {
      return `+${puntos}`;
    }

    // 3. Casos de Resta
    if (tipo === 'COMPRA') {
      return `-${Math.abs(puntos)}`;
    }

    // Por si no entra en ninguna categoría
    return `${puntos}`;
  };


  const handleSetPreferred = (id: any) => {
    setLocations(locations.map(loc => ({
      ...loc,
      isPreferred: loc.id === id
    })));
  };  

  return {
    handleConsultInformacion,
    formatearFecha,
    formatearPuntos,
    handleSetPreferred
  };
};