// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import workoutRoutes from "./routes/workouts.js";
import trackerRoutes from "./routes/tracker.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/workouts", workoutRoutes);
app.use("/tracker", trackerRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Fitness API is running" });
});

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
