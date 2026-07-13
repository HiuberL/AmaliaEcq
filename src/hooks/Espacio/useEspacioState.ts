import { useState } from "react";

export interface FormDataPosition {
  provincia: string;
  ciudad: string;
  sector: string;
  direccion: string;
  referencia: string;
  urlMapa: string;
}
export const useEspacioState = () => {
  const [idCliente, setIdCliente] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cliente, setCliente] = useState<any>(null);
  const [activeSidebar, setActiveSidebar] = useState('configuraciones');
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [locations, setLocations] = useState<any[]>([]);
  const [celular, setCelular] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [provincia,setProvincia] = useState<any>(null);
  const [ciudad,setCiudad] = useState<any>(null);
  const [sector,setSector] = useState<any>(null);
  const [formData, setFormData] = useState<FormDataPosition>({
    provincia: '',
    ciudad: '',
    sector: '',
    direccion: '',
    referencia: '',
    urlMapa: '',
  });

  return {
    idCliente, setIdCliente,
    token, setToken,
    cliente, setCliente,
    activeSidebar, setActiveSidebar,
    activeTab, setActiveTab,
    locations, setLocations,
    celular, setCelular,
    isModalOpen, setIsModalOpen,
    formData, setFormData,
    provincia,setProvincia,
    ciudad,setCiudad,
    sector,setSector
  }
}