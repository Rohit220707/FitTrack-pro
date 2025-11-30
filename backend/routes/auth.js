import express from "express";
import {
  register,
  login,
  me,
  refreshToken,
  forgotPassword,
  resetPassword,
  updateProfile,
  uploadAvatar,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import avatarUpload from "../middleware/avatarUpload.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", authMiddleware, me);
router.put("/update-profile", authMiddleware, updateProfile);

// NEW: avatar upload route
router.post(
  "/upload-avatar",
  authMiddleware,
  avatarUpload.single("avatar"),
  uploadAvatar
);

export default router;
