// backend/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import validator from "validator";
import cloudinary from "../config/cloudinary.js";

// -----------------------------
// TOKEN HELPERS
// -----------------------------

function createAccessToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXP || "15m" }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXP || "7d" }
  );
}

// -----------------------------
// REGISTER
// -----------------------------
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email & password required" });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: "User registered successfully",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------
// LOGIN
// -----------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        age: user.age,
        heightCm: user.heightCm,
        weightKg: user.weightKg,
        fitnessGoal: user.fitnessGoal,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------
// GET CURRENT USER /auth/me
// -----------------------------
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken"
    );

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("ME ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------
// REFRESH TOKEN
// -----------------------------
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: incomingToken } = req.body;

    if (!incomingToken)
      return res.status(400).json({ message: "Refresh token required" });

    let payload;
    try {
      payload = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== incomingToken)
      return res.status(401).json({ message: "Refresh token not recognized" });

    const accessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("REFRESH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------
// FORGOT PASSWORD
// -----------------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email))
      return res.status(400).json({ message: "Valid email required" });

    const user = await User.findOne({ email: email.toLowerCase() });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `http://localhost:5001/auth/reset-password?token=${resetToken}`;
    console.log("Reset URL:", resetUrl);

    res.json({
      message: "Password reset link generated",
      resetUrl,
    });
  } catch (err) {
    console.error("FORGOT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------
// RESET PASSWORD
// -----------------------------
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------
// UPDATE PROFILE (name, email, password, fitness fields)
// -----------------------------
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const { name, email, password, age, heightCm, weightKg, fitnessGoal } =
      req.body;

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (age !== undefined) user.age = age;
    if (heightCm !== undefined) user.heightCm = heightCm;
    if (weightKg !== undefined) user.weightKg = weightKg;
    if (fitnessGoal) user.fitnessGoal = fitnessGoal;

    if (password)
      user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------
// UPLOAD AVATAR TO CLOUDINARY
// -----------------------------
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.profilePicture = req.file.path;
    await user.save();

    res.json({
      message: "Profile picture updated",
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    console.error("UPLOAD AVATAR ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
