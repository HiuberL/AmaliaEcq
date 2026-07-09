import { useState } from "react";

interface FormResena {
  productoId: string;
  usuario: string;
  puntuacion: number;
  comentario: string;
}

export const useProductoDetalleState = (product:any) => {
    const [varianteSeleccionada, setVarianteSeleccionada] = useState<any>(product.variantes?.[0] || null);
    const [imagenActiva, setImagenActiva] = useState<string>(product.imagenes_productos?.[0]?.imagen || '');
    const [cantidad, setCantidad] = useState<number>(1);
    const [formResena, setFormResena] = useState<FormResena>({
        productoId: product.id,
        usuario: '',
        puntuacion: 0,
        comentario: ''
    });

    const [pestanaAbierta, setPestanaAbierta] = useState<string | null>(null);

    return{
        varianteSeleccionada, setVarianteSeleccionada,
        imagenActiva, setImagenActiva,
        cantidad, setCantidad,
        pestanaAbierta, setPestanaAbierta,
        formResena, setFormResena
    }
}