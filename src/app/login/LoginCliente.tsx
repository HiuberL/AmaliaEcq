'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import style from '@styles/admin/login.module.css'; // Ajusta la ruta a tu CSS
import BotonRegresar from '@/components/returnButton';
import { loginUsuario, registrarUsuario } from '@/services/login.service';
import Loading from '../loading';

export default function LoginClient() {
  const router = useRouter();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados de los campos
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [identificacion, setIdentificacion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setErrorMsg(null);

    if (isLoginTab) {
      // Flujo de Login
      const res = await loginUsuario(email, password);
      if (res.exito) {
        router.refresh();
        router.push('/'); // Redirige al catálogo protegido o perfil
      } else {
        setErrorMsg(res.error || 'Error desconocido.');
        setCargando(false);
      }
    } else {
      // Flujo de Registro
      const res = await registrarUsuario({ email, password, nombres, apellidos, telefono,identificacion });
      if (res.exito) {
        router.push('/');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Error al crear la cuenta.');
        setCargando(false);
      }
    }
  };
  if (cargando) {
    return <Loading />
  }
  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        <BotonRegresar fallbackRoute="/" label="Volver al inicio" />

        <div className={style.authBox}>
          {/* Selector de Pestañas minimalista */}
          <div className={style.tabHeader}>
            <button 
              className={`${style.tabButton} ${isLoginTab ? style.activeTab : ''}`}
              onClick={() => { setIsLoginTab(true); setErrorMsg(null); }}
            >
              Iniciar Sesión
            </button>
            <button 
              className={`${style.tabButton} ${!isLoginTab ? style.activeTab : ''}`}
              onClick={() => { setIsLoginTab(false); setErrorMsg(null); }}
            >
              Crear Cuenta
            </button>
          </div>

          <form onSubmit={handleSubmit} className={style.authForm}>
            {!isLoginTab && (
              <>
                <div className={style.inputGroup}>
                  <label>Identificación *</label>
                  <input 
                    type="text" 
                    required 
                    value={identificacion} 
                    onChange={(e) => setIdentificacion(e.target.value)} 
                    placeholder="Ej: 099999999"
                  />
                </div>
                <div className={style.inputGroup}>
                  <label>Nombres *</label>
                  <input 
                    type="text" 
                    required 
                    value={nombres} 
                    onChange={(e) => setNombres(e.target.value)} 
                    placeholder="Ej: Kevin"
                  />
                </div>
                <div className={style.inputGroup}>
                  <label>Apellidos</label>
                  <input 
                    type="text" 
                    value={apellidos} 
                    onChange={(e) => setApellidos(e.target.value)} 
                    placeholder="Ej: Lizano"
                  />
                </div>
                <div className={style.inputGroup}>
                  <label>Teléfono / WhatsApp</label>
                  <input 
                    type="tel" 
                    value={telefono} 
                    onChange={(e) => setTelefono(e.target.value)} 
                    placeholder="Ej: 0999092702"
                  />
                </div>
              </>
            )}

            <div className={style.inputGroup}>
              <label>Correo Electrónico *</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className={style.inputGroup}>
              <label>Contraseña *</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
              />
            </div>

            {errorMsg && (
              <div className={style.errorAlert}>
                {errorMsg}
              </div>
            )}

            <button type="submit" disabled={cargando} className={style.btnSubmit}>
              {cargando ? 'PROCESANDO...' : isLoginTab ? 'ENTRAR' : 'REGISTRARME'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}