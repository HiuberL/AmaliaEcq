'use client';

import { useState, useEffect } from 'react';
import styles from '@styles/admin/espacio-cliente.module.css';
import { useEspacio } from '@/hooks/Espacio/useEspacio';
import Loading from '@/app/loading';

export default function ProfilePage() {
  const { cliente, formatearFecha, formatearPuntos,
    activeSidebar, setActiveSidebar,
    activeTab, setActiveTab,
    locations, handleSetPreferred, setCelular, celular,
    onChangeCellPhone, setIsModalOpen, isModalOpen,
    formData, onChangeData, provincia, ciudad, sector, onCreateDireccionCliente,
    onUpdatePreferentDireccionCliente } = useEspacio();

  if (!cliente) {
    return <Loading />
  }

  const saldoDisponible = cliente.billetera_id?.saldo_disponible ?? 0;
  const saldoBloqueado = cliente.billetera_id?.saldo_bloqueado ?? 0;
  const listaCitas = cliente.citas ?? [];
  const listaSolicitudes = cliente.solicitudes ?? [];

  return (
    <div className={styles.container}>
      {/* BARRA LATERAL */}
      <aside className={styles.sidebar}>
        <div className={styles.brandTitle}>Mi Cuenta</div>
        <nav className={styles.menu}>
          <button
            className={`${styles.menuBtn} ${activeSidebar === 'general' ? styles.activeMenu : ''}`}
            onClick={() => setActiveSidebar('general')}
          >
            General
          </button>
          <button
            className={`${styles.menuBtn} ${activeSidebar === 'configuraciones' ? styles.activeMenu : ''}`}
            onClick={() => setActiveSidebar('configuraciones')}
          >
            Configuraciones
          </button>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className={styles.mainContent}>

        {/* CABECERA DE BIENVENIDA */}
        <header className={styles.header}>
          <h1 className={styles.welcomeText}>{`Hola, ${cliente.nombres || ''} 👋`}</h1>
          <p className={styles.subtitle}>Gestiona tus puntos, citas y preferencias desde un solo lugar.</p>
        </header>

        {/* TARJETAS DE PUNTOS DE LA BILLETERA */}
        <section className={styles.pointsGrid}>
          <div className={`${styles.pointCard} ${styles.pointsAvailable}`}>
            <span className={styles.cardLabel}>Puntos Disponibles</span>
            <span className={styles.cardValue}>{saldoDisponible} Pts.</span>
          </div>
          <div className={`${styles.pointCard} ${styles.pointsBlocked}`}>
            <span className={styles.cardLabel}>Puntos Bloqueados</span>
            <span className={styles.cardValue}>{saldoBloqueado} Pts.</span>
          </div>
        </section>

        {/* SECCIÓN GENERAL (TABS CON DATA REAL) */}
        {activeSidebar === 'general' && (
          <section className={styles.tabSection}>
            <div className={styles.tabHeaders}>
              {['solicitudes', 'citas', 'historial de compras', 'historial de puntos'].map((tab) => (
                <button
                  key={tab}
                  className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className={styles.tabContent}>
              {/* Contenido dinámico según el Tab activo */}
              {activeTab === 'solicitudes' && (
                <div className={styles.listContainer}>
                  {listaSolicitudes.length === 0 ? (
                    <p className={styles.noData}>No tienes solicitudes registradas.</p>
                  ) : (
                    listaSolicitudes
                      .sort((a:any, b:any) => {
                        const fechaA = a.date_created ? new Date(a.date_created).getTime() : 0;
                        const fechaB = b.date_created ? new Date(b.date_created).getTime() : 0;
                        return fechaB - fechaA; // De más reciente a más antigua
                      })
                      .map((sol: any, idx: number) => {
                        const fechaFormateada = new Date(sol.date_created).toLocaleDateString('es-EC', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        return (
                          <div key={idx} className={styles.purchaseCard}>
                            <div className={styles.cardHeader}>
                              <p className={styles.orderLabel}>
                                <strong>Solicitud:</strong>{' '}
                              </p>
                              <span className={`${styles.statusBadge} ${styles[sol.atendido ? 'realizado' : 'pendiente']}`}>
                                {sol.atendido ? 'Atendido' : 'Pendiente'}
                              </span>
                            </div>
                            <div className={styles.cardBodySol}>
                              <span dangerouslySetInnerHTML={{ __html: sol.solicitud || '' }} />
                            </div>
                            <div className={styles.detailItem}>
                              <span>Fecha</span>
                              <small>{fechaFormateada}</small>
                            </div>

                          </div>
                        )
                      })
                  )}
                </div>
              )}

              {activeTab === 'citas' && (
                <div className={styles.listContainer}>
                  {listaCitas.length === 0 ? (
                    <p className={styles.noData}>No tienes citas programadas.</p>
                  ) : (
                    listaCitas.map((cita: any, idx: number) => (
                      <div key={idx} className={styles.purchaseCard}>
                        <div className={styles.cardHeader2}>
                          <div className={styles.orderInfo}>
                            <p className={styles.orderLabel}>{cita.tipo}</p>
                          </div>
                          <span className={`${styles.statusBadge} ${styles[cita.estado.replace(" ", "").toLowerCase()]}`}>
                            {cita.estado}
                          </span>
                        </div>
                        <div className={styles.cardBody}>
                          <span className={styles.dateCita}>
                            {cita.dia} a las {cita.hora}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'historial de puntos' && (
                <div className={styles.historyContainer}>
                  {!cliente.billetera_id?.historial_puntos || cliente.billetera_id.historial_puntos.length === 0 ? (
                    <p className={styles.noData}>Aún no registras movimientos de puntos.</p>
                  ) : (
                    <div className={styles.listContainer}>
                      {/* 1. Clonamos el array y lo ordenamos por fecha de forma descendente */}
                      {[...cliente.billetera_id.historial_puntos]
                        .sort((a, b) => {
                          const fechaA = a.date_created ? new Date(a.date_created).getTime() : 0;
                          const fechaB = b.date_created ? new Date(b.date_created).getTime() : 0;
                          return fechaB - fechaA; // De más reciente a más antigua
                        })
                        .map((mov) => {
                          return (
                            <div key={mov.id} className={styles.purchaseCard}>
                              <div className={styles.historyMeta}>
                                <p className={styles.historyConcept}>{mov.detalle || 'Movimiento de puntos'}</p>
                                <span className={styles.historyTypeLabel}>
                                  {`Tipo: ${mov.tipo} — ${formatearFecha(mov.date_created)}`}
                                </span>
                              </div>
                              <span className={Number(formatearPuntos(mov)) > 0 ? styles.pointsEarned : styles.pointsSpent}>
                                {formatearPuntos(mov)} Pts.
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'historial de compras' && (
                <div className={styles.historyContainer}>
                  {cliente.pedidos && cliente.pedidos.length > 0 ? (
                    <div className={styles.historyList}>
                      {cliente.pedidos
                        .sort((a: any, b: any) => (new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()))
                        .map((item: any) => {
                          // Evaluamos el monto real (si el total es 0, usamos valor_pagado)
                          const montoFinal = parseFloat(item.total) > 0 ? item.total : item.valor_pagado;
                          const fechaFormateada = new Date(item.updated_at).toLocaleDateString('es-EC', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          });

                          return (
                            <div key={item.secuencial} className={styles.purchaseCard}>
                              <div className={styles.cardHeader}>
                                <div className={styles.orderInfo}>
                                  <span className={styles.orderLabel}>Nº Secuencial</span>
                                  <strong className={styles.orderNumber}>#{item.secuencial}</strong>
                                </div>
                                <span className={`${styles.statusBadge} ${styles[item.estado.toLowerCase()]}`}>
                                  {item.estado}
                                </span>
                              </div>

                              <div className={styles.cardBody}>
                                <div className={styles.detailItem}>
                                  <span>Método de pago</span>
                                  <strong>{item.forma_pago}</strong>
                                </div>
                                {item.puntos_usados > 0 && (
                                  <div className={styles.detailItem}>
                                    <span>Puntos usados</span>
                                    <strong>{item.puntos_usados} pts</strong>
                                  </div>
                                )}
                                <div className={styles.detailItem}>
                                  <span>Fecha</span>
                                  <small>{fechaFormateada}</small>
                                </div>
                              </div>
                                {item.nota_cliente && (
                                  <div className={styles.clientNotes}>
                                    <span className={styles.notesLabel}>Nota:</span>
                                    <div 
                                      className={styles.notesHtmlContent}
                                      dangerouslySetInnerHTML={{ __html: item.nota_cliente }} 
                                    />
                                  </div>
                                )}

                              <div className={styles.cardFooter}>
                                <span>Total</span>
                                <strong className={styles.totalAmount}>${parseFloat(montoFinal).toFixed(2)}</strong>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className={styles.placeholderContent}>
                      Aquí se desplegará el listado correspondiente a tu {activeTab}.
                    </div>
                  )}
                </div>
              )}

            </div>
          </section>
        )}

        {/* SECCIÓN CONFIGURACIONES */}
        {activeSidebar === 'configuraciones' && (
          <section className={styles.configSection}>
            <div className={styles.sectionHeader}>
              <h2>Datos Personales</h2>
              <p>Mantén tu información actualizada para tus entregas y reservas.</p>
            </div>

            {/* FORMULARIO DE DATOS DESHABILITADOS */}
            <form className={styles.formGrid} onSubmit={(e) => e.preventDefault()}>
              <div className={`${styles.formGroup} ${styles.disabledCamp}`}>
                <label>Nombre</label>
                <input type="text" defaultValue={cliente.nombres || ''} disabled />
              </div>
              <div className={`${styles.formGroup} ${styles.disabledCamp}`}>
                <label>Apellido</label>
                <input type="text" defaultValue={cliente.apellidos || ''} disabled />
              </div>
              <div className={`${styles.formGroup} ${styles.disabledCamp}`}>
                <label>Identificación (Cédula/RUC)</label>
                <input type="text" defaultValue={cliente.identificacion || ''} disabled />
              </div>
              <div className={`${styles.formGroup} ${styles.disabledCamp}`}>
                <label>Correo Electrónico</label>
                <input type="email" defaultValue={cliente.correo || ''} disabled />
              </div>
              <div className={styles.formGroup}>
                <label>Celular</label>
                <input type="tel" value={celular}
                  onChange={e => setCelular(e.target.value)} />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn} onClick={onChangeCellPhone}>Guardar Cambios</button>
              </div>
            </form>

            <hr className={styles.divider} />

            {/* SECCIÓN UBICACIONES PREFERIDAS DESDE DIRECTUS */}
            <div className={styles.locationsSection}>
              <div className={styles.locationsHeader}>
                <h3>Ubicaciones Registradas</h3>
                <button className={styles.createBtn} onClick={() => setIsModalOpen(true)}>
                  <span>+</span> Crear nueva
                </button>
              </div>

              {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                  {/* stopPropagation evita que el modal se cierre al hacer click dentro del formulario */}
                  <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>

                    <div className={styles.modalHeader}>
                      <h2>Crear Nueva Ubicación</h2>
                      <button className={styles.closeModalBtn} onClick={() => setIsModalOpen(false)}>
                        &times;
                      </button>
                    </div>

                    <div className={styles.modalBody}>
                      {/* Aquí están exactamente tus mismos campos */}
                      <div className={`${styles.conditionalAddressFields}`}>

                        <div className={styles.formGroup}>
                          <label>Provincia</label>
                          <select name="provincia" value={formData.provincia} onChange={onChangeData}>
                            {provincia.map((p: any) => (
                              <option key={p.codigo} value={`${p.codigo}-${p.valor}`}>
                                {p.valor}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className={styles.formGroup}>
                          <label>Ciudad</label>
                          <select name="ciudad" value={formData.ciudad} onChange={onChangeData}>
                            {ciudad.map((p: any) => (
                              <option key={p.codigo} value={`${p.codigo}-${p.valor}`}>
                                {p.valor}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className={`${styles.formGroup} ${styles.fullWidthColumn}`}>
                          <label>Sector</label>
                          <select name="sector" value={formData.sector} onChange={onChangeData}>
                            {sector.map((p: any) => (
                              <option key={p.codigo} value={`${p.codigo}-${p.valor}`}>
                                {p.valor}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className={`${styles.formGroup} ${styles.fullWidthColumn}`}>
                          <label>Dirección Exacta</label>
                          <input type="text" name="direccion" value={formData.direccion} onChange={onChangeData} placeholder="Calle Principal, numeración y secundaria" />
                        </div>

                        <div className={`${styles.formGroup} ${styles.fullWidthColumn}`}>
                          <label>Referencia</label>
                          <input type="text" name="referencia" value={formData.referencia} onChange={onChangeData} placeholder="Ej. Junto a la farmacia" />
                        </div>

                        <div className={`${styles.formGroup} ${styles.fullWidthColumn}`}>
                          <label>URL del Mapa (Google Maps)</label>
                          <input type="url" name="urlMapa" value={formData.urlMapa} onChange={onChangeData} placeholder="https://goo.gl/maps/..." />
                        </div>
                      </div>
                    </div>

                    <div className={styles.modalFooter}>
                      <button className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                        Cancelar
                      </button>
                      <button className={styles.saveBtn} onClick={() => onCreateDireccionCliente()}>
                        Guardar Dirección
                      </button>
                    </div>

                  </div>
                </div>
              )}

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Ciudad</th>
                      <th>Sector</th>
                      <th>Dirección 1</th>
                      <th style={{ textAlign: 'center' }}>Preferida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locations.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: '#7a7a7a', padding: '2rem' }}>
                          No tienes ubicaciones registradas.
                        </td>
                      </tr>
                    ) : (
                      locations.map((loc: any) => (
                        <tr key={loc.id} className={loc.isPreferred ? styles.rowPreferred : ''}>
                          <td>{loc.ciudad}</td>
                          <td>{loc.sector}</td>
                          <td>{loc.direccion}</td>
                          <td style={{ textAlign: 'center' }}>
                            <input
                              type="radio"
                              name="preferredLocation"
                              checked={loc.isPreferred}
                              onChange={() => handleSetPreferred(loc.id)}
                              className={styles.radioInput}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}