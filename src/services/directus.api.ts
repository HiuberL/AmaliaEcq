import axios from "axios";

const API_DIRECTUS_URL = process.env.API_DIRECTUS_URL || "";
const TOKEN = process.env.DIRECTUS_STATIC_TOKEN || "";

const directusClient = axios.create({
  baseURL: API_DIRECTUS_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

directusClient.interceptors.request.use((config) => {
  const token = TOKEN;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default directusClient;