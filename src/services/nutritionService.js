import api from "../api";

export const getNutrition = async (userId) => {
  return api.get(`/nutrition/${userId}`);
};

export const addNutrition = async (nutrition) => {
  return api.post("/nutrition", nutrition);
};

// Ajoute update/delete si besoin