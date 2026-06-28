import { useEffect } from "react";
import { AlertType, useMessageAlertState } from "./useMessageAlertState";

export const useMessageAlertEffects = (
    state: ReturnType<typeof useMessageAlertState>
) => {
    const {
        setMessage,
        setType,
    }=state
    useEffect(() => {
        window.showAlert = (msg: string,type: AlertType = 'INFO') => {
        setMessage(msg);
        setType(type);
        setTimeout(() => setMessage(null), 3000); // Se oculta tras 3s
        };
    }, []);
}
declare global {
  interface Window { showAlert: (msg: string, type?: AlertType) => void; }
}