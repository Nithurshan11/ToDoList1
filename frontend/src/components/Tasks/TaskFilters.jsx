import React from "react";

export const TaskFilters = ({ filters, onChange }) => {
  const update = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <div
      className="form-grid-4"
      style={{
        marginBottom: "0.75rem",
        fontSize: "clamp(12px, 1.5vw, 13px)"
      }}
    >
      <input
        placeholder="Search"
        value={filters.search || ""}
        onChange={(e) => update("search", e.target.value)}
        style={{
          padding: "clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.6rem, 2vw, 0.7rem)",
          borderRadius: 999,
          border: "1px solid var(--border-subtle)",
          fontSize: "clamp(12px, 1.5vw, 13px)"
        }}
      />
      <select
        value={filters.priority || ""}
        onChange={(e) => update("priority", e.target.value || undefined)}
        style={{
          padding: "clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.6rem, 2vw, 0.7rem)",
          borderRadius: 999,
          border: "1px solid var(--border-subtle)",
          fontSize: "clamp(12px, 1.5vw, 13px)"
        }}
      >
        <option value="">All priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <select
        value={filters.status || ""}
        onChange={(e) => update("status", e.target.value || undefined)}
        style={{
          padding: "clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.6rem, 2vw, 0.7rem)",
          borderRadius: 999,
          border: "1px solid var(--border-subtle)",
          fontSize: "clamp(12px, 1.5vw, 13px)"
        }}
      >
        <option value="">All statuses</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>
      <input
        type="date"
        value={filters.date || ""}
        onChange={(e) => update("date", e.target.value)}
        style={{
          padding: "clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.6rem, 2vw, 0.7rem)",
          borderRadius: 999,
          border: "1px solid var(--border-subtle)",
          fontSize: "clamp(12px, 1.5vw, 13px)"
        }}
      />
    </div>
  );
};

