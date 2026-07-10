'use server'
import { guardarAnaliticas } from '@/services/analitics.service';
import { getSessionCookie, setSessionCookie } from '@/utils/cookies.utils';
import { headers } from 'next/headers';

const BOT_REGEX = /bot|spider|crawl|scraper|lighthouse|gtmetrix|pingdom|facebookexternalhit|whatsapp|twitterbot|linkedinbot|curl|wget|python|node/i;

export async function initializeGuestSession() {
    const headersList = await headers();
    const pais = headersList.get('x-vercel-ip-country') || 'Ecuador';
    const ciudad = headersList.get('x-vercel-ip-city') || 'Quito';
    const userAgent = headersList.get('user-agent') || 'desconocido';
    const vercelRequestId = headersList.get('x-vercel-id') || 'local';
    const guestSessionId = globalThis.crypto.randomUUID();

    return {
        vercelRequestId,
        guestSessionId,
        location: { pais, ciudad },
        userAgent
    };
}

export async function analiticaCliente(tipo: string, criterio: string = '') {
    // 1. Obtener cookies de forma paralela (mejora rendimiento)
    const [localCartId, idCliente] = await Promise.all([
        getSessionCookie('guest_cart_id'),
        getSessionCookie('amalia_cliente_id')
    ]);

    if (criterio.includes('payment') || criterio.includes('login') || criterio.includes('espacio') || criterio.includes('agradecimiento')) return;
    // 2. Ejecutamos la sesión una sola vez arriba para tenerla disponible siempre
    const session = await initializeGuestSession();
    
    // Filtro inmediato de Bots
    const esBot = BOT_REGEX.test(session.userAgent);
    if (esBot) return null;

    // 🚪 CASO 1: Visitante completamente nuevo
    if (!localCartId) {
        // Ponemos la cookie (esto sí requiere await porque afecta al navegador del cliente)
        await setSessionCookie('guest_cart_id', session.guestSessionId);
        
        // 🚀 FUEGO Y OLVIDO: Quitamos el 'await'. Next.js responde de inmediato al cliente 
        // y Directus se guarda en segundo plano.
        guardarAnaliticas(session.vercelRequestId, 'VISITA', session.location, criterio);
        return null;
    }

    // 🔑 CASO 2: Ya tiene sesión, es una VISITA estándar y acaba de loguearse
    if (tipo === 'VISITA' && idCliente) {
        // 🚀 Sin 'await', corre en el trasfondo de Node.js
        guardarAnaliticas(session.vercelRequestId, 'VISITA', session.location, criterio);
        return null;
    }

    // ⚡ CASO 3: Es un evento personalizado (ej: 'AGREGAR_CARRITO', 'VER_PRODUCTO')
    if (tipo !== 'VISITA') {
        // 🚀 Sin 'await'
        guardarAnaliticas(session.vercelRequestId, tipo, session.location, criterio);
    }

    return null;
}