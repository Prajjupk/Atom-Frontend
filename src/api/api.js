import axios from "axios";

const root = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
// Ensure all requests go to <ROOT>/api so frontend code can use "/tasks", "/users", etc.
const api = axios.create({
  baseURL: `${root}/api`,
});

// attach JWT if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
