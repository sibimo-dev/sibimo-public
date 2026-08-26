import axios from "axios";

// TODO: confirm with the BE team whether the public endpoint prefix differs
// from the one used by sibimo-admin (e.g. /api/public/* vs /api/*).
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

export default api;
