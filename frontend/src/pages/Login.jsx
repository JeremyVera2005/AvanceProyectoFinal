import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await authService.login({ email, password });

      if (res?.token) {
        // Guardamos todo lo necesario
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

      navigate("/inicio"); // <-- Redirige a Inicio en vez de Dashboard
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="relative w-96">

        {/* Logo circular */}
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
          <div className="w-40 h-40 bg-black rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
            <img
              src="/Logo-Quantika.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg pt-28">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Bienvenido
          </h2>

          {error && (
            <p className="text-red-500 mb-4 text-center font-medium">{error}</p>
          )}

          {/* Email */}
          <div className="flex items-center border-b border-gray-400 mb-6 py-2">
            <Mail className="text-gray-500 mr-3" size={20} />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-gray-700"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center border-b border-gray-400 mb-6 py-2">
            <Lock className="text-gray-500 mr-3" size={20} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-gray-700"
              required
            />
          </div>

          {/* Opciones */}
          <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 accent-black" />
              Recordarme
            </label>
            <a href="#" className="text-gray-500 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
