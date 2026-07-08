import { useState } from "react";



export const useJuegaGanaState = () => {
    const SIMBOLOS = ['💎', '🔥', '👑', '🍒', '🍀', '🌟'];
    const idProductCharge = '064176d3-9051-4cf8-bd73-08b50035d083';
    const [puntosRecarga, setPuntosRecarga] = useState<number>(100);
    const [loading, setLoading] = useState<boolean>(true);
    const [puntosApuesta, setPuntosApuesta] = useState<number>(100);
    const [puntosActuales, setPuntosActuales] = useState<number>(0);
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const [idCliente, setIdCliente] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [billetera,setBilletera] = useState<any>(null);

    const [carretes, setCarretes] = useState<string[]>(['💎', '🔥', '👑']);
    return {
        SIMBOLOS,
        puntosRecarga,
        setPuntosRecarga,
        puntosApuesta,
        setPuntosApuesta,
        puntosActuales,
        setPuntosActuales,
        isSpinning,
        setIsSpinning,
        mounted,
        setMounted,
        carretes,
        setCarretes,
        loading, setLoading,
        idCliente, setIdCliente,
        token, setToken,
        idProductCharge,
        billetera, setBilletera
    }
}