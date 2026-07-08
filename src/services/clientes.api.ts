import axios from "axios";

const API_PAYPHONE = process.env.API_PAYPHONE;
const TOKEN = process.env.API_PAYPHONE_TOKEN || "";

const API_DIRECTUS_URL = process.env.API_DIRECTUS_URL;
const DIRECTUS_STATIC_TOKEN = process.env.API_DIRECTUS_TOKEN_FLOW || "";


export const payphoneClient = axios.create({
  baseURL: API_PAYPHONE,
  headers: {
    "Content-Type": "application/json",
    "Authorization":  `Bearer ${TOKEN}`
  }
});

export const directusClientFlow = axios.create({
  baseURL: API_DIRECTUS_URL,
  headers: {
    "Content-Type": "application/json",
    "x-webhook-secret":  `${DIRECTUS_STATIC_TOKEN}`
  }
});

