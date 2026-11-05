import axios from "axios";

// Use the local Laravel API by default; deployments can override this value.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000, // 15 detik — cukup untuk request API biasa di server lokal yang lebih lambat
  headers: {
    Accept: "application/json",
  },
});

export default api;
