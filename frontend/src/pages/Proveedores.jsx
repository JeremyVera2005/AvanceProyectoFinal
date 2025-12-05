// src/pages/Proveedores.jsx
import React, { useEffect, useState } from "react";
import proveedorService from "../services/proveedorService";
import { Building2, Phone, User, Search } from "lucide-react";
import Swal from "sweetalert2";

const Proveedores = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ nombre: "", contacto: "", telefono: "" });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const data = await proveedorService.getAll();
      setItems(data);
    } catch (err) {
      console.error("❌ Error cargando proveedores:", err);
      Swal.fire("Error", "No se pudieron cargar los proveedores", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.contacto || !form.telefono) {
      Swal.fire("Campos vacíos", "⚠️ Todos los campos son obligatorios", "warning");
      return;
    }

    try {
      if (editId) {
        await proveedorService.update(editId, form);
        Swal.fire("Actualizado", "✏️ Proveedor actualizado con éxito", "success");
        setEditId(null);
      } else {
        await proveedorService.create(form);
        Swal.fire("Creado", "✅ Proveedor agregado con éxito", "success");
      }

      setForm({ nombre: "", contacto: "", telefono: "" });
      fetchData();
    } catch (err) {
      Swal.fire("Error", "❌ No se pudo guardar el proveedor", "error");
    }
  };

  const handleEdit = (prov) => {
    setEditId(prov.id);
    setForm({
      nombre: prov.nombre || "",
      contacto: prov.contacto || "",
      telefono: prov.telefono || "",
    });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm({ nombre: "", contacto: "", telefono: "" });
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
          await proveedorService.remove(id);
          Swal.fire("Eliminado", "🗑️ Proveedor eliminado", "success");
          fetchData();
        } catch (err) {
          Swal.fire("Error", "❌ No se pudo eliminar el proveedor", "error");
        }
      }
    });
  };

  // 🔍 Filtrado
  const filteredItems = items.filter(
    (prov) =>
      prov.nombre.toLowerCase().includes(search.toLowerCase()) ||
      prov.contacto.toLowerCase().includes(search.toLowerCase()) ||
      prov.telefono.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="mt-6 p-6 space-y-6">
      {/* 🔹 Card de título y búsqueda */}
      <div className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-2xl font-semibold text-gray-800">Gestión de Proveedores</h2>
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full md:w-80">
          <Search className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            placeholder="Buscar proveedor..."
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
            {editId ? "Editar Proveedor" : "Nuevo Proveedor"}
          </h5>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border-b border-gray-300 py-2">
              <Building2 className="text-gray-500 mr-3" size={20} />
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre del proveedor"
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>
            <div className="flex items-center border-b border-gray-300 py-2">
              <User className="text-gray-500 mr-3" size={20} />
              <input
                value={form.contacto}
                onChange={(e) => setForm({ ...form, contacto: e.target.value })}
                placeholder="Nombre del contacto"
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>
            <div className="flex items-center border-b border-gray-300 py-2">
              <Phone className="text-gray-500 mr-3" size={20} />
              <input
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                placeholder="Teléfono"
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
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
          <h5 className="text-lg font-semibold mb-4">Listado de Proveedores</h5>

          <div className="overflow-y-auto max-h-[400px] border rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-emerald-600 text-white z-10">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Contacto</th>
                  <th className="px-3 py-2">Teléfono</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((prov, i) => (
                    <tr
                      key={prov.id}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-emerald-50`}
                    >
                      <td className="px-3 py-2">{prov.id}</td>
                      <td className="px-3 py-2">{prov.nombre}</td>
                      <td className="px-3 py-2">{prov.contacto}</td>
                      <td className="px-3 py-2">{prov.telefono}</td>
                      <td className="px-3 py-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(prov)}
                          className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(prov.id)}
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
                      No hay proveedores registrados
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

export default Proveedores;
