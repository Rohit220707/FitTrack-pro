// frontend/services/tracker.js
import authApi from "../utils/authApi";

export async function logSteps({ date, steps }) {
  const res = await authApi.post("/tracker/steps", { date, steps });
  return res.data;
}

export async function getStepsLast30() {
  const res = await authApi.get("/tracker/steps/last-30");
  return res.data;
}

export async function logWater({ date, amountMl }) {
  const res = await authApi.post("/tracker/water", { date, amountMl });
  return res.data;
}

export async function getWaterLast7() {
  const res = await authApi.get("/tracker/water/last-7");
  return res.data;
}

export async function logWeight({ date, weightKg }) {
  const res = await authApi.post("/tracker/weight", { date, weightKg });
  return res.data;
}

export async function getWeightLast30() {
  const res = await authApi.get("/tracker/weight/last-30");
  return res.data;
}

export async function logNutrition(entry) {
  const res = await authApi.post("/tracker/nutrition", entry);
  return res.data;
}

export async function getTodayNutritionSummary() {
  const res = await authApi.get("/tracker/nutrition/today");
  return res.data;
}

export async function getAchievements() {
  const res = await authApi.get("/tracker/achievements");
  return res.data;
}
