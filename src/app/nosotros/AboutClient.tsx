'use client';

import style from '@styles/admin/nosotros.module.css'; // Ajusta la ruta a tu carpeta

export default function NosotrosClient() {
  return (
    <div className={style.pageWrapper}>
      
      {/* 1. SECCIÓN HERO (ENCABEZADO) */}
      <section className={style.heroSection}>
        <div className={style.heroContent}>
          <h1 className={style.heroTitle}>Nuestra Esencia</h1>
          <p className={style.heroSubtitle}>Somos una tienda semi Online ubicados en la ciudad de Quito, hacemos envíos a nivel nacional por servientrega o cooperativa. Trabajamos bajo la modalidad de citas por lo que puedes separar la tuya y conocer este mundo tan maravilloso de perfumería árabe.</p>
        </div>
      </section>

      {/* 2. SECCIÓN MISIÓN (TEXTO + IMAGEN) */}
      <section className={style.storySection}>
        <div className={style.container}>
          <div className={style.gridTwoCols}>
            <div className={style.textContent}>
              <h2 className={style.sectionTitle}>Misión</h2>
              {/* === AQUÍ VA TU CONTENIDO DE MISIÓN === */}
              <p className={style.paragraph}>
                Nuestra misión es conectar a nuestros clientes con la excelencia y el lujo auténtico, 
                convirtiéndonos en su aliado de máxima confianza a la hora de elegir fragancias y productos de bienestar 
                verdaderamente originales.              </p>
              {/* ====================================== */}
            </div>
            <div className={style.imageContent}>
              <img 
                src="https://cdn.amaliaecq.com/persona/computadora-temp.svg" // Cambia esta URL por una imagen real de tu local o productos
                alt="Esencia Árabe Amalia"
                className={style.featuredImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN VISIÓN (IMAGEN + TEXTO - INVERTIDO EN PC) */}
      <section className={style.storySectionAlt}>
        <div className={style.container}>
          <div className={style.gridTwoColsReverse}>
            <div className={style.textContent}>
              <h2 className={style.sectionTitle}>Visión</h2>
              <p className={style.paragraph}>
                Ser la boutique online líder en Ecuador y el referente absoluto de confianza en perfumería 
                y cosmética, reconocida por la autenticidad inigualable de nuestros productos y por inspirar 
                elegancia y bienestar en cada hogar.
              </p>
            </div>
            <div className={style.imageContent}>
              <img 
                src="https://cdn.amaliaecq.com/persona/amalia-ideas-temp.svg" // Cambia esta URL
                alt="Cuidado Personal Amalia"
                className={style.featuredImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN VALORES (TRES COLUMNAS) */}
      <section className={style.valuesSection}>
        <div className={style.container}>
          <h2 className={style.sectionTitleCenter}>Nuestros Pilares</h2>
          <div className={style.gridThreeCols}>
            
            {/* VALOR 1 */}
            <div className={style.valueCard}>
              <div className={style.iconWrapper}>
                <img src="https://cdn.amaliaecq.com/externo/autenticidad.png" alt="Icono Autenticidad" />
              </div>
              <h3 className={style.valueTitle}>Autenticidad</h3>
              <p className={style.valueDescription}>Garantizamos productos 100% originales, importados y seleccionados con rigurosidad.</p>
            </div>

            {/* VALOR 2 */}
            <div className={style.valueCard}>
              <div className={style.iconWrapper}>
                <img src="https://cdn.amaliaecq.com/externo/confianza.png" alt="Icono Calidad" />
              </div>
              <h3 className={style.valueTitle}>Confianza</h3>
              <p className={style.valueDescription}>Para nosotros, cada cliente es único. Nos alejamos de las ventas masivas para enfocarnos en una asesoría experta y dedicada, escuchando tus necesidades para guiarte de forma transparente hacia el producto perfecto. Tu tranquilidad es nuestro pilar fundamental.</p>
            </div>

            {/* VALOR 3 */}
            <div className={style.valueCard}>
              <div className={style.iconWrapper}>
                <img src="https://cdn.amaliaecq.com/externo/persona.png" alt="Icono Bienestar" />
              </div>
              <h3 className={style.valueTitle}>Identidad</h3>
              <p className={style.valueDescription}>Creemos firmemente que cada perfume posee su propia personalidad y alma. Nuestro propósito es ayudarte a descubrir esa esencia que resuena contigo, convirtiendo tu fragancia en una extensión de tu ser y en un ritual diario de confianza, amor propio y equilibrio.</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}