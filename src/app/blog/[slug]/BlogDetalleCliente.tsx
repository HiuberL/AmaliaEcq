'use client';
import React from 'react';
import style from '@styles/admin/blogDetalle.module.css'; // O tu archivo de estilos para la vista detalle
import BotonRegresar from '@/components/returnButton';

interface BlogDetailProps {
  blog: {
    id?: string;
    titulo?: string;
    imagen_principal?: string;
    categoria?: string[];
    cuerpo?: string;
    date_created?: string;
  };
}

export default function BlogDetalleCliente({ blog }: BlogDetailProps) {
  if (!blog) return null;

  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        
        {/* BOTÓN DE NAVEGACIÓN */}
        <div className={style.navigationArea}>
          <BotonRegresar fallbackRoute="/blog" label="Volver al blog" />
        </div>

        {/* ARTÍCULO PRINCIPAL */}
        <article className={style.blogArticle}>
          
          {/* CABECERA DEL BLOG */}
          <header className={style.blogHeader}>
            

            {/* TÍTULO PRINCIPAL */}
            <h1 className={style.blogTitle}>{blog.titulo || 'Sin título'}</h1>
            {/* TAGS / CATEGORÍAS */}
            {blog.categoria && blog.categoria.length > 0 && (
              <div className={style.tagContainer}>
                {blog.categoria.map((cat, index) => (
                  <span key={index} className={style.tag}>
                    {cat}
                  </span>
                ))}
              </div>
            )}


            {/* FECHA DE PUBLICACIÓN */}
            {blog.date_created && (
              <time className={style.blogDate}>
                {new Date(blog.date_created).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            )}
          </header>

          {/* IMAGEN DE PORTADA / PRINCIPAL */}
          {blog.imagen_principal && (
            <div className={style.mainImageContainer}>
              <img
                src={blog.imagen_principal}
                alt={blog.titulo || 'Imagen del blog'}
                className={style.mainImage}
              />
            </div>
          )}

          {/* CUERPO DEL BLOG (HTML ENRIQUECIDO) */}
          {blog.cuerpo && (
            <div
              className={style.blogBody}
              dangerouslySetInnerHTML={{ __html: blog.cuerpo }}
            />
          )}

        </article>
      </div>
    </div>
  );
}