import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Snap from "./pages/Snap";
import Call from "./pages/Call";

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("sv_token"));

  useEffect(() => {
    const stored = localStorage.getItem("sv_user");
    if (stored && token) {
      setUser(JSON.parse(stored));
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

  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/" /> : <Login onLogin={login} />
        } />
        <Route path="/" element={
          user ? <Home user={user} token={token} onLogout={logout} /> : <Navigate to="/login" />
        } />
        <Route path="/chat/:userId" element={
          user ? <Chat user={user} token={token} /> : <Navigate to="/login" />
        } />
        <Route path="/snap" element={
          user ? <Snap user={user} /> : <Navigate to="/login" />
        } />
        <Route path="/call/:userId" element={
          user ? <Call user={user} /> : <Navigate to="/login" />
        } />
      </Routes>
    </div>
  );
}
