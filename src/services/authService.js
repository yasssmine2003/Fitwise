import api from "../api";

export const register = async (userData) => {
  return api.post("/auth/register", userData); // ajuste si route est /users/register
};

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  localStorage.setItem("userId", response.data.userId); // sauvegarde userId
  localStorage.setItem("token", response.data.token); // si JWT
  return response;
};