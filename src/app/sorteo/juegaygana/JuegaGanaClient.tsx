'use client';

import { useEffect, useState } from 'react';
import styles from '@styles/admin/juegaygana.module.css';
import { Coins } from 'lucide-react';
import { useJuegaGana } from '@/hooks/Sorteo/JuegaGana/useJuegaGana';
import Loading from '@/app/loading';

export default function JuegaYGanaPage() {

  const{
    mounted,
    puntosRecarga,
    setPuntosRecarga,
    puntosApuesta,
    puntosActuales,
    setPuntosApuesta,
    isSpinning,
    carretes,
    loading,
    handlePlay,
    billetera,
    handleChargePoints
  }=useJuegaGana();

  if(loading || !billetera){
    return <Loading />
  }

  return (
    <div className={styles.main}>
      <div className={styles.container}>

        {/* ENCABEZADO */}
        <div className={styles.header}>
          <h1 className={styles.title}>Juega y Gana</h1>
          <p className={styles.subtitle}>
            Utiliza tus puntos acumulados, desafía a la suerte y multiplica tu saldo al instante.
          </p>
        </div>

        <div className={styles.grid}>

          {/* COLUMNA IZQUIERDA */}
          <div className={styles.columnLeft}>
            <section className={styles.card}>
              <h2 className={styles.cardTitleGold}>📜 Reglas del Juego</h2>
              <ul className={styles.rulesList}>
                <li className={styles.ruleItem}>Consigue 3 símbolos iguales en línea para ganar el premio mayor.</li>
                <li className={styles.ruleItem}>Si no logras ganar, recuperas la mitad de lo apostado.</li>
                <li className={styles.ruleItem}>Si ganas obtienes el doble de lo apostado.</li>
                <li className={styles.ruleItem}>La recarga máxima por transacción es de 5,000 puntos.</li>
                <li className={styles.ruleItem}>100 pts equivalen a $1.00</li>
                <li className={styles.ruleItem}>Puedes usar los puntos únicamente en tus compras</li>
              </ul>
            </section>

            <section className={styles.card}>
              <h2 className={styles.cardTitle}>⚡ Recargar Puntos</h2>
              <div className={styles.formGroup}>
                <div className={styles.displayPanel}>
                  <span className={styles.panelLabel}>Cantidad a recargar:</span>
                  <span className={styles.panelValue}>
                    {mounted ? puntosRecarga.toLocaleString() : puntosRecarga} pts
                  </span>
                </div>

                <div className={styles.sliderWrapper}>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={puntosRecarga}
                    onChange={(e) => setPuntosRecarga(Number(e.target.value))}
                    className={styles.slider}
                  />
                  <div className={styles.sliderLabels}>
                    <span>100 PTS</span>
                    <span>2,500 PTS</span>
                    <span>5,000 PTS</span>
                  </div>
                </div>

                <div className={styles.buttonRow}>
                  <button onClick={() => setPuntosRecarga(Math.max(0, puntosRecarga - 100))} className={styles.secondaryButton}>- 100 pts</button>
                  <button onClick={() => setPuntosRecarga(Math.min(5000, puntosRecarga + 100))} className={styles.secondaryButton}>+ 100 pts</button>
                </div>

                <button className={styles.primaryButton} onClick={handleChargePoints}>Confirmar Recarga</button>
              </div>
            </section>
          </div>

          {/* COLUMNA DERECHA */}
          <div className={styles.columnRight}>

            <div className={styles.balanceCard}>
              <div className={styles.balanceInfo}>
                <span className={styles.balanceLabel}>Tu Saldo Disponible</span>
                <span className={styles.balanceValue}>
                  {puntosActuales} <span style={{ color: '#a3a3a3', fontSize: '0.85rem' }}>PTS</span>
                </span>
              </div>
              <div className={styles.balanceIcon}>
                <Coins size={22} color="#fbbf24" />
              </div>
            </div>
            {/* Contenedor dinámico usando Template Literals */}
            <div className={`${styles.slotContainer} ${isSpinning ? styles.slotContainerSpinning : ''}`}>
              <div className={styles.slotInner}>
                <div className={styles.slotBadge}>
                  {isSpinning ? '🎰 Girando carretes...' : '🎰 Tragamonedas Listo'}
                </div>

                <div className={styles.slotPlaceholder}>
                  <p className={styles.placeholderText}>[ ¿Estás list@ para probar tu suerte? ]</p>
                  <div className={styles.emojiRow}>
                    {carretes.map((emoji, index) => (
                      <div
                        key={index}
                        className={`${styles.emojiBox} ${isSpinning ? styles.emojiBoxSpinning : ''}`}
                        style={{
                          // Añade un delay sutil de animación por cada carrete para que se vea más realista
                          animationDelay: `${index * 150}ms`
                        }}
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* BARRA DE APUESTA */}
            <div className={styles.controlsBar}>
              <div className={styles.betSelector}>
                <span className={styles.betLabel}>Puntos a jugar:</span>
                <div className={styles.betControls}>
                  <button disabled={isSpinning || puntosApuesta <= 100} onClick={() => setPuntosApuesta(Math.max(100, puntosApuesta - 100))} className={styles.betButton}>-</button>
                  <input type="number" value={puntosApuesta} disabled={isSpinning} onChange={(e) => setPuntosApuesta(Math.max(100, Number(e.target.value)))} className={styles.betInput} readOnly/>
                  <button disabled={isSpinning} onClick={() => setPuntosApuesta(Math.min(billetera.saldo_disponible, puntosApuesta + 100))} className={styles.betButton}>+</button>
                </div>
              </div>

              <button
                disabled={isSpinning || puntosApuesta <= 0}
                onClick={handlePlay}
                className={`${styles.playButton} ${isSpinning ? styles.playButtonDisabled : ''}`}
              >
                {isSpinning ? 'Procesando...' : `¡JUGAR CON ${puntosApuesta} PTS!`}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}