// src/pages/Usuarios.jsx
import React, { useEffect, useState } from "react";
import usuarioService from "../services/usuarioService";
import { User, Mail, Lock, Search } from "lucide-react";
import Swal from "sweetalert2";

const Usuarios = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol: "admin",
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // Cargar usuarios
  const fetchData = async () => {
    try {
      const data = await usuarioService.getAll();
      setItems(data);
    } catch (err) {
      console.error("❌ Error cargando usuarios:", err);
      Swal.fire("Error", "❌ No se pudieron cargar los usuarios", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Guardar o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación: contraseña obligatoria solo al crear
    if (!form.nombre || !form.apellido || !form.email || (!editId && !form.password)) {
      Swal.fire("Campos vacíos", "⚠️ Todos los campos son obligatorios", "warning");
      return;
    }

    try {
      if (editId) {
        // Solo actualizar campos editables, no password
        const payload = {
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          rol: form.rol,
        };
        await usuarioService.update(editId, payload);
        Swal.fire("Actualizado", "✏️ Usuario actualizado con éxito", "success");
        setEditId(null);
      } else {
        await usuarioService.create(form);
        Swal.fire("Creado", "✅ Usuario agregado con éxito", "success");
      }

      setForm({ nombre: "", apellido: "", email: "", password: "", rol: "admin" });
      fetchData();
    } catch (err) {
      console.error("❌ Error guardando usuario:", err);
      Swal.fire("Error", "❌ No se pudo guardar el usuario", "error");
    }
  };

  // Editar usuario
  const handleEdit = (u) => {
    setForm({
      nombre: u.nombre || "",
      apellido: u.apellido || "",
      email: u.email || "",
      rol: u.rol || "admin",
      password: "", // eliminamos el password
    });
    setEditId(u.id);
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditId(null);
    setForm({ nombre: "", apellido: "", email: "", password: "", rol: "admin" });
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await usuarioService.remove(id);
          Swal.fire("Eliminado", "🗑️ Usuario eliminado", "success");
          fetchData();
        } catch (err) {
          Swal.fire("Error", "❌ No se pudo eliminar el usuario", "error");
        }
      }
    });
  };

  // Filtrado
  const filteredUsers = items.filter(
    (u) =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.apellido.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="mt-6 p-6 space-y-6">
      {/* Card de título y búsqueda */}
      <div className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-2xl font-semibold text-gray-800">Gestión de Usuarios</h2>
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full md:w-80">
          <Search className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Formulario */}
        <div className="md:w-1/3 bg-white rounded-2xl shadow p-5">
          <h5 className="text-lg font-semibold mb-4">
            {editId ? "Editar Usuario" : "Nuevo Usuario"}
          </h5>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <User className="text-gray-500 mr-3" size={20} />
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre"
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>

            {/* Apellido */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <User className="text-gray-500 mr-3" size={20} />
              <input
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                placeholder="Apellido"
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>

            {/* Email */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <Mail className="text-gray-500 mr-3" size={20} />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>

            {/* Password solo al crear */}
            {!editId && (
              <div className="flex items-center border-b border-gray-300 py-2 relative">
                <Lock className="text-gray-500 mr-3" size={20} />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Password"
                  className="w-full bg-transparent focus:outline-none text-gray-700 pr-8"
                />
              </div>
            )}

            {/* Rol */}
            <select
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="admin">Admin</option>
              <option value="vendedor">Vendedor</option>
            </select>

            {/* Botones */}
            <div className="flex flex-col gap-2 mt-2">
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

        {/* Tabla */}
        <div className="md:w-2/3 bg-white rounded-2xl shadow p-5">
          <h5 className="text-lg font-semibold mb-4">Listado de Usuarios</h5>

          <div className="overflow-y-auto max-h-[400px] border rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-emerald-600 text-white z-10">
                <tr>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Apellido</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Rol</th>
                  <th className="px-3 py-2">Contraseña</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u, i) => (
                    <tr
                      key={u.id}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-emerald-50`}
                    >
                      <td className="px-3 py-2 font-medium text-slate-700">{u.nombre}</td>
                      <td className="px-3 py-2 text-slate-600">{u.apellido}</td>
                      <td className="px-3 py-2 text-slate-600">{u.email}</td>
                      <td className="px-3 py-2 text-slate-600">{u.rol}</td>
                      <td className="px-3 py-2 text-slate-600">••••••••</td>
                      <td className="px-3 py-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(u)}
                          className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="bg-rose-600 text-white px-3 py-1 rounded hover:bg-rose-700"
                        >
                          Borrar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No hay usuarios registrados
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

export default Usuarios;


