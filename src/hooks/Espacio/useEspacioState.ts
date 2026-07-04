import { useState } from "react";

export const useEspacioState = () => {
  const [idCliente, setIdCliente] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cliente, setCliente] = useState<any>(null);
  const [activeSidebar, setActiveSidebar] = useState('configuraciones');
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [locations, setLocations] = useState<any[]>([]);


    return{
        idCliente, setIdCliente,
        token, setToken,
        cliente, setCliente,
        activeSidebar, setActiveSidebar,
        activeTab, setActiveTab,
        locations, setLocations
    }
}