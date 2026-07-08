import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from './utils/cookies.utils';
import { analiticaCliente } from './app/actions/geolocalizacion.server';
import { renovarSesionServidor } from './services/login.service';

export async function proxy(request: NextRequest) {
  const token = await getSessionCookie('amalia_token');
  const { pathname } = request.nextUrl;
  await analiticaCliente('VISITA');
  const rutasProtegidas = ['/espacio/informacion', '/sorteo/juegaygana'];

  const rutasAuth = ['/login'];

  if (rutasProtegidas.some(ruta => pathname.startsWith(ruta)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (rutasAuth.some(ruta => pathname.startsWith(ruta)) && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images).*)'],
};


