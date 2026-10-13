import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tb_user") || "null");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(
    Boolean(localStorage.getItem("tb_token")),
  );
  useEffect(() => {
    if (!localStorage.getItem("tb_token")) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("tb_user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("tb_token");
        localStorage.removeItem("tb_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);
  const signIn = async (path, payload) => {
    const { data } = await api.post(`/auth/${path}`, payload);
    localStorage.setItem("tb_token", data.token);
    localStorage.setItem("tb_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };
  const logout = () => {
    localStorage.removeItem("tb_token");
    localStorage.removeItem("tb_user");
    setUser(null);
  };
  const refreshUser = async () => {
    const { data } = await api.get("/auth/me");
    setUser(data.user);
    localStorage.setItem("tb_user", JSON.stringify(data.user));
  };
  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
