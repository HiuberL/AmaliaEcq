'use client';

import React from 'react';
import style from '@styles/admin/solicitudes.module.css'; // Ajusta la ruta a tus estilos
import { useCitas } from '@/hooks/Citas/useCitas';
import dynamic from 'next/dynamic';
import CalendarioDisponibilidad from '@/components/calendarioDisponibilidad';

const EditorMensajeSeguro = dynamic(() => import('@/components/EditorMensaje'), {
  ssr: false,
  loading: () => <div className={style.editorLoader}>Cargando editor premium...</div>
});

export default function CitasClient({ userLogueadoId }: { userLogueadoId?: string | null }) {
  const {
    nombre, setNombre,
    apellido, setApellido,
    telefono, setTelefono,
    email, setEmail,
    mensaje, setMensaje,
    tipo, setTipo,
    hora, setHora,
    dia, setDia,
    enviando,
    idCliente,
    handleSubmit,
    citasActivas
  } = useCitas();
  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>

        <div className={style.formLayoutGrid}>

          {/* COLUMNA INFORMATIVA / EDITORIAL */}
          <div className={style.infoColumn}>
            <span className={style.subtitle}>Atención Personalizada</span>
            <h1 className={style.title}>Agendamiento de Citas</h1>
            <p className={style.description}>
              Deseas probar nuestros productos antes de comprarlos? Es una excelente idea, estamos ubicados en quito. En el caso que no puedas visitarnos, podemos ir hasta donde tí. Déjanos tu información y te contactaremos.
              <br/>
              <br/>
              Las citas a hogar tiene un valor de $5 a cualquier parte de quito y solo se pueden realizar fines de semana.
              <br/>
              Todas las citas tienen una duración de hasta <b>2 horas</b>.
            </p>
            <div className={style.contactDetails}>
              <p>
                <a href="https://maps.app.goo.gl/bpAAvwTbbFjJmZvt7" target="_blank" rel="noopener noreferrer">
                  👉📍 Quito, Ecuador
                </a>
              </p>
              <p>
                <a href="https://wa.me/593999092702" target="_blank" rel="noopener noreferrer">
                  👉📱 0999092702
                </a>
              </p>
              <p>✉️ info@amaliaecq.com</p>
            </div>

          <CalendarioDisponibilidad disponibilidadApi={citasActivas} />


          </div>

          {/* COLUMNA DEL FORMULARIO */}
          <div className={style.formColumn}>
            <form onSubmit={handleSubmit} className={style.solicitudForm}>
              {!idCliente && (
                <>
                <div className={style.inputGroup}>
                  <label htmlFor="nombre">Nombres *</label>
                  <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Kevin"
                    className={style.formInput}
                    required
                  />
                </div>

                <div className={style.inputGroup}>
                  <label htmlFor="apellido">Apellidos *</label>
                  <input
                    type="text"
                    id="apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Ej: Lizano"
                    className={style.formInput}
                    required
                  />
                </div>

                <div className={style.inputGroup}>
                  <label htmlFor="email">Correo Electrónico *</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@correo.com"
                    className={style.formInput}
                    required
                  />
                </div>

                <div className={style.inputGroup}>
                  <label htmlFor="telefono">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej: 099XXXXXXX"
                    className={style.formInput}
                  />
                </div>
                </>
              )}

              {/* 📅 NUEVA SECCIÓN: Detalles de la Cita */}
              <div className={style.inputGroup}>
                <label htmlFor="tipo">Tipo de Cita *</label>
                <select
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className={style.formInput}
                  required
                >
                  <option value="" disabled>Selecciona el tipo de atención</option>
                  <option value="Presencial">Cita Presencial</option>
                  <option value="Hogar">Visita a Hogar</option>
                </select>
              </div>

              {/* Contenedor en paralelo para el Día y la Hora */}
              <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <div className={style.inputGroup} style={{ flex: 1 }}>
                  <label htmlFor="dia">Día Sugerido *</label>
                  <input
                    type="date"
                    id="dia"
                    value={dia}
                    onChange={(e) => setDia(e.target.value)}
                    className={style.formInput}
                    required
                  />
                </div>

                <div className={style.inputGroup} style={{ flex: 1 }}>
                  <label htmlFor="hora">Hora Sugerida *</label>
                  <input
                    type="time"
                    id="hora"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className={style.formInput}
                    required
                  />
                </div>
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="mensaje">Detalle de tu Solicitud *</label>
                <div className={style.quillWrapper}>
                  <EditorMensajeSeguro
                    value={mensaje}
                    onChange={setMensaje}
                    placeholder="Describe la fragancia, marca o detalles adicionales para tu cita..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={enviando}
                className={style.btnSubmit}
              >
                {enviando ? 'PROCESANDO...' : 'ENVIAR SOLICITUD'}
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}