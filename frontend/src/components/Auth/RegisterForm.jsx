import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

export const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(username, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container" style={{ maxWidth: "min(420px, 90vw)", margin: "clamp(1.5rem, 5vw, 3rem) auto", padding: "clamp(1.5rem, 4vw, 2rem)", background: "var(--bg-elevated)", borderRadius: 24, boxShadow: "var(--shadow-soft)" }}>
      <h2 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "clamp(20px, 4vw, 24px)" }}>Welcome to KG_tasks</h2>
      <p style={{ marginTop: 0, marginBottom: "1.5rem", color: "var(--muted)", fontSize: "clamp(13px, 2vw, 14px)" }}>
        Create your account for school, university, or work – all in one place.
      </p>
      {error && (
        <div style={{ marginBottom: "1rem", color: "var(--danger)", fontSize: "clamp(13px, 2vw, 14px)" }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
        <div>
          <label style={{ fontSize: "clamp(12px, 1.5vw, 13px)", display: "block", marginBottom: 4 }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "clamp(0.55rem, 2vw, 0.65rem) clamp(0.7rem, 2vw, 0.75rem)", borderRadius: 999, border: "1px solid var(--border-subtle)", fontSize: "clamp(14px, 2vw, 16px)", minHeight: 44 }}
          />
        </div>
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
            minLength={6}
            style={{ width: "100%", padding: "clamp(0.55rem, 2vw, 0.65rem) clamp(0.7rem, 2vw, 0.75rem)", borderRadius: 999, border: "1px solid var(--border-subtle)", fontSize: "clamp(14px, 2vw, 16px)", minHeight: 44 }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: "0.5rem", borderRadius: 999, border: "none", padding: "clamp(0.6rem, 2vw, 0.7rem) clamp(1rem, 3vw, 1.2rem)", background: "linear-gradient(135deg, var(--primary), var(--primary-soft))", color: "white", cursor: "pointer", fontSize: "clamp(14px, 2vw, 16px)", minHeight: 44, fontWeight: 600 }}
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <p style={{ marginTop: "1rem", fontSize: "clamp(12px, 1.5vw, 13px)", textAlign: "center" }}>
        Already have an account? <Link to="/login" style={{ color: "var(--primary)", textDecoration: "underline" }}>Log in</Link>
      </p>
    </div>
  );
};

