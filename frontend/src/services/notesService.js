import { createApiClient } from "./apiClient.js";

export const createNotesService = (getToken) => {
  const api = createApiClient(getToken);

  return {
    async list() {
      const { data } = await api.get("/notes");
      return data.notes;
    },
    async create(payload) {
      const { data } = await api.post("/notes", payload);
      return data.note;
    },
    async update(id, payload) {
      const { data } = await api.put(`/notes/${id}`, payload);
      return data.note;
    },
    async remove(id) {
      await api.delete(`/notes/${id}`);
    }
  };
};

