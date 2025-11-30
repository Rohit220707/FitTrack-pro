// frontend/services/auth.js
import authApi from "../utils/authApi";

export async function loginUser(credentials) {
  const res = await authApi.post("/auth/login", credentials);
  return res.data;
}

export async function registerUser(data) {
  const res = await authApi.post("/auth/register", data);
  return res.data;
}

export async function getProfile() {
  const res = await authApi.get("/auth/me");
  return res.data;
}

export async function updateProfile(data) {
  const res = await authApi.put("/auth/update-profile", data);
  return res.data;
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await authApi.post("/auth/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}
