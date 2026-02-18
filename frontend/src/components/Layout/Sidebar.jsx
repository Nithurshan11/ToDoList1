import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const linkBase = {
  padding: "0.6rem 1rem",
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  fontSize: 14,
  minHeight: 44
};

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/tasks", label: "Tasks" },
    { to: "/notes", label: "Notes" },
    { to: "/fitness", label: "Fitness Tracker" }
  ];

  const handleLinkClick = (to) => {
    navigate(to);
    onClose?.();
  };

  return (
    <>
      <aside
        className="sidebar-desktop"
        style={{
          padding: "1.3rem 1.1rem",
          borderRight: "1px solid var(--border-subtle)",
          background: "linear-gradient(180deg, var(--bg-elevated), var(--bg))"
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              style={({ isActive }) => ({
                ...linkBase,
                background: isActive ? "var(--primary-soft)" : "transparent",
                color: isActive ? "white" : "var(--muted)"
              })}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "var(--primary)"
                }}
              />
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <aside
        className={`sidebar-mobile ${isOpen ? "open" : ""}`}
        style={{
          padding: "1.3rem 1.1rem",
          borderRight: "1px solid var(--border-subtle)",
          background: "linear-gradient(180deg, var(--bg-elevated), var(--bg))"
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {links.map((l) => (
            <button
              key={l.to}
              type="button"
              onClick={() => handleLinkClick(l.to)}
              style={{
                ...linkBase,
                background: "transparent",
                color: "var(--muted)",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                width: "100%"
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "var(--primary)"
                }}
              />
              {l.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

