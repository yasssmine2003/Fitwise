// src/services/nutritionService.js
import api from "../api";

export const getNutrition = async (userId) => {
  return api.get(`/nutrition/user/${userId}`);
};

export const addNutrition = async (nutrition) => {
  const adaptedNutrition = {
    userId: nutrition.userId,
    date: nutrition.date,
    meals: nutrition.meals.map((meal) => ({
      type: meal.type,
      note: meal.note || "",
      items: meal.items.map((item) => ({
        foodName: item.foodName,
        calories: item.calories,
        proteinG: item.proteinG,
        carbsG: item.carbsG,
        fatG: item.fatG,
        quantity: item.quantity,
        unit: item.unit,
      })),
    })),
  };
  return api.post("/nutrition", adaptedNutrition);
};