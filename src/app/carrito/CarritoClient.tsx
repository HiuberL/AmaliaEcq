'use client';

import { useCart } from '@/hooks/Cart/useCart';
import Loading from '@/app/loading';
import { Trash, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import styles from '@styles/admin/carritoPage.module.css'; // Crearemos estos estilos específicos
import BotonRegresar from '@/components/returnButton';

export default function CarritoClient() {
  const { loading, carrito, onChangeValue,onGoPagePayment } = useCart();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }

  const detalles = carrito?.carrito_detalle ?? [];

  // --- CÁLCULOS DE TOTALES ---
  const subtotal = detalles.reduce((acc: number, item: any) => {
    const variante = item.variante_id;
    const producto = variante?.producto_id;
    
    // Aplicamos exactamente tu misma lógica de precios y descuentos de Directus
    const precioUnitario = producto?.descuento > 0 
      ? (variante.precio * (1 - producto.descuento / 100)) 
      : (variante.precio * (1 - (variante?.descuento || 0) / 100));
      
    return acc + (precioUnitario * item.cantidad);
  }, 0);

  // Puedes cambiar esto si manejas costos de envío dinámicos
  const costoEnvio = subtotal > 50 ? 0 : 3.50; 
  const total = subtotal + costoEnvio;

  // --- VISTA SI EL CARRITO ESTÁ VACÍO ---
  if (detalles.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <ShoppingBag size={64} className={styles.emptyIcon} />
        <h2>Tu carrito está vacío</h2>
        <p>Parece que aún no has añadido ningún producto a tu carrito de Amalia Ec.</p>
        <Link href="/" className={styles.continueShoppingBtn}>
          <p>Ir a la tienda</p>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headerSection}>
        <BotonRegresar fallbackRoute="/tienda/perfumes" label="Volver" />
        <h1 className={styles.pageTitle}>Tu Carrito de Compras</h1>
      </div>

      <div className={styles.mainGrid}>
        {/* ================= SECCIÓN IZQUIERDA: LISTA DE PRODUCTOS ================= */}
        <section className={styles.productsSection}>
          <div className={styles.tableHeader}>
            <span>Producto</span>
            <span className={styles.hideMobile}>Precio</span>
            <span>Cantidad</span>
            <span>Total</span>
          </div>

          <div className={styles.itemsList}>
            {detalles.map((item: any) => {
              const variante = item.variante_id;
              const producto = variante?.producto_id;
              const esDecant = variante?.sku?.includes('-99') || false;
              
              const nombreProducto = producto?.nombre || "Producto sin Nombre";
              const sku = variante?.sku || "Producto sin registrar";
              
              // Tu lógica exacta de descuento
              const precioUnitario = producto?.descuento > 0 
                ? (variante.precio * (1 - producto.descuento / 100)) 
                : (variante.precio * (1 - (variante?.descuento || 0) / 100));

              const urlImagen = producto?.imagen || '/assets/no_photo.webp';

              return (
                <div key={item.id} className={styles.cartRow}>
                  {/* Info e Imagen */}
                  <div className={styles.productCell}>
                    <img src={urlImagen} alt={nombreProducto} className={styles.productImage} />
                    <div className={styles.productMeta}>
                      <h3 className={styles.productName}>{nombreProducto}</h3>
                      <p className={styles.productSku}>SKU: {sku}</p>
                      {esDecant && <span className={styles.decantBadge}>OpenBox</span>}
                    </div>
                  </div>

                  {/* Precio Unitario */}
                  <div className={`${styles.priceCell} ${styles.hideMobile}`}>
                    ${precioUnitario.toFixed(2)}
                  </div>

                  {/* Selectores de cantidad */}
                  <div className={styles.quantityCell}>
                    <div className={styles.quantitySelector}>
                      <button onClick={() => onChangeValue(item.id, item.cantidad - 1)}>&minus;</button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => onChangeValue(item.id, item.cantidad + 1)}>+</button>
                    </div>
                  </div>

                  {/* Total por fila e Icono eliminar */}
                  <div className={styles.totalCell}>
                    <span className={styles.itemTotalPrice}>
                      ${(precioUnitario * item.cantidad).toFixed(2)}
                    </span>
                    <button 
                      className={styles.deleteRowBtn} 
                      onClick={() => onChangeValue(item.id, 0)}
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= SECCIÓN DERECHA: RESUMEN DE COMPRA ================= */}
        <aside className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Resumen del pedido</h2>
            
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Envío</span>
              <span>Pueden variar costos</span>
            </div>


            <hr className={styles.divider} />

            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button className={styles.checkoutButton} onClick={()=>onGoPagePayment()}>
              Proceder al Pago Seguro
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}