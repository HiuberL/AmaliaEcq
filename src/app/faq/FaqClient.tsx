'use client';

import style from '@styles/admin/faq.module.css';
import { useFaq } from '@/hooks/Faq/useFaq';
import Loading from '../loading';

export default function FaqClient() {
  const {
    searchTerm,
    setSearchTerm,
    faqData,
    activeId,
    toggleAccordion
  } = useFaq();

  // Controlamos si la data aún está cargando o viene vacía desde el hook
  if (!faqData) {
    return (
      <Loading />
    );
  }

  return (
    <div className={style.pageWrapper}>
      {/* CABECERA DE LA PÁGINA */}
      <section className={style.heroSection}>
        <h1>Centro de Ayuda</h1>
        <p>Encuentra respuestas rápidas sobre nuestra productos, envíos y políticas.</p>
        
        {/* BUSCADOR */}
        <div className={style.searchContainer}>
          <input
            type="text"
            placeholder="¿En qué podemos ayudarte? Ej: envíos, originalidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={style.searchInput}
          />
          <span className={style.searchIcon}>🔍</span>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL DE FAQS */}
      <div className={style.container}>
        {Object.entries(faqData).map(([grupo, items]) => {
          // Filtrar preguntas según lo que el usuario escribe en el buscador
          const filteredItems = (items as any).filter(
            (item:any) =>
              item.pregunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.respuesta.toLowerCase().includes(searchTerm.toLowerCase())
          );

          // Si el grupo no tiene preguntas que coincidan con la búsqueda, no lo mostramos
          if (filteredItems.length === 0) return null;

          return (
            <div key={grupo} className={style.faqGroup}>
              {/* Título del Bloque/Grupo (Ej: Perfumería Árabe) */}
              <h2>{grupo}</h2>

              {/* Grid de Preguntas en Formato Cards */}
              <div className={style.cardsGrid}>
                {filteredItems.map((item:any, index:any) => {
                  const uniqueId = `${grupo}-${index}`;
                  const isOpen = activeId === uniqueId;

                  return (
                    <div 
                      key={uniqueId} 
                      className={`${style.faqCard} ${isOpen ? style.cardOpen : ''}`}
                    >
                      {/* Cabecera de la Card (Pregunta) */}
                      <button 
                        className={style.cardHeader} 
                        onClick={() => toggleAccordion(uniqueId)}
                        aria-expanded={isOpen}
                      >
                        <h3>{item.pregunta}</h3>
                        <span className={style.arrowIcon}>{isOpen ? '−' : '+'}</span>
                      </button>

                      {/* Cuerpo de la Card Colapsable (Respuesta) */}
                      <div className={style.cardBody}>
                        <div className={style.cardContent}>
                          {/* 🚨 CORRECCIÓN AQUÍ: Renderiza el HTML enriquecido de Directus de forma segura */}
                          <div 
                            dangerouslySetInnerHTML={{ __html: item.respuesta }} 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}