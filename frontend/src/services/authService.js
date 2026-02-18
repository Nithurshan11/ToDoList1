import axios from "axios";

const base = "/api/auth";

export const authService = {
  async login(email, password) {
    const { data } = await axios.post(`${base}/login`, { email, password });
    return data;
  },
  async register(username, email, password) {
    const { data } = await axios.post(`${base}/register`, { username, email, password });
    return data;
  },
  async getMe(token) {
    const { data } = await axios.get(`${base}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.user;
  }
};

