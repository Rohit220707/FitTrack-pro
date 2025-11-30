import axios from "axios";

// DEBUG — to confirm env value is loading
console.log("🔥 API Base URL:", process.env.NEXT_PUBLIC_API_URL);

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

authApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default authApi;
