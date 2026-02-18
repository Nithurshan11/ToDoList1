import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "ff_token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => window.localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await authService.getMe(token);
        setUser(me);
      } catch {
        setToken("");
        window.localStorage.removeItem(TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token]);

  const login = async (email, password) => {
    const { token: newToken, user: authUser } = await authService.login(email, password);
    setToken(newToken);
    setUser(authUser);
    window.localStorage.setItem(TOKEN_KEY, newToken);
  };

  const register = async (username, email, password) => {
    const { token: newToken, user: authUser } = await authService.register(username, email, password);
    setToken(newToken);
    setUser(authUser);
    window.localStorage.setItem(TOKEN_KEY, newToken);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    window.localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

