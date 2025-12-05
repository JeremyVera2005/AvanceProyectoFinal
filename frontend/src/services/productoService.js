// src/services/productoService.js
import baseApi from "./baseApi";

const getAll = async () => {
  try {
    const res = await baseApi.get("/productos");
    return res.data;
  } catch (err) {
    console.error("❌ Error al obtener productos:", err);
    throw err;
  }
};

const create = async (payload) => {
  try {
    const res = await baseApi.post("/productos", payload);
    return res.data;
  } catch (err) {
    console.error("❌ Error al crear producto:", err);
    throw err;
  }
};

const update = async (id, payload) => {
  try {
    const res = await baseApi.put(`/productos/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error(`❌ Error al actualizar producto ${id}:`, err);
    throw err;
  }
};

const remove = async (id) => {
  try {
    const res = await baseApi.delete(`/productos/${id}`);
    return res.data;
  } catch (err) {
    console.error(`❌ Error al eliminar producto ${id}:`, err);
    throw err;
  }
};

export default { getAll, create, update, remove };
