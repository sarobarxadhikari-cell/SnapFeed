import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedUsers, setSavedUsers] = useState([]);
  const [showPasswordInput, setShowPasswordInput] = useState(null);
  const { user, login, setSavedUsers: saveUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/feed", { replace: true });
    const saved = JSON.parse(localStorage.getItem("sv_saved_users") || "[]");
    setSavedUsers(saved);
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("All fields required"); return; }

    setLoading(true);
    try {
      const res = await AuthAPI.login({ email, password });
      login(res.data.user, res.data.token);
      const existing = JSON.parse(localStorage.getItem("sv_saved_users") || "[]");
      const filtered = existing.filter(u => u.email !== res.data.user.email);
      filtered.push({ email: res.data.user.email, name: res.data.user.name, photo: res.data.user.photo });
      localStorage.setItem("sv_saved_users", JSON.stringify(filtered));
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const continueAs = (saved) => {
    setEmail(saved.email);
    setShowPasswordInput(saved.email);
  };

  const removeSaved = (e, savedEmail) => {
    e.stopPropagation();
    const updated = savedUsers.filter(u => u.email !== savedEmail);
    setSavedUsers(updated);
    localStorage.setItem("sv_saved_users", JSON.stringify(updated));
    if (showPasswordInput === savedEmail) setShowPasswordInput(null);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <h1 className="logo-text">Snapverse</h1>
          <p className="logo-sub">Connect. Share. Snap.</p>
        </div>

        {savedUsers.length > 0 && !showPasswordInput && (
          <div className="continue-as-section">
            <p className="continue-as-label">Continue as</p>
            {savedUsers.map((saved) => (
              <div key={saved.email} className="continue-as-card" onClick={() => continueAs(saved)}>
                <div className="continue-as-avatar">
                  {saved.photo ? <img src={saved.photo} /> : saved.name?.charAt(0)}
                </div>
                <div className="continue-as-info">
                  <b>{saved.name}</b>
                  <p>{saved.email}</p>
                </div>
                <button className="continue-as-remove" onClick={(e) => removeSaved(e, saved.email)}>✕</button>
              </div>
            ))}
            <div className="auth-divider"><span>OR</span></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            autoFocus={!showPasswordInput}
          />
          {(!showPasswordInput || showPasswordInput === email) && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              autoFocus={!!showPasswordInput}
            />
          )}
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : showPasswordInput ? "Log In" : "Log In"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <Link to="/signup" className="auth-switch-btn">
          Create New Account
        </Link>
      </div>
    </div>
  );
}
