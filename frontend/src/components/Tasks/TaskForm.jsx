import React, { useState } from "react";

export const TaskForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !dueDate) return;
    onSubmit({ title, description, dueDate, priority });
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Medium");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="form-grid-5"
      style={{
        marginBottom: "1rem"
      }}
    >
      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{
          padding: "clamp(0.45rem, 1.5vw, 0.55rem) clamp(0.6rem, 2vw, 0.7rem)",
          borderRadius: 999,
          border: "1px solid var(--border-subtle)",
          fontSize: "clamp(13px, 1.5vw, 14px)"
        }}
      />
      <input
        placeholder="Optional description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          padding: "clamp(0.45rem, 1.5vw, 0.55rem) clamp(0.6rem, 2vw, 0.7rem)",
          borderRadius: 999,
          border: "1px solid var(--border-subtle)",
          fontSize: "clamp(13px, 1.5vw, 14px)"
        }}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
        style={{
          padding: "clamp(0.45rem, 1.5vw, 0.55rem) clamp(0.6rem, 2vw, 0.7rem)",
          borderRadius: 999,
          border: "1px solid var(--border-subtle)",
          fontSize: "clamp(13px, 1.5vw, 14px)"
        }}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        style={{
          padding: "clamp(0.45rem, 1.5vw, 0.55rem) clamp(0.6rem, 2vw, 0.7rem)",
          borderRadius: 999,
          border: "1px solid var(--border-subtle)",
          fontSize: "clamp(13px, 1.5vw, 14px)"
        }}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button
        type="submit"
        style={{
          borderRadius: 999,
          border: "none",
          padding: "clamp(0.45rem, 1.5vw, 0.55rem) clamp(0.7rem, 2vw, 0.9rem)",
          background: "linear-gradient(135deg, var(--primary), var(--primary-soft))",
          color: "white",
          cursor: "pointer",
          fontSize: "clamp(12px, 1.5vw, 13px)",
          minHeight: 44
        }}
      >
        Add
      </button>
    </form>
  );
};

