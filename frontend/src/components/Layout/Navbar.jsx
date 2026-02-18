import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export const Navbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "clamp(0.6rem, 2vw, 0.9rem) clamp(1rem, 3vw, 1.5rem)",
        background: "var(--bg-elevated)",
        boxShadow: "var(--shadow-soft)",
        borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
        position: "sticky",
        top: 0,
        zIndex: 20
      }}
    >
      <div className="navbar-content" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle menu"
          style={{
            display: "none",
            borderRadius: 8,
            border: "1px solid var(--border-subtle)",
            padding: "0.4rem",
            background: "var(--bg)",
            cursor: "pointer",
            minWidth: 44,
            minHeight: 44,
            alignItems: "center",
            justifyContent: "center"
          }}
          className="hamburger-btn"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 5h14M3 10h14M3 15h14" />
          </svg>
        </button>
        <span
          style={{
            width: "clamp(28px, 4vw, 32px)",
            height: "clamp(28px, 4vw, 32px)",
            borderRadius: 999,
            background:
              "radial-gradient(circle at 30% 0, #fde68a 0, #f97316 40%, #4f46e5 100%)",
            boxShadow: "0 0 20px rgba(250, 204, 21, 0.5)"
          }}
        />
        <div>
          <div className="navbar-title" style={{ fontWeight: 700, fontSize: "clamp(14px, 2vw, 16px)" }}>
            KG_tasks
          </div>
          <div className="navbar-subtitle" style={{ fontSize: "clamp(10px, 1.5vw, 12px)", color: "var(--muted)" }}>
            Plan · Focus · Finish
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(0.5rem, 2vw, 1rem)", flexWrap: "wrap" }}>
        <div style={{ fontVariantNumeric: "tabular-nums", fontSize: "clamp(12px, 1.5vw, 14px)" }}>
          {now.toLocaleTimeString()}
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            borderRadius: 999,
            border: "1px solid var(--border-subtle)",
            padding: "clamp(0.25rem, 1vw, 0.3rem) clamp(0.6rem, 2vw, 0.9rem)",
            background: "var(--bg)",
            cursor: "pointer",
            minHeight: 44,
            fontSize: "clamp(12px, 1.5vw, 14px)"
          }}
        >
          {theme === "light" ? "Dark" : "Light"}
        </button>
        {user && (
          <button
            type="button"
            onClick={logout}
            style={{
              borderRadius: 999,
              border: "none",
              padding: "clamp(0.3rem, 1vw, 0.4rem) clamp(0.7rem, 2vw, 0.9rem)",
              background:
                "linear-gradient(135deg, var(--primary), var(--primary-soft))",
              color: "white",
              cursor: "pointer",
              minHeight: 44,
              fontSize: "clamp(12px, 1.5vw, 14px)"
            }}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

