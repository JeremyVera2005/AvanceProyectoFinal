// components/Navbar.js
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Sun, Moon } from "lucide-react";

const Navbar = ({ onToggleDark }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const location = useLocation();

  // Títulos según página
  const pageTitles = {
    "/inicio": "Menu Principal",
    "/dashboard": "Dashboard",
    "/movimientos": "Movimientos",
    "/productos": "Productos",
    "/proveedores": "Proveedores",
    "/usuarios": "Usuarios",
    "/categorias": "Categorias",
  };

  const currentTitle = pageTitles[location.pathname] || "Sistema de Ventas";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDarkToggle = () => {
    setDarkMode(!darkMode);
    onToggleDark(!darkMode);
  };

  // 🔥 LOGOUT REAL — Limpia todo
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rol");

    window.location.href = "/login"; // Redirigir limpio
  };

  return (
    <header
      className={`flex items-center justify-between border-b px-6 py-3 shadow-sm transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h1 className="text-lg font-bold">{currentTitle}</h1>

      <div className="flex items-center gap-4">
        

        {/* Modo oscuro */}
        <button onClick={handleDarkToggle} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
          {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
