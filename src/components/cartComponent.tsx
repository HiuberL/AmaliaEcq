'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/hooks/Cart/useCart'; // Tu hook unificador
import styles from '@styles/shared/cartSidebar.module.css';
import { Trash } from 'lucide-react';
import Loading from '@/app/loading';

export default function CartContent() {
  const { loading,carrito,onChangeValue,onGoPagePayment } = useCart(true);

  if (loading) {
    return <Loading/>;
  }

  const detalles = carrito?.carrito_detalle ?? [];

  if (detalles.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <p>Tu carrito está vacío.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.itemsList}>
        {detalles.map((item: any) => {
          // Extraemos de forma segura los objetos anidados resueltos por Directus
          const variante = item.variante_id;
          const producto = variante?.producto_id;
          
          const esDecant = variante?.sku?.includes('-99') || false;
          
          // Accedemos a la información del producto cruzado
          const nombreProducto = producto?.nombre || "Producto sin Nombre";
          const sku = variante?.sku || "Producto sin registrar";
          const precioProducto = variante?.precio || 0;
          const precioProductoD = producto?.descuento > 0 ? (variante.precio * (1-producto?.descuento/100)) : (variante.precio * (1-variante?.descuento/100)) 
          
          // Mandamos el campo de imagen directo de la base de datos como solicitaste
          const urlImagen = producto?.imagen || 'assets/no_photo.webp';

          return (
            <div key={item.id} className={styles.cartItem}>
              {/* Renderizado con la ruta directa de la imagen */}
              <img 
                src={urlImagen} 
                alt={nombreProducto} 
                className={styles.itemImage} 
              />

              <div className={styles.itemDetails}>
                <h4 className={styles.itemName}>{nombreProducto}</h4>
                <p className={styles.itemSku}>{sku}</p>
                
                {esDecant && (
                  <span className={styles.decantBadge}>
                    OpenBox
                  </span>
                )}
                { precioProducto != precioProductoD ? (
                 <p className={styles.itemPrice}>${(precioProductoD*item.cantidad).toFixed(2)}</p>   
                ):(

                 <p className={styles.itemPrice}>${(precioProducto*item.cantidad).toFixed(2)}</p>   

                )
                }
                
                
                {/* Controladores de cantidad */}
                <div className={styles.quantityActions}>
                  <div className={styles.quantitySelector}>
                    <button onClick={() => onChangeValue(item.id, item.cantidad - 1)}>
                      &minus;
                    </button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => onChangeValue(item.id, item.cantidad + 1)}>
                      +
                    </button>
                  </div>

                  <button 
                    className={styles.removeBtn} 
                    onClick={() => onChangeValue(item.id, 0)}
                  >
                    <Trash width={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PIE DE PÁGINA INTERNO DEL CONTENIDO */}
      <footer className={styles.footerInternal}>
        <div className={styles.actionsGrid}>
          <a href="/carrito" className={styles.viewCartBtn}>
            Ver Carrito Completo
          </a>
          <button className={styles.checkoutBtn} onClick={()=> onGoPagePayment()}>
            Proceder al Pago
          </button>
        </div>
      </footer>
    </>
  );
}