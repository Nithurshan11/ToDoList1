import axios from "axios";

export const createApiClient = (getToken) => {
  const instance = axios.create({
    baseURL: "/api"
  });

  instance.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

