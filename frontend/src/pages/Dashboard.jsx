// src/pages/Dashboard.jsx
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const API_BASE = "http://localhost:5000/api";

const Dashboard = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [stockFilter, setStockFilter] = useState("mayor");

  const COLORS = ["#0088FE", "#FF8042"];

  useEffect(() => {
    fetchMovimientos();
    fetchProductos();
    fetchProveedores();
  }, []);

  const fetchMovimientos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/movimientos`);
      setMovimientos(res.data || []);
    } catch (err) {
      console.error("Error cargando movimientos:", err);
    }
  };

  const fetchProductos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/productos`);
      setProductos(res.data || []);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  const fetchProveedores = async () => {
    try {
      const res = await axios.get(`${API_BASE}/proveedores`);
      setProveedores(res.data || []);
    } catch (err) {
      console.error("Error cargando proveedores:", err);
    }
  };

  // KPI: ingresos totales (stock × precio)
  const totalIngresos = useMemo(() => {
    return productos.reduce((acc, p) => acc + p.stock * p.precio, 0).toFixed(2);
  }, [productos]);

  // Top 10 productos
  const productosTop10 = useMemo(() => {
    return [...productos]
      .sort((a, b) =>
        stockFilter === "mayor" ? b.stock - a.stock : a.stock - b.stock
      )
      .slice(0, 10);
  }, [productos, stockFilter]);

  // Datos para gráfico circular: cantidad total de productos ingresados/salidos
  const totalProductosIngresados = movimientos
    .filter((m) => m.tipo === "Ingreso")
    .reduce((acc, m) => acc + m.cantidad, 0);

  const totalProductosSalidos = movimientos
    .filter((m) => m.tipo === "Salida")
    .reduce((acc, m) => acc + m.cantidad, 0);

  const pieData = [
    { name: "Ingresos", value: totalProductosIngresados },
    { name: "Salidas", value: totalProductosSalidos },
  ];

  // Datos para gráfico de barras: número exacto de movimientos
  const cantidadIngresos = movimientos.filter((m) => m.tipo === "Ingreso").length;
  const cantidadSalidas = movimientos.filter((m) => m.tipo === "Salida").length;

  const barData = [
    { tipo: "Ingresos", cantidad: cantidadIngresos },
    { tipo: "Salidas", cantidad: cantidadSalidas },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {/* Gráfico circular */}
      <section className="bg-white rounded-2xl p-4 shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Cantidad Total de Productos Ingresos vs Salidas</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent, value }) =>
                `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Gráfico de barras */}
      <section className="bg-white rounded-2xl p-4 shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Cantidad de Movimientos</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Tabla + KPIs al costado */}
      <section className="flex gap-6">
        {/* Tabla */}
        <div className="flex-1 bg-white rounded-2xl p-4 shadow-md overflow-x-auto">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-semibold">Productos Top 10 por Stock</h4>
            <select
              className="border px-3 py-2 rounded-lg"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="mayor">Mayor Stock</option>
              <option value="menor">Menor Stock</option>
            </select>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Stock</th>
                <th className="px-3 py-2">Precio</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {productosTop10.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{p.nombre}</td>
                  <td className="px-3 py-2">{p.stock}</td>
                  <td className="px-3 py-2">S/ {p.precio.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* KPIs */}
        <div className="w-72 flex flex-col gap-4">
          <div className="rounded-2xl bg-white p-4 shadow-md">
            <p className="text-xs text-gray-500 uppercase">Total Productos</p>
            <h3 className="mt-1 text-2xl font-bold">{productos.length}</h3>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-md">
            <p className="text-xs text-gray-500 uppercase">Proveedores</p>
            <h3 className="mt-1 text-2xl font-bold">{proveedores.length}</h3>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-md">
            <p className="text-xs text-gray-500 uppercase">Ingresos Totales (S/)</p>
            <h3 className="mt-1 text-2xl font-bold">S/ {totalIngresos}</h3>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
