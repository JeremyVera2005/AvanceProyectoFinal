import baseApi from "./baseApi";

const getAll = async () => {
  try {
    const res = await baseApi.get("/proveedores");
    return res.data;
  } catch (err) {
    console.error("❌ Error al obtener proveedores:", err);
    throw err;
  }
};

const create = async (payload) => {
  try {
    const res = await baseApi.post("/proveedores", payload);
    return res.data;
  } catch (err) {
    console.error("❌ Error al crear proveedor:", err);
    throw err;
  }
};

const update = async (id, payload) => {
  try {
    const res = await baseApi.put(`/proveedores/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error(`❌ Error al actualizar proveedor ${id}:`, err);
    throw err;
  }
};

const remove = async (id) => {
  try {
    const res = await baseApi.delete(`/proveedores/${id}`);
    return res.data;
  } catch (err) {
    console.error(`❌ Error al eliminar proveedor ${id}:`, err);
    throw err;
  }
};

export default { getAll, create, update, remove };
