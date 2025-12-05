// src/services/baseApi.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // 👈 TU BACKEND LOCAL

const baseApi = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 🔐 Agregar token automáticamente
baseApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚫 Manejar 401 y desloguear
baseApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default baseApi;
