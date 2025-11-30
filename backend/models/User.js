import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },

    // NEW FIELDS
    profilePicture: { type: String },
    age: { type: Number },
    heightCm: { type: Number },
    weightKg: { type: Number },
    fitnessGoal: { type: String },

    refreshToken: { type: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
