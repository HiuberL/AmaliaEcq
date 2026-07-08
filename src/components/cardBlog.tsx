import React from 'react';
import style from '@styles/shared/cardBlog.module.css';

interface BlogData {
  imagen: string | null;
  titulo: string | null;
  cuerpo: string | null;
  categoria: string[] | null;
  date_created: string | null;
  slug: string | null;
}

interface CardBlogProps {
  blog: BlogData;
  onClickGoBlogDetail: (slug: string) => void;
}

export const CardBlog: React.FC<CardBlogProps> = ({ blog, onClickGoBlogDetail }) => {
  const { imagen, titulo, cuerpo, categoria, date_created, slug } = blog;

  const handleCardClick = () => {
    if (slug) onClickGoBlogDetail(slug);
  };

  return (
    <div className={style.cardBlog} onClick={handleCardClick}>
      
      {/* 1. IZQUIERDA: IMAGEN */}
      <div className={style.imageContainer}>
        <img 
          src={imagen || '/assets/no_photo.webp'} 
          alt={titulo || 'Imagen del blog'} 
          className={style.blogImage} 
          loading="lazy"
        />
      </div>

      {/* 2. DERECHA: CONTENIDO */}
      <div className={style.blogInfo}>
        
        {/* ENCABEZADO: Título a la izq, Fecha a la der */}
        <div className={style.headerContainer}>
          <h3 className={style.blogTitle}>
            {titulo || 'Sin título'}
          </h3>

          {date_created && (
            <span className={style.blogDate}>
              {new Date(date_created).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          )}
        </div>

        {/* ABAJO DEL TÍTULO: TAGS DE CATEGORÍA */}
        {categoria && categoria.length > 0 && (
          <div className={style.tagContainer}>
            {categoria.map((cat, index) => (
              <span key={index} className={style.tag}>
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* CUERPO TRUNCADO */}
        {cuerpo && (
          <div 
            className={style.blogBody}
            dangerouslySetInnerHTML={{ __html: cuerpo }}
          />
        )}

      </div>
    </div>
  );
};