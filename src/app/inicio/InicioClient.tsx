import RootLayout from "../layout";
import style from '@styles/admin/inicio.module.css'; // Ajusta la ruta a tu carpeta de estilos
export default function InicioClient() {
  return( 
<div className={style.heroContainer}>
      
      {/* Bloque de Presentación Principal (Dos Columnas en Escritorio) */}
      <div className={style.contentGrid}>
        
        {/* Columna Izquierda: Ilustración/Imagen */}
        <div className={style.imageWrapper}>
          <img 
            src="https://cdn.amaliaecq.com/persona/presentacion-sentada-temp.svg" 
            alt="Presentación Amalia"
            className={style.presentationImage}
          />
        </div>

        {/* Columna Derecha: Copys y Botón de Acción */}
        <div className={style.textWrapper}>
          <h1 className={style.mainTitle}>
            Belleza, Bienestar <br /> y esencia auténtica
          </h1>
          <p className={style.description}>
            Bienvenid@ a Amalia, donde encontrarás perfumería árabe y productos de belleza y cuidado personal auténticos en un solo lugar.
          </p>
          
          {/* Un botón de llamado a la acción le daría el toque final perfecto */}
          <a href="/tienda/perfumes" className={style.ctaButton}>
            Explorar Catálogo
          </a>
        </div>

      </div>
    </div>
  );  
}
