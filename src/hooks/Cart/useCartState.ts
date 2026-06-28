import { useState } from "react";

export const useCartState = () => {
    const [carrito, setCarrito] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    return {
        carrito, setCarrito,
        loading, setLoading
    }
}