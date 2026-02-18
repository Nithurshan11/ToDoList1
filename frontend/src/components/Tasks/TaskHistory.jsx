import React from "react";

export const TaskHistory = ({ tasks }) => {
  if (!tasks.length) return null;

  return (
    <div style={{ marginTop: "1.25rem" }}>
      <h3 style={{ fontSize: 14, marginBottom: "0.4rem" }}>Recently completed</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.4rem",
          fontSize: 12
        }}
      >
        {tasks.map((t) => (
          <span
            key={t._id}
            style={{
              padding: "0.25rem 0.7rem",
              borderRadius: 999,
              background: "var(--bg-accent)",
              color: "var(--muted)"
            }}
          >
            {t.title}
          </span>
        ))}
      </div>
    </div>
  );
};

