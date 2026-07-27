'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@styles/admin/PromoModal.module.css';

export interface BannerItem {
  image_url: string;
  link_url?: string | null;
}

export default function PromoModalClient() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('hasSeenPromoBanners');
    if (hasSeen) return;

    const checkAndLoadBanners = () => {
      const bannerCache = sessionStorage.getItem('promoBannersList');

      if (bannerCache) {
        try {
          const parsedBanners: BannerItem[] = JSON.parse(bannerCache);
          if (parsedBanners && parsedBanners.length > 0) {
            setBanners(parsedBanners);
            
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return true;
          }
        } catch (error) {
          console.error('Error al leer banners de sessionStorage:', error);
        }
      }
      return false;
    };

    const loaded = checkAndLoadBanners();

    if (!loaded) {
      const interval = setInterval(() => {
        const success = checkAndLoadBanners();
        if (success) {
          clearInterval(interval);
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('hasSeenPromoBanners', 'true');
    setIsOpen(false);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  if (!isOpen || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];
  const hasMultiple = banners.length > 1;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Botón cerrar */}
        <button 
          className={styles.closeButton} 
          onClick={handleClose}
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* Área del Banner activo */}
        <div className={styles.slideContainer}>
          <img
            src={currentBanner.image_url}
            alt="Anuncio promocional"
            width={600}
            height={600}
            className={styles.bannerImage}
          />

          {/* Botón de acción (Solo si viene el campo link_url) */}
          {currentBanner.link_url && (
            <Link 
              href={currentBanner.link_url} 
              className={styles.actionButton}
              onClick={handleClose}
            >
              Ver más
            </Link>
          )}

          {/* Controles de Navegación */}
          {hasMultiple && (
            <>
              <button 
                className={`${styles.navButton} ${styles.prev}`} 
                onClick={handlePrev}
                aria-label="Anuncio anterior"
              >
                ❮
              </button>
              <button 
                className={`${styles.navButton} ${styles.next}`} 
                onClick={handleNext}
                aria-label="Siguiente anuncio"
              >
                ❯
              </button>

              {/* Puntos de posición */}
              <div className={styles.dotsContainer}>
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    aria-label={`Ir al anuncio ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}