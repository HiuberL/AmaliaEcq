import axios from "axios";

const API_PAYPHONE = process.env.API_PAYPHONE;
const TOKEN = process.env.API_PAYPHONE_TOKEN || "";

export const payphoneClient = axios.create({
  baseURL: API_PAYPHONE,
  headers: {
    "Content-Type": "application/json",
    "Authorization":  `Bearer ${TOKEN}`
  }
});

