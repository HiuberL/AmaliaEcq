'use client';

import React, { useState } from 'react';
import styles from '@styles/shared/calendarioDisponibilidad.module.css';

// Estructura de horas por día devuelta por tu API
export interface TurnoHora {
  hora: string; // ej: "10:00", "11:30"
  disponible: boolean;
}

export interface DisponibilidadDia {
  fecha: string; // 'YYYY-MM-DD'
  turnos: TurnoHora[];
}

interface Props {
  disponibilidadApi?: DisponibilidadDia[];
  cargando?: boolean;
}

export default function CalendarioDisponibilidad({ disponibilidadApi = [], cargando = false }: Props) {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);

  const ano = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();

  const nombreMes = fechaActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const primerDiaMes = new Date(ano, mes, 1).getDay();
  const totalDiasMes = new Date(ano, mes + 1, 0).getDate();
  const offsetInicio = primerDiaMes === 0 ? 6 : primerDiaMes - 1;

  const mesAnterior = () => setFechaActual(new Date(ano, mes - 1, 1));
  const mesSiguiente = () => setFechaActual(new Date(ano, mes + 1, 1));

  // Mapa para búsqueda rápida O(1) de fechas
  const mapaDisponibilidad = new Map<string, TurnoHora[]>();
  disponibilidadApi.forEach(item => mapaDisponibilidad.set(item.fecha, item.turnos));

  // Obtener turnos del día seleccionado
  const turnosDelDia = diaSeleccionado ? mapaDisponibilidad.get(diaSeleccionado) || [] : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button type="button" onClick={mesAnterior} className={styles.btnNav}>&lt;</button>
        <h4 className={styles.tituloMes}>{nombreMes}</h4>
        <button type="button" onClick={mesSiguiente} className={styles.btnNav}>&gt;</button>
      </div>

      <div className={styles.diasSemanaHeader}>
        <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
      </div>

      {cargando ? (
        <div className={styles.loader}>Cargando disponibilidad...</div>
      ) : (
        <div className={styles.gridDias}>
          {/* Celdas vacías iniciales */}
          {Array.from({ length: offsetInicio }).map((_, i) => (
            <div key={`empty-${i}`} className={styles.diaVacio} />
          ))}

          {/* Días del mes */}
          {Array.from({ length: totalDiasMes }).map((_, i) => {
            const dia = i + 1;
            const mesStr = String(mes + 1).padStart(2, '0');
            const diaStr = String(dia).padStart(2, '0');
            const fechaKey = `${ano}-${mesStr}-${diaStr}`;

            const turnos = mapaDisponibilidad.get(fechaKey);
            const tieneTurnos = turnos && turnos.length > 0;
            const hayDisponibles = turnos?.some(t => t.disponible);

            let claseEstado = styles.sinDatos;
            if (tieneTurnos) {
              claseEstado = hayDisponibles ? styles.conDisponibilidad : styles.agotado;
            }

            const esSeleccionado = diaSeleccionado === fechaKey;

            return (
              <button
                key={dia}
                type="button"
                onClick={() => setDiaSeleccionado(fechaKey)}
                className={`${styles.diaCell} ${claseEstado} ${esSeleccionado ? styles.activo : ''}`}
              >
                <span className={styles.diaNumero}>{dia}</span>
                {tieneTurnos && <span className={styles.indicador} />}
              </button>
            );
          })}
        </div>
      )}

      {/* Visualización de Turnos/Horarios por Día */}
      {diaSeleccionado && (
        <div className={styles.seccionHorarios}>
          <h5 className={styles.subtituloHorarios}>
            Horarios para el <span>{diaSeleccionado}</span>:
          </h5>
          {turnosDelDia.length > 0 ? (
            <div className={styles.gridHorarios}>
              {turnosDelDia.map((t, idx) => (
                <span
                  key={idx}
                  className={`${styles.tagHora} ${t.disponible ? styles.horaDisponible : styles.horaOcupada}`}
                >
                  {t.hora} {t.disponible ? '✓' : '✕'}
                </span>
              ))}
            </div>
          ) : (
            <p className={styles.textoSinHorarios}>No hay horarios registrados para esta fecha.</p>
          )}
        </div>
      )}

      {/* Leyenda */}
      <div className={styles.leyenda}>
        <div className={styles.itemLeyenda}><span className={`${styles.punto} ${styles.verde}`} /> Disponible</div>
        <div className={styles.itemLeyenda}><span className={`${styles.punto} ${styles.rojo}`} /> Agotado</div>
      </div>
    </div>
  );
}