import React from 'react';
import style from '@styles/admin/blogDetalle.module.css'; // O tu archivo de estilos para la vista detalle
import BotonRegresar from '@/components/returnButton';

interface BlogDetailProps {
  politica: {
    id?: string;
    slug?: string;
    titulo?: string;
    politica?: string[];
    meta_title?: string;
    meta_description?: string;
    date_updated?:string
  };
}

export default function PoliticaDetalleCliente({ politica }: BlogDetailProps) {
  if (!politica) return null;

  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        
        {/* BOTÓN DE NAVEGACIÓN */}
        <div className={style.navigationArea}>
          <BotonRegresar fallbackRoute="/" label="Regresar" />
        </div>

        {/* ARTÍCULO PRINCIPAL */}
        <article className={style.blogArticle}>
          
          {/* CABECERA DEL BLOG */}
          <header className={style.blogHeader}>
            

            {/* TÍTULO PRINCIPAL */}
            <h1 className={style.blogTitle}>{politica.titulo || 'Sin título'}</h1>
            {/* TAGS / CATEGORÍAS */}


            {/* FECHA DE PUBLICACIÓN */}
            {politica.date_updated && (
              <time className={style.blogDate}>
                {new Date(politica.date_updated).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            )}
          </header>

          {/* CUERPO DEL BLOG (HTML ENRIQUECIDO) */}
          {politica.politica && (
            <div
              className={style.blogBody}
              dangerouslySetInnerHTML={{ __html: politica.politica }}
            />
          )}
        </article>
      </div>
    </div>
  );
}