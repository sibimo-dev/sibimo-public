import axios from "axios";

// Use the local Laravel API by default; deployments can override this value.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  timeout: 8000,
  headers: {
    Accept: "application/json",
  },
});

export default api;
