import { authentication, createDirectus, rest, staticToken, withToken } from '@directus/sdk';

const API_URL = process.env.DIRECTUS_URL || "";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN || "";


export const directusPublic = createDirectus(API_URL).with(rest());

// Instancia Privada: Usa un token estático (solo si el frontend tiene servidor o es para tareas internas)
export const directusPrivate = createDirectus(API_URL)
  .with(staticToken(TOKEN))
  .with(rest());

export const directusAuth = createDirectus(API_URL)
  .with(rest())
  .with(authentication());

export const directusAuthUser =  createDirectus(API_URL)
  .with(rest());

