// src/pages/Categorias.jsx
import React, { useEffect, useState } from "react";
import categoriaService from "../services/categoriaService";
import { Tags, FileText, ToggleLeft, Search } from "lucide-react";
import Swal from "sweetalert2";

const Categorias = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "", estado: "Activo" });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const data = await categoriaService.getAll();
      setItems(data);
    } catch (err) {
      console.error("❌ Error cargando categorías:", err);
      Swal.fire("Error", "No se pudieron cargar las categorías", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre) {
      Swal.fire("Campos vacíos", "⚠️ El nombre es obligatorio", "warning");
      return;
    }

    try {
      if (editId) {
        await categoriaService.update(editId, form);
        Swal.fire("Actualizado", "✏️ Categoría actualizada con éxito", "success");
        setEditId(null);
      } else {
        await categoriaService.create(form);
        Swal.fire("Creado", "✅ Categoría creada con éxito", "success");
      }

      setForm({ nombre: "", descripcion: "", estado: "Activo" });
      fetchData();
    } catch (err) {
      Swal.fire("Error", "❌ No se pudo guardar la categoría", "error");
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setForm({
      nombre: cat.nombre || "",
      descripcion: cat.descripcion || "",
      estado: cat.estado || "Activo",
    });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm({ nombre: "", descripcion: "", estado: "Activo" });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await categoriaService.remove(id);
          Swal.fire("Eliminado", "🗑️ Categoría eliminada", "success");
          fetchData();
        } catch (err) {
          Swal.fire("Error", "❌ No se pudo eliminar la categoría", "error");
        }
      }
    });
  };

  // 🔍 Filtrado
  const filteredItems = items.filter(
    (cat) =>
      cat.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (cat.descripcion || "").toLowerCase().includes(search.toLowerCase()) ||
      cat.estado.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="mt-6 p-6 space-y-6">
      {/* 🔹 Card de título y búsqueda */}
      <div className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-2xl font-semibold text-gray-800">Gestión de Categorías</h2>
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full md:w-80">
          <Search className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-gray-700"
          />
        </div>
      </div>

      {/* 🔹 Contenido principal */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* 🧾 Formulario */}
        <div className="md:w-1/3 bg-white rounded-2xl shadow p-5">
          <h5 className="text-lg font-semibold mb-4">
            {editId ? "Editar Categoría" : "Nueva Categoría"}
          </h5>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nombre */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <Tags className="text-gray-500 mr-3" size={20} />
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre de la categoría"
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>

            {/* Descripción */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <FileText className="text-gray-500 mr-3" size={20} />
              <input
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Descripción"
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>

            {/* Estado */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <ToggleLeft className="text-gray-500 mr-3" size={20} />
              <select
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
                className="w-full bg-transparent focus:outline-none text-gray-700"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className={`w-full ${
                  editId ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-600 hover:bg-emerald-700"
                } text-white py-2 rounded-lg`}
              >
                {editId ? "Actualizar" : "Crear"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* 📋 Tabla */}
        <div className="md:w-2/3 bg-white rounded-2xl shadow p-5">
          <h5 className="text-lg font-semibold mb-4">Listado de Categorías</h5>

          <div className="overflow-y-auto max-h-[400px] border rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-emerald-600 text-white z-10">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Descripción</th>
                  <th className="px-3 py-2">Estado</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((cat, i) => (
                    <tr
                      key={cat.id}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-emerald-50`}
                    >
                      <td className="px-3 py-2">{cat.id}</td>
                      <td className="px-3 py-2">{cat.nombre}</td>
                      <td className="px-3 py-2">{cat.descripcion}</td>
                      <td className="px-3 py-2">{cat.estado}</td>

                      <td className="px-3 py-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="bg-rose-600 text-white px-3 py-1 rounded hover:bg-rose-700"
                        >
                          Borrar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No hay categorías registradas
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categorias;
