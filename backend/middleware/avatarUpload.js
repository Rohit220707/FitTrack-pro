// backend/middleware/avatarUpload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "fitness-app/avatars",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [
      { width: 300, height: 300, crop: "fill", gravity: "face" }
    ]
  }
});

const avatarUpload = multer({ storage });

export default avatarUpload;
