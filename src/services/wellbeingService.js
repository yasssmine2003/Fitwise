import api from "../api";

export const getWellbeing = async (userId) => {
  return api.get(`/wellbeing/${userId}`);
};

export const addWellbeing = async (wellbeing) => {
  return api.post("/wellbeing", wellbeing);
};

// Ajoute update/delete si besoin