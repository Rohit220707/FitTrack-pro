// backend/controllers/workoutController.js
import Workout from "../models/Workout.js";

function calculateTotalCalories(exercises = []) {
  return exercises.reduce((sum, ex) => sum + (Number(ex.calories) || 0), 0);
}

/**
 * POST /workouts
 */
export const createWorkout = async (req, res) => {
  try {
    const { date, exercises = [], notes } = req.body;

    const workout = await Workout.create({
      user: req.user.id,
      date: date ? new Date(date) : new Date(),
      exercises,
      notes,
      totalCalories: calculateTotalCalories(exercises),
    });

    res.status(201).json({ message: "Workout created", workout });
  } catch (err) {
    console.error("createWorkout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /workouts
 */
export const getMyWorkouts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const workouts = await Workout.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(limit);

    res.json(workouts);
  } catch (err) {
    console.error("getMyWorkouts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /workouts/:id
 */
export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!workout) return res.status(404).json({ message: "Workout not found" });

    res.json(workout);
  } catch (err) {
    console.error("getWorkoutById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /workouts/:id
 */
export const updateWorkout = async (req, res) => {
  try {
    const { date, exercises, notes } = req.body;

    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!workout) return res.status(404).json({ message: "Workout not found" });

    if (date) workout.date = new Date(date);
    if (Array.isArray(exercises)) {
      workout.exercises = exercises;
      workout.totalCalories = calculateTotalCalories(exercises);
    }
    if (notes !== undefined) workout.notes = notes;

    await workout.save();

    res.json({ message: "Workout updated", workout });
  } catch (err) {
    console.error("updateWorkout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /workouts/:id
 */
export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!workout) return res.status(404).json({ message: "Workout not found" });

    res.json({ message: "Workout deleted" });
  } catch (err) {
    console.error("deleteWorkout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /workouts/weekly-summary
 */
export const getWeeklySummary = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const workouts = await Workout.find({
      user: req.user.id,
      date: { $gte: sevenDaysAgo, $lte: today },
    }).sort({ date: 1 });

    const summary = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);

      const w = workouts.filter(
        (wk) => wk.date.toISOString().slice(0, 10) === key
      );

      const calories = w.reduce((sum, wk) => sum + (wk.totalCalories || 0), 0);

      summary.push({ date: key, calories });
    }

    res.json(summary);
  } catch (err) {
    console.error("getWeeklySummary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /workouts/monthly-summary
 */
export const getMonthlySummary = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 29);

    const workouts = await Workout.find({
      user: req.user.id,
      date: { $gte: thirtyDaysAgo, $lte: today },
    }).sort({ date: 1 });

    const map = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() - (29 - i));
      const key = d.toISOString().slice(0, 10);
      map[key] = 0;
    }

    workouts.forEach((wk) => {
      const key = wk.date.toISOString().slice(0, 10);
      if (map[key] !== undefined) {
        map[key] += wk.totalCalories || 0;
      }
    });

    const summary = Object.entries(map).map(([date, calories]) => ({
      date,
      calories,
    }));

    res.json(summary);
  } catch (err) {
    console.error("getMonthlySummary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
