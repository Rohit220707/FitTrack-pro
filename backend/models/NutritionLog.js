// backend/models/NutritionLog.js
import mongoose from "mongoose";

const nutritionLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack", "meal"],
      default: "meal",
    },
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
  },
  { timestamps: true }
);

nutritionLogSchema.index({ user: 1, date: 1 });

const NutritionLog = mongoose.model("NutritionLog", nutritionLogSchema);
export default NutritionLog;
