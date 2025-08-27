import api from "../api";

export const getActivities = async (userId) => {
  return api.get(`/activities/${userId}`);
};

export const addActivity = async (activity) => {
  return api.post("/activities", activity);
};

export const updateActivity = async (id, activity) => {
  return api.put(`/activities/${id}`, activity);
};

export const deleteActivity = async (id) => {
  return api.delete(`/activities/${id}`);
};