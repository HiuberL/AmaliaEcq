'use client';

import React, { useState } from 'react';
import styles from '@styles/admin/paymentPage.module.css';
import { usePaymentPage } from '@/hooks/PaymentPage/usePaymentPage';
import Loading from '@/app/loading';
import BotonRegresar from '@/components/returnButton';


// Interfaces basadas en tu JSON exacto
interface ProductoID {
  imagen: string;
  nombre: string;
  descuento: number;
}

interface VarianteID {
  sku: string;
  precio: string;
  descuento: number;
  producto_id: ProductoID;
}

interface CarritoDetalle {
  id: string;
  cantidad: number;
  variante_id: VarianteID;
}

interface CarritoProps {
  carrito: {
    id: string;
    cliente_id: string | null;
    metodo_envio: string | null;
    estado: string;
    carrito_detalle: CarritoDetalle[];
  };
}

export default function PaymentCliente({ carrito }: CarritoProps) {
  const {
    paso,
    formData,
    onChangeData,
    setPaso,
    metodoEnvio,
    setFormData
  } = usePaymentPage();

  if (!metodoEnvio) {
    return <Loading />
  }
const puntosDisponibles = 500; 
const valorUnPunto = 0.01;
const dineroPuntos = puntosDisponibles * valorUnPunto;
  const porcentajeProgreso = ((paso - 1) / 2) * 100;

  // --- LÓGICA DE CÁLCULO DE PRECIOS Y DESCUENTOS ---
  const detalles = carrito?.carrito_detalle || [];

  const subtotalCompleto = detalles.reduce((acc, item) => {
    const precioBase = parseFloat(item.variante_id.precio);

    // Prioridad del descuento: 1. Producto ID, 2. Variante ID
    const descuentoAplicar = item.variante_id.producto_id.descuento > 0
      ? item.variante_id.producto_id.descuento
      : item.variante_id.descuento;

    // Calcular precio unitario con descuento restado
    const precioConDescuento = precioBase - (precioBase * (descuentoAplicar / 100));

    return acc + (precioConDescuento * item.cantidad);
  }, 0);

  // Costo de envío dinámico
  const metodoSeleccionado = metodoEnvio.find((m: any) => m.id === formData.metodoEnvio);
  const esEnvioDomicilio = metodoSeleccionado
    ? !metodoSeleccionado.nombre.toLowerCase().includes('retiro')
    : false;
  const costoEnvio = metodoSeleccionado ? parseFloat(metodoSeleccionado.valor) : 0.00;
const descuentoPuntos = formData.usarPuntos 
  ? Math.min(subtotalCompleto + costoEnvio, dineroPuntos) 
  : 0.00;
const totalPagar = (subtotalCompleto + costoEnvio) - descuentoPuntos;
  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutLayout}>

        {/* COLUMNA IZQUIERDA: FORMULARIO Y PASOS */}
        <div className={styles.checkoutFormCard}>
          <BotonRegresar fallbackRoute='/' label='Regresar'/>
          {/* BARRA DE PROGRESO */}
          <div className={styles.progressContainer}>
            <div className={styles.progressLabels}>
              <span className={paso >= 1 ? styles.activeStep : ""}>1. Datos</span>
              <span className={paso >= 2 ? styles.activeStep : ""}>2. Envío</span>
              <span className={paso >= 3 ? styles.activeStep : ""}>3. Pago</span>
            </div>
            <div className={styles.progressBarBackground}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${porcentajeProgreso}%` }}
              />
            </div>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={(e) => e.preventDefault()} className={styles.stepForm}>

            {/* PASO 1: Datos Personales */}
            {paso === 1 && (
              <div className={`${styles.formStepContent} ${styles.dynamicFade}`}>
                <h2 className={styles.stepTitle}>Datos Personales</h2>

                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label>Correo Electrónico</label>
                    <input type="email" name="correo" value={formData.correo} onChange={onChangeData} required />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Celular</label>
                    <input type="tel" name="celular" value={formData.celular} onChange={onChangeData} required />
                  </div>
                </div>
                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label>Nombre</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={onChangeData} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Apellido</label>
                    <input type="text" name="apellido" value={formData.apellido} onChange={onChangeData} required />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Identificación (Cédula/RUC)</label>
                  <input type="text" name="identificacion" value={formData.identificacion} onChange={onChangeData} required />
                </div>
              </div>
            )}

            {/* PASO 2: Envío */}
            {paso === 2 && (
              <div className={`${styles.formStepContent} ${styles.dynamicFade}`}>
                <h2 className={styles.stepTitle}>Método de Envío</h2>
                <div className={styles.formGroup}>
                  <label>Selecciona cómo deseas recibir tu pedido</label>
                  <select
                    name="metodoEnvio"
                    value={formData.metodoEnvio}
                    onChange={onChangeData}
                  >
                    {metodoEnvio.map((metodo: any) => (
                      <option key={metodo.id} value={metodo.id}>
                        {metodo.nombre} - {parseFloat(metodo.valor) === 0 ? 'Gratis' : `$${metodo.valor}`}
                      </option>
                    ))}
                  </select>
                </div>
                {/* CUADRO DE DETALLES DINÁMICOS DEL MÉTODO SELECCIONADO */}
                {metodoSeleccionado?.detalles && (
                  <div className={styles.metodoDetallesBox}>
                    {metodoSeleccionado.detalles.map((detalle: any, idx: number) => (
                      <p key={idx} className={styles.detalleItem}>
                        <strong>{detalle.etiqueta}:</strong>{' '}
                        {detalle.valor.startsWith('http') ? (
                          <a href={detalle.valor} target="_blank" rel="noopener noreferrer" className={styles.detalleLink}>
                            Ver ubicación en el mapa
                          </a>
                        ) : (
                          detalle.valor
                        )}
                      </p>
                    ))}
                  </div>
                )}
                {/* Mostrar solo si es Envío a Domicilio */}
                {esEnvioDomicilio && (
                  <div className={`${styles.conditionalAddressFields} ${styles.formGrid2}`}>
                    <div className={`${styles.fullWidthColumn} ${styles.subtitleForm}`}>Dirección de Entrega</div>

                    <div className={styles.formGroup}>
                      <label>Provincia</label>
                      <select name="provincia" value={formData.provincia} onChange={onChangeData}>
                        <option value="">Selecciona...</option>
                        <option value="pichincha">Pichincha</option>
                        <option value="guayas">Guayas</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Ciudad</label>
                      <select name="ciudad" value={formData.ciudad} onChange={onChangeData}>
                        <option value="">Selecciona...</option>
                        <option value="quito">Quito</option>
                        <option value="guayaquil">Guayaquil</option>
                      </select>
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidthColumn}`}>
                      <label>Sector</label>
                      <select name="sector" value={formData.sector} onChange={onChangeData}>
                        <option value="">Selecciona...</option>
                        <option value="norte">Norte</option>
                        <option value="centro">Centro</option>
                        <option value="sur">Sur</option>
                        <option value="valles">Valles</option>
                      </select>
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidthColumn}`}>
                      <label>Dirección Exacta</label>
                      <input type="text" name="direccion" value={formData.direccion} onChange={onChangeData} placeholder="Calle Principal, numeración y secundaria" />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidthColumn}`}>
                      <label>Referencia</label>
                      <input type="text" name="referencia" value={formData.referencia} onChange={onChangeData} placeholder="Ej. Junto a la farmacia" />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidthColumn}`}>
                      <label>URL del Mapa (Google Maps)</label>
                      <input type="url" name="urlMapa" value={formData.urlMapa} onChange={onChangeData} placeholder="https://goo.gl/maps/..." />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PASO 3: Forma de Pago */}
            {paso === 3 && (
              <div className={`${styles.formStepContent} ${styles.dynamicFade}`}>
                <h2 className={styles.stepTitle}>Método de Pago</h2>
                {puntosDisponibles > 0 && (
                  <div className={`${styles.puntosRewardsBox} ${formData.usarPuntos ? styles.puntosActivos : ''}`}>
                    <div className={styles.puntosInfo}>
                      <span className={styles.puntosIcon}>✨</span>
                      <div>
                        <p className={styles.puntosTitle}>Tienes <strong>{puntosDisponibles} puntos</strong> de recompensa</p>
                        <p className={styles.puntosSubtitle}>Equivalen a un descuento de <strong>${dineroPuntos.toFixed(2)}</strong></p>
                      </div>
                    </div>
                    <label className={styles.switchContainer}>
                      <input
                        type="checkbox"
                        name="usarPuntos"
                        checked={formData.usarPuntos}
                        onChange={(e) => setFormData(prev => ({ ...prev, usarPuntos: e.target.checked }))}
                      />
                      <span className={styles.switchSlider}></span>
                    </label>
                  </div>
                )}

                <div className={styles.radioOptionsList}>

                  {/* Opción Tarjeta */}
                  <label className={`${styles.radioCardOption} ${formData.metodoPago === 'tarjeta' ? styles.selected : ''}`}>
                    <input type="radio" name="metodoPago" value="tarjeta" checked={formData.metodoPago === 'tarjeta'} onChange={onChangeData} />
                    <div className={styles.radioTextContent}>
                      <span className={styles.radioTitle}>Tarjeta de Crédito / Débito</span>
                      <span className={styles.radioDescription}>Pago rápido y seguro con tu tarjeta de preferencia</span>
                    </div>
                  </label>

                  {/* Opción Transferencia */}
                  <label className={`${styles.radioCardOption} ${formData.metodoPago === 'transferencia' ? styles.selected : ''}`}>
                    <input type="radio" name="metodoPago" value="transferencia" checked={formData.metodoPago === 'transferencia'} onChange={onChangeData} />
                    <div className={styles.radioTextContent}>
                      <span className={styles.radioTitle}>Transferencia Bancaria / Depósito</span>
                      <span className={styles.radioDescription}>Te mostraremos los datos bancarios al finalizar</span>
                    </div>
                  </label>

                </div>
              </div>
            )}
          </form>

          {/* BOTONES DE NAVEGACIÓN */}
          <div className={styles.navigationButtons}>
            <button
              type="button"
              onClick={() => setPaso((prev) => Math.max(prev - 1, 1))}
              disabled={paso === 1}
              className={styles.btnBack}
            >
              Atrás
            </button>

            {paso < 3 ? (
              <button
                type="button"
                onClick={() => setPaso((prev) => Math.min(prev + 1, 3))}
                className={styles.btnNext}
              >
                Continuar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => alert('¡Pedido Procesado!')}
                className={styles.btnSubmit}
              >
                Finalizar Pedido
              </button>
            )}
          </div>

        </div>

        {/* COLUMNA DERECHA: EL CARRITO COMPLETO DINÁMICO */}
        <div className={styles.checkoutCartCard}>
          <h2 className={styles.cartCardTitle}>Resumen de Compra</h2>

          <div className={styles.cartItemsWrapper}>
            {detalles.map((item) => {
              const precioOriginal = parseFloat(item.variante_id.precio);
              const descProd = item.variante_id.producto_id.descuento;
              const descVar = item.variante_id.descuento;

              // Lógica de prioridad de descuento
              const tieneDescuentoProducto = descProd > 0;
              const descuentoEfectivo = tieneDescuentoProducto ? descProd : descVar;
              const precioCalculado = precioOriginal - (precioOriginal * (descuentoEfectivo / 100));

              return (
                <div key={item.id} className={styles.cartItemSample}>
                  <div className={styles.itemInfo}>
                    {/* Renderizamos la imagen del producto real */}
                    <img
                      src={item.variante_id.producto_id.imagen}
                      alt={item.variante_id.producto_id.nombre}
                      className={styles.itemThumb}
                    />
                    <div>
                      <p className={styles.itemName}>{item.variante_id.producto_id.nombre}</p>
                      <p className={styles.itemQty}>Cant: {item.cantidad}</p>
                      {descuentoEfectivo > 0 && (
                        <p className={styles.itemDiscountTag}>
                          -{descuentoEfectivo}% {tieneDescuentoProducto ? '(Prod)' : '(Var)'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={styles.itemPriceContainer}>
                    <span className={styles.itemPrice}>
                      ${(precioCalculado * item.cantidad).toFixed(2)}
                    </span>
                    {descuentoEfectivo > 0 && (
                      <span className={styles.itemOldPrice}>
                        ${(precioOriginal * item.cantidad).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.cartTotalsSection}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>${subtotalCompleto.toFixed(2)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Envío</span>
              <span>{costoEnvio !== 0 ? `${costoEnvio.toFixed(2)}` : 'Gratis'}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Descuento</span>
              <span>{descuentoPuntos !== 0 ? `-${descuentoPuntos.toFixed(2)}`: '0.00'}</span>
            </div>
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total a pagar</span>
              <span>${totalPagar.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}