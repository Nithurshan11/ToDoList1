import { createApiClient } from "./apiClient.js";
import { authService } from "./authService.js";

// getToken will be provided from context; here we just expose a factory
export const createTasksService = (getToken) => {
  const api = createApiClient(getToken);

  return {
    async list(params = {}) {
      const { data } = await api.get("/tasks", { params });
      return data.tasks;
    },
    async history(limit = 50) {
      const { data } = await api.get("/tasks/history", { params: { limit } });
      return data.tasks;
    },
    async create(payload) {
      const { data } = await api.post("/tasks", payload);
      return data.task;
    },
    async update(id, payload) {
      const { data } = await api.put(`/tasks/${id}`, payload);
      return data.task;
    },
    async updateStatus(id, status) {
      const { data } = await api.patch(`/tasks/${id}/status`, { status });
      return data.task;
    },
    async remove(id) {
      await api.delete(`/tasks/${id}`);
    }
  };
};

