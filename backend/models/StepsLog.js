// backend/models/StepsLog.js
import mongoose from "mongoose";

const stepsLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    steps: { type: Number, required: true },
  },
  { timestamps: true }
);

stepsLogSchema.index({ user: 1, date: 1 }, { unique: true });

const StepsLog = mongoose.model("StepsLog", stepsLogSchema);
export default StepsLog;
