'use client';

import React, { useEffect, useState } from 'react';
import styles from '@styles/admin/paymentPage.module.css';
import { usePaymentPage } from '@/hooks/PaymentPage/usePaymentPage';
import Loading from '@/app/loading';
import BotonRegresar from '@/components/returnButton';
import Script from 'next/script';
import Link from 'next/link';
import { usePosPaymentPage } from '@/hooks/PosPaymentPage/usePosPaymentPage';



export interface PedidoProps{
  id: string;
  pedido: PedidoMapped
}

export interface ProductoPedido {
  cantidad: number;
  subtotal: number;
  sku: string;
  nombre: string | undefined;
  imagen: string | null;
}

export interface PedidoMapped {
  id: string; // Cambia a 'number' si el ID nunca es string
  estado: string;
  secuencial: string;
  formaPago: string;
  subtotal: number;
  descuento: number;
  total: number;
  fecha: Date;
  pagoUltimo: Record<string, any>; // Representa el 'respuesta ?? {}'
  pagoTotal: number;
  formaEnvio: string;
  valorEnvio: number;
  detalleEnvio: string;
  nota: string | null;
  cliente: string;
  productos: ProductoPedido[];
}

export default function PosPaymentCliente({ pedido, id }: PedidoProps) {
  const {
    infoPedido,
    metodoPago,
    handleChangeTransfer,
    formTransfer,
    handleFileChange,
    nombreArchivo,
    setNombreArchivo,
    setPayMethodReady,
    onFinishFormTransfer
  } = usePosPaymentPage(pedido);

  if (!infoPedido || !metodoPago) {
    return <Loading />
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.css"
      />

      <Script
        src="https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.js"
        type="module"
        strategy="afterInteractive"
        onReady={() => {
          setPayMethodReady(true);
        }} 
       />

      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutLayout}>

          {/* COLUMNA IZQUIERDA: FORMULARIO Y PASOS */}
          <div className={styles.checkoutFormCard}>
            { infoPedido.formaPago === 'TARJETA' ? (
                <>
                  <div id="pp-button"></div>
                </>
              ) : (
                <>
                  <div className={styles.container}>

                    {/* 1. SECCIÓN: Listado Informativo de Cuentas Habilitadas */}
                    <div className={styles.seccionInformativa}>
                      <h3 className={styles.seccionTitle}>Cuentas Disponibles para Transferencia</h3>
                      <p className={styles.seccionSubtitle}>
                        Por favor, realiza tu transferencia o depósito a cualquiera de nuestras cuentas habilitadas:
                      </p>

                      <div className={styles.listaCuentas}>
                        {metodoPago.map((banco: any, index: any) => (
                          <div key={index} className={styles.tarjetaBanco}>
                            <div className={styles.tarjetaHeader}>
                              <span className={styles.bancoNombre}>{banco.banco}</span>
                            </div>

                            <div className={styles.tarjetaDetalles}>
                              <div className={styles.detalleItem2}>
                                <span className={styles.label}>Titular:</span>
                                <span className={styles.valor}>{banco.informacion.nombre}</span>
                              </div>
                              {banco.informacion.identificacion &&
                                <div className={styles.detalleItem2}>
                                  <span className={styles.label}>Identificación / RUC:</span>
                                  <span className={styles.valor}>{banco.informacion.identificacion || ''}</span>
                                </div>
                              }
                              <div className={styles.detalleItem2}>
                                <span className={styles.label}>Correo electrónico:</span>
                                <span className={styles.valor}>{banco.informacion.correo}</span>
                              </div>
                              {banco.informacion.cuenta?.includes('https') ? (
                                <div className={styles.detalleItem2}>
                                  <span className={styles.label}>Enlace de Pago / QR:</span>
                                  <span className={styles.valor}>
                                    <a href={banco.informacion.cuenta} target="_blank" rel="noreferrer" className={styles.enlace}>
                                      Ver detalles / Escanear QR
                                    </a>
                                  </span>
                                </div>
                              ) : (
                                <div className={styles.detalleItem2}>
                                  <span className={styles.label}>Cuenta:</span>
                                  <span className={styles.valor}>{banco.informacion.cuenta}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. SECCIÓN: Formulario de Registro de Pago */}
                    <div className={styles.seccionFormulario}>
                      <h4 className={styles.formTitle}>Registra los Datos de tu Transferencia</h4>

                      <form onSubmit={(e) => e.preventDefault()} className={styles.formulario}>

                        {/* Combo de Selección (Muestra las mismas cuentas habilitadas) */}
                        <div className={styles.inputGroup}>
                          <label htmlFor="cuentaSeleccionada">¿A qué cuenta realizaste el pago? *</label>
                          <select
                            id="cuentaSeleccionada"
                            name="cuentaSeleccionada"
                            value={formTransfer.cuentaSeleccionada}
                            onChange={handleChangeTransfer}
                            className={styles.select}
                            required
                          >
                            <option value="">-- Selecciona el banco de destino --</option>
                            {metodoPago.map((banco: any, index: any) => (
                              <option key={banco.banco} value={banco.banco}>
                                {banco.banco}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Input de Secuencial */}
                        <div className={styles.inputGroup}>
                          <label htmlFor="secuencia">Número Secuencial / Referencia de Transferencia *</label>
                          <input
                            type="text"
                            id="secuencia"
                            name="secuencia"
                            placeholder="Ej: 00234512"
                            value={formTransfer.secuencia}
                            onChange={handleChangeTransfer}
                            className={styles.input}
                            required
                          />
                        </div>

                        <div className={styles.inputGroup}>
                          <label htmlFor="secuencia">Monto Transferido *</label>
                          <input
                            type="number"
                            id="monto"
                            name="monto"
                            placeholder="Ej: 20.00"
                            value={formTransfer.monto}
                            onChange={handleChangeTransfer}
                            className={styles.input}
                            required
                          />
                        </div>

                        {/* Cargar Comprobante (Estilizado) */}
                        <div className={styles.inputGroup}>
                          <label>Subir Comprobante de Pago (Imagen) *</label>
                          <div className={styles.fileUploadWrapper}>
                            <label htmlFor="file-upload" className={styles.fileUploadBtn}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                              </svg>
                              {formTransfer.imagen ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                            </label>
                            <input
                              id="file-upload"
                              type="file"
                              name="imagen"
                              accept="image/*"
                              onChange={handleFileChange}
                              className={styles.fileInputHidden}
                              required={!formTransfer.imagen}
                            />
                            {nombreArchivo && <span className={styles.fileName}>{nombreArchivo}</span>}
                          </div>
                        </div>

                        <button type="submit" className={styles.submitBtn} onClick={onFinishFormTransfer}>
                          Notificar Pago Realizado
                        </button>
                      </form>
                    </div>

                  </div>

                </>
              )
            }
          </div>

          {/* COLUMNA DERECHA: EL CARRITO COMPLETO DINÁMICO */}
          <div className={styles.checkoutCartCard}>
            <h2 className={styles.cartCardTitle}>Resumen de Compra</h2>

            <div className={styles.cartItemsWrapper}>
              {infoPedido.productos.map((item: any) => {
                return (
                  <div key={item.sku } className={styles.cartItemSample}>
                    <div className={styles.itemInfo}>
                      {/* Renderizamos la imagen del producto real */}
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className={styles.itemThumb}
                      />
                      <div>
                        <p className={styles.itemName}>{item.nombre}</p>
                        <p className={styles.itemSku}>{item.sku}</p>
                        <p className={styles.itemQty}>Cant: {item.cantidad}</p>
                      </div>
                    </div>
                    <div className={styles.itemPriceContainer}>
                      <span className={styles.itemPrice}>
                        ${(item.subtotal).toFixed(2)}
                      </span>

                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.cartTotalsSection}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>${infoPedido.subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Envío</span>
                <span>{infoPedido.valorEnvio !== 0 ? `${infoPedido.valorEnvio}` : 'Gratis'}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Descuento</span>
                <span>{infoPedido.descuento !== 0 ? `-${infoPedido.descuento?.toFixed(2)}` : '0.00'}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total a pagar</span>
                <span>${infoPedido.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}