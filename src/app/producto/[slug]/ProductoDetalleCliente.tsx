'use client';

import React, { useState } from 'react';
import style from '@styles/admin/producto-detalle.module.css';
import { useProductoDetalle } from '@/hooks/ProductoDetalle/useProductoDetalle';
import BotonRegresar from '@/components/returnButton';
import { useCart } from '@/hooks/Cart/useCart';
import { PenSquareIcon, ShoppingBag, ShoppingCart } from 'lucide-react';
import dynamic from 'next/dynamic';

interface ProductClientProps {
    product: any; // Estructura idéntica a tu consultProductoEspecifico
}
const EditorMensajeSeguro = dynamic(() => import('@/components/EditorMensaje'), {
    ssr: false,
    loading: () => <div className={style.editorLoader}>Cargando editor premium...</div>
});
export default function ProductoDetalleClient({ product }: ProductClientProps) {
    // Estados para la interactividad visual de la página
    const {
        varianteSeleccionada, setVarianteSeleccionada,
        imagenActiva, setImagenActiva,
        cantidad, setCantidad,
        pestanaAbierta,
        onCreateResena,
        togglePestana,
        handleChange,
        formResena,
        handleChangeTextArea
    } = useProductoDetalle(product);


    const {
        onAddCart,
        onClickSolicitud
    } = useCart();

    // 1. Lógica de Precios y Descuento de la Variante Activa
    const precioBase = Number(varianteSeleccionada?.precio || 0);
    const descuento = Number(varianteSeleccionada?.descuento || product.descuento || 0);
    const tieneDescuento = descuento > 0;
    const precioFinal = tieneDescuento ? precioBase * (1 - descuento / 100) : precioBase;
    const descripcionAMostrar = varianteSeleccionada?.descripcion || product.descripcion;
    return (
        <div className={style.pageWrapper}>
            <div className={style.container}>
                <BotonRegresar fallbackRoute="/tienda/perfumes" label="Volver a la tienda" />
                {/* LAYOUT PRINCIPAL DE DOS COLUMNAS */}
                <div className={style.productGrid}>

                    {/* COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES */}
                    <div className={style.gallerySection}>
                        <div className={style.mainViewer}>
                            {imagenActiva && (
                                <img
                                    src={`${imagenActiva}` || '/assets/no_photo.webp'}
                                    alt={product.nombre}
                                    className={style.mainImage}
                                />
                            )}
                        </div>

                        {product.imagenes_productos?.length > 1 && (
                            <div className={style.thumbnailsGrid}>
                                {product.imagenes_productos.map((imgObj: any, idx: number) => (
                                    <button
                                        key={idx}
                                        className={`${style.thumbButton} ${imagenActiva === imgObj.imagen ? style.thumbActive : ''}`}
                                        onClick={() => setImagenActiva(imgObj.imagen)}
                                    >
                                        <img src={`${imgObj.imagen}`} alt={`Vista ${idx + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* COLUMNA DERECHA: INFORMACIÓN, VARIANTES Y COMPRA */}
                    <div className={style.infoSection}>
                        <span className={style.brandLabel}>{product.marca}</span>
                        <h1 className={style.productName}>{product.nombre}</h1>

                        {varianteSeleccionada?.sku && (
                            <span className={style.skuText}>SKU: {varianteSeleccionada.sku}</span>
                        )}

                        {/* Muestra información de Decants si existe cantidad controlada */}
                        {varianteSeleccionada.sku.includes("-99") && (
                            <div className={style.decantBadge}>
                                <p>Dispensa disponible: {varianteSeleccionada.control_decants[0].cantidad || 0} ml</p>
                            </div>
                        )}

                        {/* CONTROL DE PRECIOS */}
                        <div className={style.priceWrapper}>
                            {tieneDescuento && (
                                <span className={style.priceBefore}>${precioBase.toFixed(2)}</span>
                            )}
                            <span className={style.priceFinal}>${precioFinal.toFixed(2)} <small>USD</small></span>
                        </div>
                        {/* COMBO BOX DE VARIANTES (Filtra por etiquetas específicas) */}
                        {product.variantes?.length > 0 && (
                            <div className={style.selectorContainer}>
                                <label htmlFor="variant-select">Seleccionar Presentación:</label>
                                <select
                                    id="variant-select"
                                    className={style.variantSelect}
                                    value={product.variantes.indexOf(varianteSeleccionada)}
                                    onChange={(e) => setVarianteSeleccionada(product.variantes[Number(e.target.value)])}
                                >
                                    {product.variantes.map((v: any, index: number) => {
                                        // Buscamos si tiene atributo de "Cantidad" o "Unico" para ponerlo de etiqueta en el combo
                                        const attrLabel = v.atributos?.find(
                                            (a: any) => a.etiqueta === 'Cantidad' || a.etiqueta === 'Unico'
                                        )?.valor || `Opción ${index + 1}`;

                                        return (
                                            <option key={index} value={index}>
                                                {attrLabel}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        )}
                        {/* ACCIONES DE COMPRA (Selector de cantidad y botón) */}
                        <div className={style.actionsGrid}>
                            <div className={`${style.quantitySelector} ${!varianteSeleccionada?.activo ? style.disabled : ''}`}>
                                <button
                                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                    disabled={!varianteSeleccionada?.activo}
                                >
                                    −
                                </button>
                                <span>{varianteSeleccionada?.activo ? cantidad : 0}</span>
                                <button
                                    onClick={() => setCantidad(cantidad + 1)}
                                    disabled={!varianteSeleccionada?.activo}
                                >
                                    +
                                </button>
                            </div>
                            {varianteSeleccionada.activo ? (
                                <button className={style.addToCartBtn} onClick={() => onAddCart(varianteSeleccionada.id, cantidad)}>
                                    <ShoppingCart width={20} />
                                    Añadir
                                </button>
                            ) : (
                                <button className={style.addToCartBtn} onClick={() => onClickSolicitud(product.nombre, varianteSeleccionada.sku, cantidad)}>
                                    <PenSquareIcon width={20} />
                                    Solicitar
                                </button>
                            )
                            }

                        </div>
                        <div className={style.divider} />

                        {/* DESCRIPCIÓN CONMUTABLE */}
                        <div className={style.quickDescription}>
                            <div
                                dangerouslySetInnerHTML={{ __html: descripcionAMostrar }}
                            />
                        </div>



                        {/* ATRIBUTOS DEL PRODUCTO EN PESTAÑAS COLAPSABLES */}
                        <div className={style.accordionWrapper}>
                            {product.atributos_producto?.map((attr: any, idx: number) => (
                                <div key={idx} className={style.accordionItem}>
                                    <button
                                        className={style.accordionHeader}
                                        onClick={() => togglePestana(`attr-${idx}`)}
                                    >
                                        <span>{attr.etiqueta}</span>
                                        <span>{pestanaAbierta === `attr-${idx}` ? '−' : '+'}</span>
                                    </button>
                                    <div className={`${style.accordionBody} ${pestanaAbierta === `attr-${idx}` ? style.bodyOpen : ''}`}>
                                        <div className={style.accordionContent}>
                                            <div
                                                dangerouslySetInnerHTML={{ __html: attr.valor }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* SECCIÓN DE RESEÑAS */}
                <section className={style.reviewsSection}>
                    <h2>Reseñas de Clientes</h2>

                    {/* Formulario para escribir reseñas */}
                    <div className={style.reviewFormCard}>
                        <h3>Compartir mi experiencia</h3>
                        <div className={style.formGrid}>
                            {/* Campo Usuario */}
                            <input
                                type="text"
                                name="usuario"
                                value={formResena.usuario}
                                onChange={handleChange}
                                placeholder="Tu nombre o alias"
                                className={style.formInput}
                            />

                            {/* Campo Puntuación */}
                            <select
                                name="puntuacion"
                                value={formResena.puntuacion}
                                onChange={handleChange}
                                className={style.formSelect}
                            >
                                <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                                <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                                <option value={3}>⭐⭐⭐ (3/5)</option>
                                <option value={2}>⭐⭐ (2/5)</option>
                                <option value={1}>⭐ (1/5)</option>
                            </select>

                            {/* Campo Comentario */}
                            <div className={style.quillWrapper}>
                                {/* ⚡ Usamos el editor aislado de forma segura */}
                                <EditorMensajeSeguro
                                    value={formResena.comentario}
                                    onChange={handleChangeTextArea}
                                    placeholder="Describe la fragancia, marca o sube fotos de referencia..."
                                />
                            </div>
                            {/* Botón corregido */}
                            <button
                                className={style.btnSubmitReview}
                                onClick={() => onCreateResena()}
                            >
                                Publicar Reseña
                            </button>
                        </div>
                    </div>

                    {/* Listado de reseñas existentes */}
                    <div className={style.reviewsList}>
                        {product.resenas?.length > 0 ? (
                            product.resenas.map((res: any, idx: number) => (
                                <div key={idx} className={style.reviewItemCard}>
                                    <div className={style.reviewHeader}>
                                        <strong>{res.usuario_anonimo || 'Cliente de Amalia'}</strong>
                                        <span className={style.stars}>{'⭐'.repeat(Number(res.puntuacion))}</span>
                                    </div>
                                    <div className={style.reviewComment}
                                        dangerouslySetInnerHTML={{ __html: res.comentario }}
                                    />
                                    <span className={style.reviewDate}>
                                        {res.created_at ?
                                            new Date(res.created_at).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })


                                            : ''}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className={style.noReviewsText}>
                                <p >Aún no hay reseñas para este perfume. ¡Sé el primero en compartir la tuya!</p>
                            </div>
                        )}
                    </div>
                </section>

            </div>
        </div>
    );
}