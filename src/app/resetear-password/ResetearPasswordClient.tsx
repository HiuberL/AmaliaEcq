'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordStage } from '@/services/login.service';
import style from '@styles/admin/ResetearPassword.module.css'; // 👈 Importamos los estilos

export default function ResetearPasswordView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenUrl = searchParams.get('token');
    if (tokenUrl) {
      setToken(tokenUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPasswordStage(token, password);
      window.showAlert('¡Contraseña actualizada con éxito!','INFO');
      router.push('/login');
    } catch (error) {
      console.error(error);
      window.showAlert('El enlace ha expirado o no es válido. Por favor, solicita uno nuevo.','WARNING');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.card}>
        <div className={style.header}>
          <h1 className={style.title}>Restablecer contraseña</h1>
          <p className={style.subtitle}>
            Ingresa tu nueva contraseña a continuación para recuperar el acceso a tu cuenta.
          </p>
        </div>

        {!token ? (
          <div className={style.warning}>
            El enlace no es válido o carece de un token de verificación.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.inputGroup}>
              <label htmlFor="new-password" className={style.label}>
                Nueva contraseña
              </label>
              <input
                id="new-password"
                type="password"
                className={style.input}
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              className={style.submitBtn}
              disabled={loading || !token}
            >
              {loading ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}