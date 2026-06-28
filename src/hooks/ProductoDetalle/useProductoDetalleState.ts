import { useState } from "react";

export const useProductoDetalleState = (product:any) => {
    const [varianteSeleccionada, setVarianteSeleccionada] = useState<any>(product.variantes?.[0] || null);
    const [imagenActiva, setImagenActiva] = useState<string>(product.imagenes_productos?.[0]?.imagen || '');
    const [cantidad, setCantidad] = useState<number>(1);
    const [pestanaAbierta, setPestanaAbierta] = useState<string | null>(null);

    return{
        varianteSeleccionada, setVarianteSeleccionada,
        imagenActiva, setImagenActiva,
        cantidad, setCantidad,
        pestanaAbierta, setPestanaAbierta
    }
}