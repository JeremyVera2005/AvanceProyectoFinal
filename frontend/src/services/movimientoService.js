// src/services/movimientoService.js
import baseApi from "./baseApi";

const getAll = async () => {
  try {
    const res = await baseApi.get("/movimientos");
    return res.data;
  } catch (err) {
    console.error("❌ Error al obtener movimientos:", err);
    throw err;
  }
};

const create = async (payload) => {
  try {
    const res = await baseApi.post("/movimientos", payload);
    return res.data;
  } catch (err) {
    console.error("❌ Error al crear movimiento:", err);
    throw err;
  }
};

const update = async (id, payload) => {
  try {
    const res = await baseApi.put(`/movimientos/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error(`❌ Error al actualizar movimiento ${id}:`, err);
    throw err;
  }
};

const remove = async (id) => {
  try {
    const res = await baseApi.delete(`/movimientos/${id}`);
    return res.data;
  } catch (err) {
    console.error(`❌ Error al eliminar movimiento ${id}:`, err);
    throw err;
  }
};

export default { getAll, create, update, remove };
