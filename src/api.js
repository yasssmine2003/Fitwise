import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // backend local, change en prod si déployé
  withCredentials: true, // si tu utilises cookies pour auth
});

// Optionnel : Intercepteur pour ajouter token auth si tu utilises JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // si auth avec token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;