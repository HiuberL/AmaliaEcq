'use client';

import Loading from '../loading';
import { useAgradecimiento } from '@/hooks/Agradecimiento/useAgradecimiento';
import styles from '@styles/admin/agradecimiento.module.css'

export default function AgradecimientoPage() {
  const {
    loading,
    error,
    paymentResponse,
    pedido,
    notFound
  } = useAgradecimiento();

  if (loading || !paymentResponse) return (<Loading />)

    const getStatusConfig = (code: number = 0) => {
      switch (code) {
        case 3:
          return {
            className: styles.statusApproved,
            icon: '✓',
            title: '¡Pedido Recibido Exitosamente!',
          };
        case 0:
          return {
            className: styles.statusPending,
            icon: '🕒',
            title: 'Pedido en Revisión',
          };
        case 99:
          return {
            className: styles.statusCancelled,
            icon: '✕',
            title: 'Pedido no encontrado o eliminado',
          };          
        case 2:
        default:
          return {
            className: styles.statusCancelled,
            icon: '✕',
            title: 'Pago Cancelado o Rechazado',
          };
      }
    };

    const statusConfig = getStatusConfig(paymentResponse.statusCode ??  0);

    // Formateador de moneda local
    const formatCurrency = (val: number | string) => {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
    };

    // Formateador de fecha
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('es-EC', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(date);
    };

  
  if (notFound) {
    return (
        <div className={`${styles.statusCard} ${statusConfig.className}`}>
          <div className={styles.statusIcon}>{statusConfig.icon}</div>
          <h2 className={styles.statusTitle}>{statusConfig.title}</h2>
          <p className={styles.statusMessage}>{paymentResponse.message || 'Estamos procesando tu solicitud.'}</p>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Método de Pago</span>
              <span className={styles.detailValue}>
                {paymentResponse.cardBrand} {paymentResponse.cardType ? `(${paymentResponse.cardType})` : ''}
              </span>
            </div>
          </div>
        </div>
  )
  }else {


    return (
      <div className={styles.container}>

        {/* Tarjeta de Estado del Pago */}
        <div className={`${styles.statusCard} ${statusConfig.className}`}>
          <div className={styles.statusIcon}>{statusConfig.icon}</div>
          <h2 className={styles.statusTitle}>{statusConfig.title}</h2>
          <p className={styles.statusMessage}>{paymentResponse.message || 'Estamos procesando tu solicitud.'}</p>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Nro. Secuencial</span>
              <span className={styles.detailValue}>#{pedido.secuencial}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Método de Pago</span>
              <span className={styles.detailValue}>
                {paymentResponse.cardBrand} {paymentResponse.cardType ? `(${paymentResponse.cardType})` : ''}
              </span>
            </div>
            {paymentResponse.deferredMessage && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Diferido</span>
                <span className={styles.detailValue}>{paymentResponse.deferredMessage}</span>
              </div>
            )}
            {paymentResponse.amount && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Valor Pagado</span>
                <span className={styles.detailValue}>{paymentResponse.amount}</span>
              </div>
            )}

          </div>
        </div>

        {/* Contenido Principal */}
        <div className={styles.contentLayout}>

          {/* Lista de Productos */}
          <div className={styles.productsSection}>
            <h3 className={styles.sectionTitle}>Productos en tu orden</h3>
            <div className={styles.productsList}>
              {pedido.productos.map((item: any, index: any) => (
                <div key={`${item.sku}-${index}`} className={styles.productRow}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={item.imagen || '/assets/no-photo.webp'}
                      alt={item.nombre}
                      className={styles.productImg}
                    />
                  </div>
                  <div className={styles.infoWrapper}>
                    <h4 className={styles.productName}>{item.nombre}</h4>
                    <span className={styles.productSku}>SKU: {item.sku}</span>
                  </div>
                  <div className={styles.metaWrapper}>
                    <span className={styles.productQty}>Cant: {item.cantidad}</span>
                    <span className={styles.productPrice}>{formatCurrency(item.subtotal)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar de Resumen */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sectionTitle}>Resumen de compra</h3>

            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatCurrency(pedido.subtotal)}</span>
              </div>
              {pedido.descuento > 0 && (
                <div className={`${styles.summaryRow} ${styles.discount}`}>
                  <span>Descuento</span>
                  <span>-{formatCurrency(pedido.descuento)}</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>Envío ({pedido.formaEnvio})</span>
                <span>{formatCurrency(pedido.valorEnvio)}</span>
              </div>
              <hr className={styles.divider} />
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total Pago</span>
                <span className={styles.totalAmount}>{formatCurrency(pedido.total)}</span>
              </div>
            </div>

            <div className={styles.shippingCard}>
              <h4>Información Adicional</h4>
              <h5>Información Envío</h5>
              {pedido.detalleEnvio && pedido.detalleEnvio.length > 0 && (
                <div className={styles.deliveryDetailsWrapper}>
                  {pedido.detalleEnvio.map((detalle: any, idx: any) => (
                    <div key={`envio-det-${idx}`} className={styles.deliveryDetailItem}>
                      <span className={styles.detailLabelHighlight}>{detalle.etiqueta}:</span>
                      <p className={styles.detailTextValue}>{detalle.valor}</p>
                    </div>
                  ))}
                </div>
              )}
              <br />
              <h5>Información Pedido</h5>
              <br />
              <p><strong>Cliente:</strong> {pedido.cliente}</p>
              <p><strong>Fecha Pedido:</strong> {formatDate(pedido.fecha)}</p>
            </div>

            <div className={styles.actionWrapper}>
              <button
                onClick={() => window.location.href = '/catalogo'}
                className={styles.btnPrimary}
              >
                Seguir Comprando
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}