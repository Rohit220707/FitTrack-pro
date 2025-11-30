// backend/controllers/trackerController.js
import StepsLog from "../models/StepsLog.js";
import WaterLog from "../models/WaterLog.js";
import WeightLog from "../models/WeightLog.js";
import NutritionLog from "../models/NutritionLog.js";
import Workout from "../models/Workout.js";

/**
 * POST /tracker/steps
 */
export const addSteps = async (req, res) => {
  try {
    const { date, steps } = req.body;
    if (!steps) return res.status(400).json({ message: "Steps required" });

    const day = date ? new Date(date) : new Date();
    const key = day.toISOString().slice(0, 10);

    const existing = await StepsLog.findOne({
      user: req.user.id,
      date: { $gte: new Date(key), $lt: new Date(key + "T23:59:59.999Z") },
    });

    let log;
    if (existing) {
      existing.steps = Number(steps);
      log = await existing.save();
    } else {
      log = await StepsLog.create({
        user: req.user.id,
        date: day,
        steps: Number(steps),
      });
    }

    res.json({ message: "Steps updated", log });
  } catch (err) {
    console.error("addSteps error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /tracker/steps/last-30
 */
export const getStepsLast30 = async (req, res) => {
  try {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 29);

    const logs = await StepsLog.find({
      user: req.user.id,
      date: { $gte: start, $lte: today },
    }).sort({ date: 1 });

    const map = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() - (29 - i));
      const key = d.toISOString().slice(0, 10);
      map[key] = 0;
    }

    logs.forEach((log) => {
      const key = log.date.toISOString().slice(0, 10);
      if (map[key] !== undefined) map[key] = log.steps;
    });

    const data = Object.entries(map).map(([date, steps]) => ({ date, steps }));
    res.json(data);
  } catch (err) {
    console.error("getStepsLast30 error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /tracker/water
 */
export const addWater = async (req, res) => {
  try {
    const { date, amountMl } = req.body;
    if (!amountMl) return res.status(400).json({ message: "Amount required" });

    const day = date ? new Date(date) : new Date();
    const key = day.toISOString().slice(0, 10);

    const existing = await WaterLog.findOne({
      user: req.user.id,
      date: { $gte: new Date(key), $lt: new Date(key + "T23:59:59.999Z") },
    });

    let log;
    if (existing) {
      existing.amountMl = Number(amountMl);
      log = await existing.save();
    } else {
      log = await WaterLog.create({
        user: req.user.id,
        date: day,
        amountMl: Number(amountMl),
      });
    }

    res.json({ message: "Water updated", log });
  } catch (err) {
    console.error("addWater error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /tracker/water/last-7
 */
export const getWaterLast7 = async (req, res) => {
  try {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 6);

    const logs = await WaterLog.find({
      user: req.user.id,
      date: { $gte: start, $lte: today },
    }).sort({ date: 1 });

    const map = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      map[key] = 0;
    }

    logs.forEach((log) => {
      const key = log.date.toISOString().slice(0, 10);
      if (map[key] !== undefined) map[key] = log.amountMl;
    });

    const data = Object.entries(map).map(([date, amountMl]) => ({
      date,
      amountMl,
    }));
    res.json(data);
  } catch (err) {
    console.error("getWaterLast7 error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /tracker/weight
 */
export const addWeight = async (req, res) => {
  try {
    const { date, weightKg } = req.body;
    if (!weightKg) return res.status(400).json({ message: "Weight required" });

    const day = date ? new Date(date) : new Date();
    const key = day.toISOString().slice(0, 10);

    const existing = await WeightLog.findOne({
      user: req.user.id,
      date: { $gte: new Date(key), $lt: new Date(key + "T23:59:59.999Z") },
    });

    let log;
    if (existing) {
      existing.weightKg = Number(weightKg);
      log = await existing.save();
    } else {
      log = await WeightLog.create({
        user: req.user.id,
        date: day,
        weightKg: Number(weightKg),
      });
    }

    res.json({ message: "Weight updated", log });
  } catch (err) {
    console.error("addWeight error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /tracker/weight/last-30
 */
export const getWeightLast30 = async (req, res) => {
  try {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 29);

    const logs = await WeightLog.find({
      user: req.user.id,
      date: { $gte: start, $lte: today },
    }).sort({ date: 1 });

    const data = logs.map((log) => ({
      date: log.date.toISOString().slice(0, 10),
      weightKg: log.weightKg,
    }));

    res.json(data);
  } catch (err) {
    console.error("getWeightLast30 error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /tracker/nutrition
 */
export const addNutritionEntry = async (req, res) => {
  try {
    const { date, mealType, calories, protein, carbs, fat } = req.body;
    if (!calories) return res.status(400).json({ message: "Calories required" });

    const entry = await NutritionLog.create({
      user: req.user.id,
      date: date ? new Date(date) : new Date(),
      mealType: mealType || "meal",
      calories: Number(calories),
      protein: Number(protein || 0),
      carbs: Number(carbs || 0),
      fat: Number(fat || 0),
    });

    res.status(201).json({ message: "Nutrition entry added", entry });
  } catch (err) {
    console.error("addNutritionEntry error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /tracker/nutrition/today
 */
export const getTodayNutritionSummary = async (req, res) => {
  try {
    const today = new Date();
    const key = today.toISOString().slice(0, 10);

    const entries = await NutritionLog.find({
      user: req.user.id,
      date: {
        $gte: new Date(key),
        $lt: new Date(key + "T23:59:59.999Z"),
      },
    });

    const totals = entries.reduce(
      (acc, e) => {
        acc.calories += e.calories || 0;
        acc.protein += e.protein || 0;
        acc.carbs += e.carbs || 0;
        acc.fat += e.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    res.json(totals);
  } catch (err) {
    console.error("getTodayNutritionSummary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /tracker/achievements
 */
export const getAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const weekStart = new Date();
    weekStart.setDate(today.getDate() - 6);

    const workouts = await Workout.find({
      user: userId,
      date: { $gte: weekStart, $lte: today },
    });

    const totalWeeklyCalories = workouts.reduce(
      (sum, w) => sum + (w.totalCalories || 0),
      0
    );

    const stepsLogs = await StepsLog.find({
      user: userId,
      date: { $gte: weekStart, $lte: today },
    });

    const daysWithSteps10k = new Set(
      stepsLogs
        .filter((s) => s.steps >= 10000)
        .map((s) => s.date.toISOString().slice(0, 10))
    ).size;

    const waterLogs = await WaterLog.find({
      user: userId,
      date: { $gte: weekStart, $lte: today },
    });

    const daysWith2L = new Set(
      waterLogs
        .filter((w) => w.amountMl >= 2000)
        .map((w) => w.date.toISOString().slice(0, 10))
    ).size;

    const badges = [];

    if (workouts.length >= 3) {
      badges.push({
        id: "active-week",
        label: "Active Week",
        description: "Completed 3+ workouts in the last 7 days",
      });
    }

    if (totalWeeklyCalories >= 3500) {
      badges.push({
        id: "calorie-burner",
        label: "Calorie Burner",
        description: "Burned 3500+ kcal in the last 7 days",
      });
    }

    if (daysWithSteps10k >= 3) {
      badges.push({
        id: "step-hero",
        label: "Step Hero",
        description: "Hit 10,000+ steps on 3+ days this week",
      });
    }

    if (daysWith2L >= 3) {
      badges.push({
        id: "hydration-pro",
        label: "Hydration Pro",
        description: "Drank 2L+ water on 3+ days this week",
      });
    }

    res.json(badges);
  } catch (err) {
    console.error("getAchievements error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
