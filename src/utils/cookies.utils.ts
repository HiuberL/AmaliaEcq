'use server'; // 🛡️ Se mantiene en el servidor de forma segura

import { cookies } from 'next/headers';

// 🚀 CORRECCIÓN: Exportamos funciones asíncronas individuales, no un objeto
export async function setSessionCookie(id: string, value: string) {
  const cookieStore = await cookies();
  cookieStore.set(id, value, {
    maxAge: 86400, // 1 día en segundos
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true, // Protegido contra lectura de JS en el navegador
    path: '/'
  });
}

export async function getSessionCookie(id: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(id)?.value;
}

export async function removeSessionCookie(id: string) {
  const cookieStore = await cookies();
  cookieStore.delete(id);
}

export async function existsToken(): Promise<boolean> {
  const token = await getSessionCookie('amalia_token');
  if (token){
    return true;
  }else{
    return false;
  }
}

export async function logoutSoloCookies() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('amalia_token');
    cookieStore.delete('amalia_refresh_token');
    cookieStore.delete('amalia_cliente_id');
    cookieStore.delete('directus_session_token');
    return { exito: true };
  } catch (error) {
    console.error('Error al destruir las cookies de sesión:', error);
    return { exito: false, error: 'No se pudo cerrar la sesión correctamente.' };
  }
}

