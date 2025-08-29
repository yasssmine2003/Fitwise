import api from "../api";

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  if (response.data.success) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userId", response.data.user.id); // ou response.data.user._id si nécessaire
  }
  return response;
};

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  if (response.data.success) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userId", response.data.user.id || response.data.user._id); // Gérer id ou _id
  }
  return response;
};

export const logout = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
};