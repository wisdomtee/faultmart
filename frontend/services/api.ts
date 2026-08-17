import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const auth = localStorage.getItem("faultmart-auth");

    if (auth) {
      const parsed = JSON.parse(auth);
      const token = parsed?.state?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }

  return config;
});

export default api;