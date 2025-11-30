// backend/models/Workout.js
import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number },
    reps: { type: Number },
    weight: { type: Number },
    durationMin: { type: Number },
    calories: { type: Number },
  },
  { _id: false }
);

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    exercises: [exerciseSchema],
    notes: { type: String },
    totalCalories: { type: Number },
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);
export default Workout;
