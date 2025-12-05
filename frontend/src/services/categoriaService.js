import api from "./baseApi";

const categoriaService = {
  getAll: async () => {
    const res = await api.get("/categorias");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/categorias/${id}`);
    return res.data;
  },

  create: async (categoria) => {
    const res = await api.post("/categorias", categoria);
    return res.data;
  },

  update: async (id, categoria) => {
    const res = await api.put(`/categorias/${id}`, categoria);
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/categorias/${id}`);
    return res.data;
  }
};

export default categoriaService;

