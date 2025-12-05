import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inicio from "./pages/Inicio";
import Usuarios from "./pages/Usuarios";
import Productos from "./pages/Productos";
import Proveedores from "./pages/Proveedores";
import Movimientos from "./pages/Movimientos";
import Categorias from "./pages/Categorias";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import VendedorRoute from "./components/VendedorRoute";

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>

        {/* 👉 REDIRECCIÓN A LOGIN */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 👉 PÚBLICO */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 RUTAS PROTEGIDAS */}
        <Route element={<ProtectedRoute />}>

          {/* ✔ TODOS LOS USUARIOS LOGUEADOS */}
          <Route
            path="/inicio"
            element={
              <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                <Inicio />
              </Layout>
            }
          />

          <Route
            path="/productos"
            element={
              <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                <Productos />
              </Layout>
            }
          />

          <Route
            path="/proveedores"
            element={
              <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                <Proveedores />
              </Layout>
            }
          />

          <Route
            path="/movimientos"
            element={
              <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                <Movimientos />
              </Layout>
            }
          />

          <Route
            path="/categorias"
            element={
              <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                <Categorias />
              </Layout>
            }
          />

          {/* 🔴 SOLO ADMIN */}
          <Route element={<AdminRoute />}>
            <Route
              path="/dashboard"
              element={
                <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <Dashboard />
                </Layout>
              }
            />

            <Route
              path="/usuarios"
              element={
                <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <Usuarios />
                </Layout>
              }
            />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
