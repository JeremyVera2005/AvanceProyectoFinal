// src/services/authService.js
import baseApi from "./baseApi";

const authService = {
  login: async ({ email, password }) => {
    try {
      const res = await baseApi.post("/auth/login", { email, password });

      const { token, user } = res.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      return { token, user };
    } catch (err) {
      console.error("❌ Error en login:", err.response?.data || err.message);

      throw new Error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Error al iniciar sesión"
      );
    }
  },
};

export default authService;
