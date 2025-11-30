// backend/routes/tracker.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addSteps,
  getStepsLast30,
  addWater,
  getWaterLast7,
  addWeight,
  getWeightLast30,
  addNutritionEntry,
  getTodayNutritionSummary,
  getAchievements,
} from "../controllers/trackerController.js";

const router = express.Router();

router.use(authMiddleware);

// Steps
router.post("/steps", addSteps);
router.get("/steps/last-30", getStepsLast30);

// Water
router.post("/water", addWater);
router.get("/water/last-7", getWaterLast7);

// Weight
router.post("/weight", addWeight);
router.get("/weight/last-30", getWeightLast30);

// Nutrition
router.post("/nutrition", addNutritionEntry);
router.get("/nutrition/today", getTodayNutritionSummary);

// Achievements
router.get("/achievements", getAchievements);

export default router;
