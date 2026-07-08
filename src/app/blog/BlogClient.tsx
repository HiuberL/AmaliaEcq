'use client'

import style from '@styles/admin/productos.module.css'; // Asegúrate de actualizar los estilos abajo
import { Search, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Pagination } from '@/components/pagination';
import { motion } from 'framer-motion';
import { itemVariants } from '@/app/template';
import Loading from '@/app/loading';
import { useBlog } from '@/hooks/Blog/useBlog';
import { CardBlog } from '@/components/cardBlog';


export default function BlogClient() {
  const {
    loading,
    blogPost,
    categoriaT,
    setCategoria,
    setBusqueda,
    page,
    onChangePage,
    maxPage,
    onClickGotoBlogSection,
    categoria
  } = useBlog();
  if (loading || !blogPost) {
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
                {categoriaT && categoriaT.map((nombreCat: string) => {
                  // 1. Validamos cuál está activa comparando strings directos
                  const isActive = categoria.toLowerCase() === nombreCat.toLowerCase();

                  return (
                    <li key={nombreCat}>
                      <button
                        type="button"
                        onClick={() => setCategoria(nombreCat)}
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
                  placeholder="¿Qué deseas conocer hoy?"
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* CUADRÍCULA DE PRODUCTOS */}

          <div className={style.productsSection}>
            {blogPost && blogPost.length > 0 ? (
              <div className={style.blogGrid}>
                {blogPost.map((blog: any) => (
                  <CardBlog key={blog.id} blog={blog} onClickGoBlogDetail={onClickGotoBlogSection}/>
                ))}
              </div>
            ) : (
              <div className={style.noBlog}>
                <p>No se encontraron productos disponibles en esta sección.</p>
              </div>
            )}

            {/* PAGINACIÓN */}
            <Pagination
              page={page}
              totalPages={maxPage}
              onChangePage={onChangePage}
            />
          </div>

        </main>
      </motion.main>

    </div >
  );
}