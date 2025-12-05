import baseApi from "./baseApi";

const getAll = async () => {
  try {
    const res = await baseApi.get("/users");
    return res.data;
  } catch (err) {
    console.error("❌ Error al obtener usuarios:", err);
    throw err;
  }
};

const create = async (payload) => {
  try {
    const res = await baseApi.post("/users", payload);
    return res.data;
  } catch (err) {
    console.error("❌ Error al crear usuario:", err);
    throw err;
  }
};

const update = async (id, payload) => {
  try {
    const res = await baseApi.put(`/users/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error(`❌ Error al actualizar usuario ${id}:`, err);
    throw err;
  }
};

const remove = async (id) => {
  try {
    const res = await baseApi.delete(`/users/${id}`);
    return res.data;
  } catch (err) {
    console.error(`❌ Error al eliminar usuario ${id}:`, err);
    throw err;
  }
};

export default { getAll, create, update, remove };
