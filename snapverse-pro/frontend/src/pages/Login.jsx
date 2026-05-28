import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handle = async () => {
    setError("");
    if (!form.email || !form.password || (mode === "signup" && !form.name)) {
      setError("All fields required"); return;
    }

    try {
      const url = mode === "signup" ? "/auth/signup" : "/auth/login";
      const body = mode === "signup"
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };

      const res = await axios.post(url, body);
      onLogin(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="logo">Snapverse Pro</h1>
        <p className="sub">Real-time encrypted chat & calls</p>

        <div className="tabs">
          <span className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Log In</span>
          <span className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Sign Up</span>
        </div>

        {mode === "signup" && (
          <input placeholder="Full name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
        )}
        <input placeholder="Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === "Enter" && handle()} />

        {error && <p className="error">{error}</p>}

        <button className="btn blue" onClick={handle}>
          {mode === "signup" ? "Create Account" : "Log In"}
        </button>
      </div>
    </div>
  );
}
