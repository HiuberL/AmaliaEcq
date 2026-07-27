import { PedidoMapped } from "@/app/pospaymentpage/[id]/PosPaymentCliente";
import { useRef, useState } from "react";
import { FormTransfer } from "../PaymentPage/usePaymentPageState";


export const usePosPaymentPageState = (pedido:PedidoMapped) => {
  const [infoPedido, setInfoPedido] = useState<PedidoMapped>(pedido);
  const [nombreArchivo, setNombreArchivo] = useState<any>(null);
  const [metodoPago, setMetodoPago] = useState<any>(null);

  const [formTransfer, setFormTransfer] = useState<FormTransfer>({
    cuentaSeleccionada: "",
    monto: 0,
    secuencia:"",
    imagen: ""
  });

  return {
    metodoPago, setMetodoPago,
    infoPedido, setInfoPedido,
    formTransfer, setFormTransfer,
    nombreArchivo, setNombreArchivo
  }
}