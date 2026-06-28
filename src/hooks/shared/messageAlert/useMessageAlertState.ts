import { useState } from "react";

export type AlertType = 'INFO' | 'WARNING' | 'ERROR';

export const useMessageAlertState = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<AlertType>('INFO');

    return{
        message,
        type,
        setMessage,
        setType
    }
}