// backend/routes/workouts.js
import express from "express";
import {
  createWorkout,
  getMyWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getWeeklySummary,
  getMonthlySummary,
} from "../controllers/workoutController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createWorkout);
router.get("/", getMyWorkouts);
router.get("/weekly-summary", getWeeklySummary);
router.get("/monthly-summary", getMonthlySummary);
router.get("/:id", getWorkoutById);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;
