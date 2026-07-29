'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import style from '@styles/admin/login.module.css'; // Ajusta la ruta a tu CSS
import BotonRegresar from '@/components/returnButton';
import { loginUsuario, registrarUsuario, resetPasswordLogin } from '@/services/login.service';
import Loading from '../loading';
import { directusPublic } from '@/services/directus.config';
import { passwordRequest } from '@directus/sdk';

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

function validarCedulaEcuador(cedula:string) {
    // Debe tener exactamente 10 dígitos
    if (!/^\d{10}$/.test(cedula)) {
        return false;
    }

    const provincia = parseInt(cedula.substring(0, 2), 10);
    const tercerDigito = parseInt(cedula[2], 10);

    // Provincias válidas (01-24) o 30
    if ((provincia < 1 || provincia > 24) && provincia !== 30) {
        return false;
    }

    let suma = 0;

    for (let i = 0; i < 9; i++) {
        let valor = parseInt(cedula[i], 10);

        if (i % 2 === 0) {
            valor *= 2;
            if (valor > 9) {
                valor -= 9;
            }
        }

        suma += valor;
    }

    const digitoVerificador = (10 - (suma % 10)) % 10;

    return digitoVerificador === parseInt(cedula[9], 10);
}

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
      if(!validarCedulaEcuador(identificacion)){
        setErrorMsg('La cédula no es válida');
        setCargando(false);
      }
      const res = await registrarUsuario({ email, password, nombres, apellidos, telefono, identificacion });
      if (res.exito) {
        router.push('/');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Error al crear la cuenta.');
        setCargando(false);
      }
    }
  };


  const resetPassword = async () => {
    try {
      if(!email ||email === ""){
        window.showAlert('Debe colocar el correo para solicitar el reinicio de contraseña','WARNING');
      }
      resetPasswordLogin(email);
      window.showAlert('Si el correo está registrado, recibirás un mensaje con instrucciones.','INFO');
    } catch (error) {
      window.showAlert('Existió un inconveniente al enviar el correo','ERROR');
    }
  }
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
                    placeholder="Ej: XXXXXX XXXXXX"
                  />
                </div>
                <div className={style.inputGroup}>
                  <label>Apellidos *</label>
                  <input
                    type="text"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    placeholder="Ej: XXXXXX XXXXX"
                  />
                </div>
                <div className={style.inputGroup}>
                  <label>Teléfono / WhatsApp *</label>
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
                placeholder={!isLoginTab ? "Mínimo 8 Caracteres" : "*******"}
              />
            </div>
          {isLoginTab && (
            <div className={style.forgotPasswordContainer}>
              <button
                type="button"
                onClick={resetPassword} // Replace with your function's name
                className={style.forgotPassword}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}
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