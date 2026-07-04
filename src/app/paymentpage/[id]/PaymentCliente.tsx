'use client';

import React, { useEffect, useState } from 'react';
import styles from '@styles/admin/paymentPage.module.css';
import { usePaymentPage } from '@/hooks/PaymentPage/usePaymentPage';
import Loading from '@/app/loading';
import BotonRegresar from '@/components/returnButton';
import Script from 'next/script';
import Link from 'next/link';


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
  id: string;
}

export default function PaymentCliente({ carrito, id }: CarritoProps) {
  const {
    paso,
    formData,
    onChangeData,
    setPaso,
    metodoEnvio,
    setFormData,
    payMethodReady,
    onFinishForm,
    porcentajeProgreso,
    metodoSeleccionado,
    esEnvioDomicilio,
    puntosDisponibles,
    dineroPuntos,
    detalles,
    subtotalCompleto,
    costoEnvio,
    descuentoPuntos,
    totalPagar,
    provincia,
    ciudad,
    sector,
    valorUnPunto,
    onLostFocusCell,
    formRef,
    metodoPago,
    onChangeDataTransfer,
    formTransfer,
    onChangeImage,
    nombreArchivo
  } = usePaymentPage(id, carrito);

  if (!metodoEnvio && !provincia && !ciudad && !sector) {
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
      />

      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutLayout}>

          {/* COLUMNA IZQUIERDA: FORMULARIO Y PASOS */}
          <div className={styles.checkoutFormCard}>
            {!payMethodReady ?
              <>
                <BotonRegresar fallbackRoute='/' label='Regresar' />
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
                <form ref={formRef} onSubmit={(e) => e.preventDefault()} className={styles.stepForm}>

                  {/* PASO 1: Datos Personales */}
                  {paso === 1 && (
                    <div className={`${styles.formStepContent} ${styles.dynamicFade}`}>
                      <h2 className={styles.stepTitle}>Datos Personales</h2>
                      <p>
                        ¿Ya has comprado con nosotros? Ingresa tu número de celular y completaremos
                        automáticamente tus datos si los encontramos. Si ya tienes una cuenta,
                        también puedes{" "}
                        <Link href="/login">iniciar sesión</Link>{" "}
                        para continuar más rápido.
                      </p>
                      <br />

                      <div className={styles.formGrid2}>
                        <div className={styles.formGroup}>
                          <label>Correo Electrónico</label>
                          <input type="email" name="correo" value={formData.correo} onChange={onChangeData} required />
                        </div>

                        <div className={styles.formGroup}>
                          <label>Celular</label>
                          <input type="tel" name="celular" value={formData.celular} onChange={onChangeData} onBlur={onLostFocusCell} required />
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
                              {provincia.map((p: any) => (
                                <option key={p.codigo} value={`${p.codigo}-${p.valor}`}>
                                  {p.valor}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className={styles.formGroup}>
                            <label>Ciudad</label>
                            <select name="ciudad" value={formData.ciudad} onChange={onChangeData}>
                              {ciudad.map((p: any) => (
                                <option key={p.codigo} value={`${p.codigo}-${p.valor}`}>
                                  {p.valor}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className={`${styles.formGroup} ${styles.fullWidthColumn}`}>
                            <label>Sector</label>
                            <select name="sector" value={formData.sector} onChange={onChangeData}>
                              {sector.map((p: any) => (
                                <option key={p.codigo} value={`${p.codigo}-${p.valor}`}>
                                  {p.valor}
                                </option>
                              ))}
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
                        <div
                          className={`${styles.puntosRewardsBox} ${formData.usarPuntos ? styles.puntosActivos : ""
                            }`}
                        >
                          <div className={styles.puntosInfo}>
                            <span className={styles.puntosIcon}>✨</span>
                            <div>
                              <p className={styles.puntosTitle}>
                                Tienes <strong>{puntosDisponibles} puntos</strong> de recompensa
                              </p>
                              <p className={styles.puntosSubtitle}>
                                Equivalen a un descuento de{" "}
                                <strong>${dineroPuntos.toFixed(2)}</strong>
                              </p>
                            </div>
                          </div>

                          <label className={styles.switchContainer}>
                            <input
                              type="checkbox"
                              name="usarPuntos"
                              checked={formData.usarPuntos}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  usarPuntos: e.target.checked,
                                }))
                              }
                            />
                            <span className={styles.switchSlider}></span>
                          </label>

                          {formData.usarPuntos && (
                            <div className={styles.puntosRangeContainer}>
                              <div className={styles.puntosRangeHeader}>
                                <span>
                                  Utilizar <strong>{formData.puntosUsados}</strong> puntos
                                </span>

                                <button
                                  type="button"
                                  className={styles.usarTodosBtn}
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      puntosUsados: puntosDisponibles,
                                    }))
                                  }
                                >
                                  Usar todos
                                </button>
                              </div>

                              <input
                                type="range"
                                className={styles.rangeSlider}
                                min={0}
                                max={puntosDisponibles}
                                step={1}
                                value={formData.puntosUsados}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    puntosUsados: Number(e.target.value),
                                  }))
                                }
                              />

                              <div className={styles.puntosRangeInfo}>
                                <span>Descuento:</span>
                                <strong>
                                  ${(formData.puntosUsados * valorUnPunto).toFixed(2)}
                                </strong>
                              </div>
                            </div>
                          )}
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
              </> : formData.metodoPago === 'tarjeta' ? (
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
                        {metodoPago.map((banco:any, index:any) => (
                          <div key={index} className={styles.tarjetaBanco}>
                            <div className={styles.tarjetaHeader}>
                              <span className={styles.bancoNombre}>{banco.banco}</span>
                            </div>

                            <div className={styles.tarjetaDetalles}>
                              <div className={styles.detalleItem}>
                                <span className={styles.label}>Titular:</span>
                                <span className={styles.valor}>{banco.informacion.nombre}</span>
                              </div>
                              <div className={styles.detalleItem}>
                                <span className={styles.label}>Identificación / RUC:</span>
                                <span className={styles.valor}>{banco.informacion.identificacion || ''}</span>
                              </div>
                              <div className={styles.detalleItem}>
                                <span className={styles.label}>Correo electrónico:</span>
                                <span className={styles.valor}>{banco.informacion.correo}</span>
                              </div>
                              {banco.informacion.cuenta?.includes('https') ? (
                                <div className={styles.detalleItem}>
                                  <span className={styles.label}>Enlace de Pago / QR:</span>
                                  <span className={styles.valor}>
                                    <a href={banco.informacion.cuenta} target="_blank" rel="noreferrer" className={styles.enlace}>
                                      Ver detalles / Escanear QR
                                    </a>
                                  </span>
                                </div>
                              ):(
                                <div className={styles.detalleItem}>
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

                      <form onSubmit={(e) => e.preventDefault()}  className={styles.formulario}>

                        {/* Combo de Selección (Muestra las mismas cuentas habilitadas) */}
                        <div className={styles.inputGroup}>
                          <label htmlFor="cuentaSeleccionada">¿A qué cuenta realizaste el pago? *</label>
                          <select
                            id="cuentaSeleccionada"
                            name="cuentaSeleccionada"
                            value={formTransfer.cuentaSeleccionada}
                            onChange={onChangeDataTransfer}
                            className={styles.select}
                            required
                          >
                            <option value="">-- Selecciona el banco de destino --</option>
                            {metodoPago.map((banco:any, index:any) => (
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
                            onChange={onChangeDataTransfer}
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
                              onChange={onChangeImage}
                              className={styles.fileInputHidden}
                              required={!formTransfer.imagen}
                            />
                            {nombreArchivo && <span className={styles.fileName}>{nombreArchivo}</span>}
                          </div>
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                          Notificar Pago Realizado
                        </button>
                      </form>
                    </div>

                  </div>

                </>
              )
            }

            {/* BOTONES DE NAVEGACIÓN */}
            {!payMethodReady &&
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
                    onClick={() => onFinishForm()}
                    className={styles.btnSubmit}
                  >
                    Finalizar Pedido
                  </button>
                )}
              </div>
            }

          </div>

          {/* COLUMNA DERECHA: EL CARRITO COMPLETO DINÁMICO */}
          <div className={styles.checkoutCartCard}>
            <h2 className={styles.cartCardTitle}>Resumen de Compra</h2>

            <div className={styles.cartItemsWrapper}>
              {detalles.map((item: any) => {
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
                <span>{costoEnvio !== 0 ? `${costoEnvio?.toFixed(2)}` : 'Gratis'}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Descuento</span>
                <span>{descuentoPuntos !== 0 ? `-${descuentoPuntos?.toFixed(2)}` : '0.00'}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total a pagar</span>
                <span>${totalPagar?.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}