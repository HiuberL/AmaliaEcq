import React, { useState, useMemo } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import style from '@styles/shared/cardProduct.module.css';
import { useCart } from '@/hooks/Cart/useCart';
import { useLayout } from '@/hooks/Layout/useLayout';

interface Opcion {
  etiqueta: string;
  valor: string;
}

interface Variante {
  id: string;
  estado: boolean;
  precio: string; // Viene como string "0.00" del servicio
  descuento:string;
  opciones: Opcion[];
}

interface ProductoData {
  id: string;
  nombre: string;
  imagen: string | null;
  slug: string;
  marca: string;
  meta: { title: string | null; description: string | null };
  precios: { minPrecio: number; maxPrecio: number };
  variantes: Variante[];
  descuento_general: number;
  etiquetaDescuento: string;
}

interface CardProductProps {
  product: ProductoData;
  onClickGoProductPage: (slug:string) => void;
}

export const CardProduct: React.FC<CardProductProps> = ({ product, onClickGoProductPage }) => {
  const { nombre, imagen, marca, variantes, descuento_general,etiquetaDescuento, precios } = product;
    const {
        onAddCart
    } = useCart();
  // 1. Agrupar de forma dinámica todas las opciones únicas disponibles en los combos (ej: "Cantidad")
  const mapeoCombos = useMemo(() => {
    const grupos: Record<string, Set<string>> = {};
    variantes.forEach(v => {
      if (v.estado) {
        v.opciones.forEach(o => {
          if (!grupos[o.etiqueta]) grupos[o.etiqueta] = new Set();
          grupos[o.etiqueta].add(o.valor);
        });
      }
    });

    // Convertimos los Sets a Arrays para poder mapearlos en el JSX
    return Object.keys(grupos).reduce((acc, key) => {
      acc[key] = Array.from(grupos[key]);
      return acc;
    }, {} as Record<string, string[]>);
  }, [variantes]);

  // 2. Estado para almacenar qué valor seleccionó el usuario de cada combo
  // Inicializa automáticamente con el primer valor de cada etiqueta
  const [seleccionados, setSeleccionados] = useState<Record<string, string>>(() => {
    const estadoInicial: Record<string, string> = {};
    Object.keys(mapeoCombos).forEach(etiqueta => {
      if (mapeoCombos[etiqueta].length > 0) {
        estadoInicial[etiqueta] = mapeoCombos[etiqueta][0];
      }
    });
    return estadoInicial;
  });

  // 3. Manejar el cambio de opción en los combos
  const handleSelectChange = (etiqueta: string, valor: string) => {
    setSeleccionados(prev => ({ ...prev, [etiqueta]: valor }));
  };

  // 4. Buscar cuál variante del JSON coincide EXACTAMENTE con lo que el usuario eligió en los combos
  const varianteSeleccionada = useMemo(() => {
    return variantes.find(v => {
      if (!v.estado) return false;
      // Revisa si todas las opciones de la variante coinciden con el estado "seleccionados"
      return v.opciones.every(o => seleccionados[o.etiqueta] === o.valor);
    });
  }, [variantes, seleccionados]);

  // 5. Determinar qué precio mostrar en la tarjeta

  const descuento = descuento_general > 0 ? descuento_general:varianteSeleccionada?.descuento || 0;
  const precioAMostrar = varianteSeleccionada 
    ? parseFloat(varianteSeleccionada.precio) 
    : precios.minPrecio;

  const precioDescuento = precioAMostrar * (1-Number(descuento)/100);

  return (
    <div className={style.cardProduct}>
      
      {/* CONTENEDOR DE LA IMAGEN */}
      <div className={style.imageContainer}  onClick={()=>onClickGoProductPage(product.slug)}>
        <img 
          src={imagen || '/assets/no_photo.webp'} 
          alt={nombre} 
          className={style.productImage} 
          loading="lazy"
        />
        {etiquetaDescuento && <span className={style.discountBadge}>Oferta</span>}
      </div>

      {/* INFORMACIÓN DEL PRODUCTO */}
      <div className={style.productInfo}>
        {marca && <span className={style.productBrand}>{marca}</span>}
        <h3 className={style.productName}>{nombre}</h3>
        
        {/* PRECIO DINÁMICO (Cambia de acuerdo al combo elegido) */}
        <div className={style.priceContainer}>
          {precioDescuento !== precioAMostrar ? (
            <>
              {/* Si hay descuento, mostramos el precio base tachado */}
              <span className={style.oldPrice}>
                ${precioAMostrar.toFixed(2)}
              </span>
              {/* Y al lado el precio final con el descuento aplicado */}
              <span className={style.currentPrice}>
                ${precioDescuento.toFixed(2)} <small>USD</small>
              </span>
            </>
          ) : (
            /* Si no hay descuento, solo mostramos el precio normal */
            <span className={style.currentPrice}>
              ${precioAMostrar.toFixed(2)} <small>USD</small>
            </span>
          )}
        </div>

        {/* COMBOS DINÁMICOS (Renderiza N combos según las etiquetas existentes) */}
        <div className={style.variantsSelectors}>
          {Object.keys(mapeoCombos).map((etiqueta) => (
            <div key={etiqueta} className={style.selectGroup}>
              <label className={style.selectLabel}>{etiqueta}:</label>
              <select
                className={style.variantSelect}
                value={seleccionados[etiqueta] || ''}
                onChange={(e) => handleSelectChange(etiqueta, e.target.value)}
              >
                {mapeoCombos[etiqueta].map((valor) => (
                  <option key={valor} value={valor}>
                    {valor}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* ACCIONES DE COMPRA ABAJO */}
        <div className={style.cardActions}>
          <button 
            className={style.addToCartBtn}
            disabled={!varianteSeleccionada || parseFloat(varianteSeleccionada.precio) === 0}
            onClick={()=>onAddCart(varianteSeleccionada?.id || '',1)}
          >
            <ShoppingCart size={16} /> Añadir
          </button>
          <button className={style.viewDetailsBtn} title="Ver detalles" onClick={()=>onClickGoProductPage(product.slug)}>
            <Eye size={16} />
          </button>
        </div>

        {etiquetaDescuento && <span className={style.discountText}>{etiquetaDescuento}</span>}
      </div>
    </div>
  );
};