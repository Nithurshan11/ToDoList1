import { createApiClient } from "./apiClient.js";

export const createFitnessService = (getToken) => {
  const api = createApiClient(getToken);

  return {
    async getDays(month) {
      const { data } = await api.get("/fitness/days", { params: { month } });
      return data.days;
    },
    async saveDay(payload) {
      const { data } = await api.post("/fitness/day", payload);
      return data.entry;
    },
    async deleteEntry(id) {
      await api.delete(`/fitness/day/${id}`);
    },
    async overview(month) {
      const { data } = await api.get("/fitness/analytics/overview", { params: { month } });
      return data;
    }
  };
};

