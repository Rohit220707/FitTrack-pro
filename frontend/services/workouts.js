// frontend/services/workouts.js
import authApi from "../utils/authApi";

export async function fetchWorkouts(limit = 20) {
  const res = await authApi.get(`/workouts?limit=${limit}`);
  return res.data;
}

export async function createWorkout(payload) {
  const res = await authApi.post("/workouts", payload);
  return res.data;
}

export async function updateWorkout(id, payload) {
  const res = await authApi.put(`/workouts/${id}`, payload);
  return res.data;
}

export async function deleteWorkout(id) {
  const res = await authApi.delete(`/workouts/${id}`);
  return res.data;
}

export async function fetchWeeklySummary() {
  const res = await authApi.get("/workouts/weekly-summary");
  return res.data;
}

export async function fetchMonthlyCalories() {
  const res = await authApi.get("/workouts/monthly-summary");
  return res.data;
}
