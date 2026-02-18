import { createApiClient } from "./apiClient.js";

export const createAnalyticsService = (getToken) => {
  const api = createApiClient(getToken);

  return {
    async overview() {
      const { data } = await api.get("/analytics/overview");
      return data;
    },
    async byDate(month) {
      const { data } = await api.get("/analytics/by-date", { params: { month } });
      return data;
    }
  };
};

