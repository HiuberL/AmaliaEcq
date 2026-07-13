'use client';

import React, { useState } from 'react';
import style from '@styles/admin/solicitudes.module.css'; // Ajusta la ruta a tus estilos
import { createDirectus, rest, createItem } from '@directus/sdk';
import ReactQuill from 'react-quill-new';
import EditorMensaje from '@/components/EditorMensaje';
import { useSolicitudes } from '@/hooks/Solicitudes/useSolicitudes';
import dynamic from 'next/dynamic';

const EditorMensajeSeguro = dynamic(() => import('@/components/EditorMensaje'), { 
  ssr: false,
  loading: () => <div className={style.editorLoader}>Cargando editor premium...</div>
});
export default function SolicitudesClient() {
  const{
        nombre, setNombre,
        apellido, setApellido,
        telefono, setTelefono,
        email, setEmail,
        mensaje, setMensaje,
        enviando,
        idCliente,
        handleSubmit 
  }=useSolicitudes();
  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>


        <div className={style.formLayoutGrid}>

          {/* COLUMNA INFORMATIVA / EDITORIAL */}
          <div className={style.infoColumn}>
            <span className={style.subtitle}>Atención Personalizada</span>
            <h1 className={style.title}>Solicitudes & Pedidos Especiales</h1>
            <p className={style.description}>
              ¿Buscas un extracto de perfume específico, una presentación OpenBox particular o deseas dejarnos un mensaje? Déjanos tus datos y requerimientos. Nuestro equipo procesará tu solicitud de manera prioritaria.
            </p>
            <div className={style.contactDetails}>
              <p>
                <a href="https://maps.app.goo.gl/bpAAvwTbbFjJmZvt7" target="_blank" rel="noopener noreferrer">
                  👉📍 Quito, Ecuador
                </a>
              </p>
              <p><a href="https://wa.me/593999092702">
                👉📱 0999092702
              </a></p>
              <p>✉️ info@amaliaecq.com</p>
            </div>
          </div>

          {/* COLUMNA DEL FORMULARIO */}
          <div className={style.formColumn}>
            <form onSubmit={handleSubmit} className={style.solicitudForm}>
            {!idCliente &&
            <>
              <div className={style.inputGroup}>
                <label htmlFor="nombre">Nombres *</label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: XXXX XXXX"
                  className={style.formInput}
                />
              </div>
              <div className={style.inputGroup}>
                <label htmlFor="nombre">Apellidos *</label>
                <input
                  type="text"
                  id="apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Ej: XXXX XXXX"
                  className={style.formInput}
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
            }

              <div className={style.inputGroup}>
                <label htmlFor="mensaje">Detalle de tu Solicitud *</label>
                <div className={style.quillWrapper}>
                  {/* ⚡ Usamos el editor aislado de forma segura */}
                  <EditorMensajeSeguro
                    value={mensaje}
                    onChange={setMensaje}
                    placeholder="Describe la fragancia, marca o sube fotos de referencia..."
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