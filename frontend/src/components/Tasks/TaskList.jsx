import React from "react";

const priorityColor = (p) => {
  if (p === "High") return "#f97373";
  if (p === "Low") return "#22c55e";
  return "#facc15";
};

export const TaskList = ({ tasks, onToggleStatus, onDelete }) => {
  if (!tasks.length) {
    return <div style={{ fontSize: 14, color: "var(--muted)" }}>No tasks yet.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {tasks.map((t) => (
        <div
          key={t._id}
          className="task-item-grid card"
          style={{
            padding: "clamp(0.5rem, 2vw, 0.6rem) clamp(0.7rem, 2vw, 0.8rem)"
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: "clamp(14px, 2vw, 16px)" }}>{t.title}</div>
            <div style={{ fontSize: "clamp(11px, 1.5vw, 12px)", color: "var(--muted)", marginTop: 2 }}>
              {t.description}
            </div>
          </div>
          <div style={{ fontSize: "clamp(11px, 1.5vw, 12px)" }}>
            <div>Due: {new Date(t.dueDate).toLocaleDateString()}</div>
            <div style={{ marginTop: 4, display: "flex", flexWrap: "wrap", gap: 4 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "0.15rem 0.6rem",
                  borderRadius: 999,
                  background: priorityColor(t.priority),
                  color: "#020617",
                  fontSize: "clamp(10px, 1.5vw, 11px)"
                }}
              >
                {t.priority}
              </span>
              <span
                style={{
                  display: "inline-block",
                  padding: "0.15rem 0.6rem",
                  borderRadius: 999,
                  background: t.status === "Completed" ? "var(--success)" : "var(--bg-accent)",
                  color: t.status === "Completed" ? "#022c22" : "var(--muted)",
                  fontSize: "clamp(10px, 1.5vw, 11px)"
                }}
              >
                {t.status}
              </span>
            </div>
          </div>
          <div style={{ fontSize: "clamp(11px, 1.5vw, 12px)", color: "var(--muted)" }}>
            Created {new Date(t.createdAt).toLocaleDateString()}
          </div>
          <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() =>
                onToggleStatus(t._id, t.status === "Completed" ? "Pending" : "Completed")
              }
              style={{
                borderRadius: 999,
                border: "none",
                padding: "clamp(0.3rem, 1vw, 0.4rem) clamp(0.6rem, 2vw, 0.8rem)",
                background: "var(--bg-accent)",
                cursor: "pointer",
                fontSize: "clamp(11px, 1.5vw, 12px)",
                minHeight: 44,
                whiteSpace: "nowrap"
              }}
            >
              {t.status === "Completed" ? "Pending" : "Complete"}
            </button>
            <button
              type="button"
              onClick={() => onDelete(t._id)}
              style={{
                borderRadius: 999,
                border: "none",
                padding: "clamp(0.3rem, 1vw, 0.4rem) clamp(0.6rem, 2vw, 0.8rem)",
                background: "var(--danger)",
                color: "white",
                cursor: "pointer",
                fontSize: "clamp(11px, 1.5vw, 12px)",
                minHeight: 44,
                whiteSpace: "nowrap"
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

