'use client'

import React, { useState } from 'react';
import style from '@styles/admin/productos.module.css'; // Asegúrate de actualizar los estilos abajo
import { Search, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useProducto } from '@/hooks/Producto/useProducto';
import { Pagination } from '@/components/pagination';
import RootLayout from '@/app/layout';
import { CardProduct } from '@/components/cardProduct';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { itemVariants } from '@/app/template';
import Loading from '@/app/loading';

interface CategoriaClientProps {
  categoriaSlug: string;
}

export default function CategoriaClient({ categoriaSlug }: CategoriaClientProps) {
  const {
    products,
    page,
    totalPage,
    onChangePage,
    onChangeSearch,
    listCategoria,
    subCategoria,
    onChangeSubCategoria, 
    loading,
    onClickGoProductPage
  } = useProducto(categoriaSlug);

  // Estado para controlar el ordenamiento por precio en la UI (puedes pasarlo luego a tu hook)
  if (loading) {
    return (
      <Loading />
    );
  }
  return (
    <div className={style.storeLayoutContainer}>

      <motion.aside variants={itemVariants} className={style.sidebarFilters}>
        {/* ================= SIDEBAR IZQUIERDO ================= */}
        <aside className={style.sidebarFilters}>
          <div className={style.sidebarSticky}>

            {/* Título de Filtros */}
            <div className={style.sidebarHeader}>
              <SlidersHorizontal size={16} />
              <h2>Filtros</h2>
            </div>

            {/* Bloque 1: Menú de Categorías */}
            <div className={style.filterSection}>
              <h3>Categorías</h3>
              <ul className={style.categoriesList}>
                {listCategoria && listCategoria.map((nombreCat: string) => {
                  // 1. Validamos cuál está activa comparando strings directos
                  const isActive = subCategoria.toLowerCase() === nombreCat.toLowerCase();

                  return (
                    <li key={nombreCat}>
                      <button
                        type="button"
                        onClick={() => onChangeSubCategoria(nombreCat)}
                        className={`${style.categoryLink} ${isActive ? style.categoryActive : ''}`}
                      >
                        <span>{nombreCat}</span>
                        <ChevronRight size={14} className={style.categoryArrow} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>
      </motion.aside>
      {/* ================= SECCIÓN DERECHA (CATÁLOGO) ================= */}
      <motion.main variants={itemVariants} className={style.mainCatalogContent}>
        <main className={style.mainCatalogContent}>

          {/* BARRA DE BÚSQUEDA */}
          <div className={style.actionsProducto}>
            <div className={style.inputSection}>
              <div className={style.searchContainer}>
                <Search size={18} className={style.searchIcon} />
                <input
                  type='text'
                  name='search'
                  placeholder="¿Qué producto buscas hoy?"
                  onChange={(e) => onChangeSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* CUADRÍCULA DE PRODUCTOS */}
          <div className={style.productsSection}>
            {products && products.length > 0 ? (
              <div className={style.productsGrid}>
                {products.map((producto: any) => (
                  <CardProduct key={producto.id} product={producto} onClickGoProductPage={onClickGoProductPage}/>
                ))}
              </div>
            ) : (
              <div className={style.noProducts}>
                <p>No se encontraron productos disponibles en esta sección.</p>
              </div>
            )}

            {/* PAGINACIÓN */}
            <Pagination
              page={page}
              totalPages={totalPage}
              onChangePage={onChangePage}
            />
          </div>

        </main>
      </motion.main>

    </div >
  );
}