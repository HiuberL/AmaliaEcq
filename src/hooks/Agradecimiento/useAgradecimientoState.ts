import { useRef, useState } from "react";



export const useAgradecimientoState = (id:string,transaction: string) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pedido, setPedido] = useState<any>(null);
    const [idPay, setIdPay] = useState<string>(id);
    const [paymentResponse,setPaymentResponse] = useState<any>(null);
    const [transactionId, setTransactionId] = useState<string>(transaction);
    const ejecutado = useRef(false);
    return{ 
        loading, setLoading,
        error, setError,
        pedido, setPedido,
        idPay, setIdPay,
        transactionId, setTransactionId,
        ejecutado,
        paymentResponse,setPaymentResponse
    }
}