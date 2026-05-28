import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("sv_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get("/auth/me")
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem("sv_token");
          localStorage.removeItem("sv_user");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (userData, tokenStr) => {
    localStorage.setItem("sv_token", tokenStr);
    localStorage.setItem("sv_user", JSON.stringify(userData));
    setToken(tokenStr);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("sv_token");
    localStorage.removeItem("sv_user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const switchAccount = (savedUser) => {
    localStorage.removeItem("sv_token");
    localStorage.removeItem("sv_user");
    setToken(null);
    setUser(null);
    window.location.href = "/";
    localStorage.setItem("sv_switched_email", savedUser.email);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, switchAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
