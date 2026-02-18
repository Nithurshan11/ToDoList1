import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await axios.get("/api/auth/stats");
        setUserCount(data.userCount);
      } catch {
        setUserCount(null);
      }
    };
    loadStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container" style={{ maxWidth: "min(420px, 90vw)", margin: "clamp(1.5rem, 5vw, 3rem) auto", padding: "clamp(1.5rem, 4vw, 2rem)", background: "var(--bg-elevated)", borderRadius: 24, boxShadow: "var(--shadow-soft)" }}>
      <h2 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "clamp(20px, 4vw, 24px)" }}>Welcome to KG_tasks</h2>
      <p style={{ marginTop: 0, marginBottom: "1.5rem", color: "var(--muted)", fontSize: "clamp(13px, 2vw, 14px)" }}>
        Sign in to see your tasks, notes, fitness, and analytics.
      </p>
      {userCount !== null && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.7rem",
            marginBottom: "0.9rem",
            padding: "0.5rem 0.7rem",
            borderRadius: 999,
            background: "var(--bg-accent)",
            flexWrap: "wrap"
          }}
        >
          <div
            style={{
              width: "clamp(34px, 5vw, 38px)",
              height: "clamp(34px, 5vw, 38px)",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #4f46e5, #22c55e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "clamp(16px, 3vw, 18px)",
              flexShrink: 0
            }}
          >
            👤
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "clamp(10px, 1.5vw, 11px)", letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)" }}>
              TOTAL USERS
            </div>
            <div style={{ fontSize: "clamp(18px, 4vw, 22px)", fontWeight: 700 }}>
              {new Intl.NumberFormat().format(userCount)}
            </div>
            <div style={{ fontSize: "clamp(10px, 1.5vw, 11px)", color: "var(--muted)" }}>Active community members</div>
          </div>
        </div>
      )}
      {error && (
        <div style={{ marginBottom: "1rem", color: "var(--danger)", fontSize: "clamp(13px, 2vw, 14px)" }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
        <div>
          <label style={{ fontSize: "clamp(12px, 1.5vw, 13px)", display: "block", marginBottom: 4 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "clamp(0.55rem, 2vw, 0.65rem) clamp(0.7rem, 2vw, 0.75rem)", borderRadius: 999, border: "1px solid var(--border-subtle)", fontSize: "clamp(14px, 2vw, 16px)", minHeight: 44 }}
          />
        </div>
        <div>
          <label style={{ fontSize: "clamp(12px, 1.5vw, 13px)", display: "block", marginBottom: 4 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "clamp(0.55rem, 2vw, 0.65rem) clamp(0.7rem, 2vw, 0.75rem)", borderRadius: 999, border: "1px solid var(--border-subtle)", fontSize: "clamp(14px, 2vw, 16px)", minHeight: 44 }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: "0.5rem", borderRadius: 999, border: "none", padding: "clamp(0.6rem, 2vw, 0.7rem) clamp(1rem, 3vw, 1.2rem)", background: "linear-gradient(135deg, var(--primary), var(--primary-soft))", color: "white", cursor: "pointer", fontSize: "clamp(14px, 2vw, 16px)", minHeight: 44, fontWeight: 600 }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p style={{ marginTop: "1rem", fontSize: "clamp(12px, 1.5vw, 13px)", textAlign: "center" }}>
        New here? <Link to="/register" style={{ color: "var(--primary)", textDecoration: "underline" }}>Create an account</Link>
      </p>
    </div>
  );
};

