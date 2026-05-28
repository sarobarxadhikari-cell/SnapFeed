import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState({ level: "", score: 0 });
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/feed", { replace: true });
  }, [user, navigate]);

  const strengthCheck = (p) => {
    let s = 0;
    if (p.length > 5) s++;
    if (p.length > 9) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    const labels = ["weak", "fair", "good", "strong", "very-strong"];
    return { level: labels[Math.min(s, 4)], score: s * 20 };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) { setError("All fields required"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }

    setLoading(true);
    try {
      const res = await AuthAPI.signup({ name, email, password });
      login(res.data.user, res.data.token);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <h1 className="logo-text">Snapverse</h1>
          <p className="logo-sub">Join the world</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="auth-input"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setStrength(strengthCheck(e.target.value));
            }}
            className="auth-input"
          />
          {password && (
            <div className="strength-bar-container">
              <div
                className={`strength-bar ${strength.level}`}
                style={{ width: `${strength.score}%` }}
              ></div>
              <span className={`strength-label ${strength.level}`}>{strength.level}</span>
            </div>
          )}
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="auth-input"
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <Link to="/" className="auth-switch-btn secondary">
          Already have an account? Log In
        </Link>
      </div>
    </div>
  );
}
