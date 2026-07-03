import { useState } from "react";



export const useAgradecimientoState = (id:string,transaction: string) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pedido, setPedido] = useState<any>(null);
    const [idPay, setIdPay] = useState<string>(id);
    const [transactionId, setTransactionId] = useState<string>(transaction);
    
    return{ 
        loading, setLoading,
        error, setError,
        pedido, setPedido,
        idPay, setIdPay,
        transactionId, setTransactionId
    }
}