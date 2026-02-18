import React, { useEffect, useState } from "react";

const initialState = {
  workoutType: "",
  durationMinutes: "",
  caloriesBurned: "",
  waterIntakeMl: "",
  bodyWeightKg: "",
  mood: "",
  sleepHours: ""
};

export const FitnessDayForm = ({ date, dayData, onSave }) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (dayData) {
      const entry = dayData.entries[0] || {};
      setForm({
        workoutType: entry.workoutType || "",
        durationMinutes: entry.durationMinutes ?? "",
        caloriesBurned: entry.caloriesBurned ?? "",
        waterIntakeMl: entry.waterIntakeMl ?? "",
        bodyWeightKg: entry.bodyWeightKg ?? "",
        mood: entry.mood || "",
        sleepHours: entry.sleepHours ?? ""
      });
    } else {
      setForm(initialState);
    }
  }, [dayData]);

  if (!date) return null;

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.5rem", fontSize: "clamp(12px, 1.5vw, 13px)" }}>
      <div style={{ fontWeight: 600, marginBottom: "0.15rem", fontSize: "clamp(13px, 2vw, 14px)" }}>
        {date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
      </div>
      <div className="grid-2" style={{ gap: "0.4rem" }}>
        <div>
          <label style={{ fontSize: "clamp(11px, 1.5vw, 12px)", display: "block", marginBottom: 2 }}>Workout type</label>
          <input
            value={form.workoutType}
            onChange={(e) => handleChange("workoutType", e.target.value)}
            placeholder="Gym, run, yoga..."
            style={{
              width: "100%",
              padding: "clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.5rem, 2vw, 0.6rem)",
              borderRadius: 999,
              border: "1px solid var(--border-subtle)",
              fontSize: "clamp(13px, 1.5vw, 14px)"
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: "clamp(11px, 1.5vw, 12px)", display: "block", marginBottom: 2 }}>Duration (min)</label>
          <input
            type="number"
            value={form.durationMinutes}
            onChange={(e) => handleChange("durationMinutes", e.target.value)}
            style={{
              width: "100%",
              padding: "clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.5rem, 2vw, 0.6rem)",
              borderRadius: 999,
              border: "1px solid var(--border-subtle)",
              fontSize: "clamp(13px, 1.5vw, 14px)"
            }}
          />
        </div>
      </div>
      <div className="grid-2" style={{ gap: "0.4rem", gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div>
          <label style={{ fontSize: "clamp(11px, 1.5vw, 12px)", display: "block", marginBottom: 2 }}>Calories burned</label>
          <input
            type="number"
            value={form.caloriesBurned}
            onChange={(e) => handleChange("caloriesBurned", e.target.value)}
            style={{
              width: "100%",
              padding: "clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.5rem, 2vw, 0.6rem)",
              borderRadius: 999,
              border: "1px solid var(--border-subtle)",
              fontSize: "clamp(13px, 1.5vw, 14px)"
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: "clamp(11px, 1.5vw, 12px)", display: "block", marginBottom: 2 }}>Water (ml)</label>
          <input
            type="number"
            value={form.waterIntakeMl}
            onChange={(e) => handleChange("waterIntakeMl", e.target.value)}
            style={{
              width: "100%",
              padding: "clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.5rem, 2vw, 0.6rem)",
              borderRadius: 999,
              border: "1px solid var(--border-subtle)",
              fontSize: "clamp(13px, 1.5vw, 14px)"
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: "clamp(11px, 1.5vw, 12px)", display: "block", marginBottom: 2 }}>Weight (kg)</label>
          <input
            type="number"
            value={form.bodyWeightKg}
            onChange={(e) => handleChange("bodyWeightKg", e.target.value)}
            style={{
              width: "100%",
              padding: "clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.5rem, 2vw, 0.6rem)",
              borderRadius: 999,
              border: "1px solid var(--border-subtle)",
              fontSize: "clamp(13px, 1.5vw, 14px)"
            }}
          />
        </div>
      </div>
      <div className="grid-2" style={{ gap: "0.4rem" }}>
        <div>
          <label style={{ fontSize: "clamp(11px, 1.5vw, 12px)", display: "block", marginBottom: 2 }}>Mood</label>
          <select
            value={form.mood}
            onChange={(e) => handleChange("mood", e.target.value)}
            style={{
              width: "100%",
              padding: "clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.5rem, 2vw, 0.6rem)",
              borderRadius: 999,
              border: "1px solid var(--border-subtle)",
              fontSize: "clamp(13px, 1.5vw, 14px)"
            }}
          >
            <option value="">Select mood</option>
            <option value="low">Low</option>
            <option value="ok">Okay</option>
            <option value="great">Great</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: "clamp(11px, 1.5vw, 12px)", display: "block", marginBottom: 2 }}>Sleep (hours)</label>
          <input
            type="number"
            value={form.sleepHours}
            onChange={(e) => handleChange("sleepHours", e.target.value)}
            style={{
              width: "100%",
              padding: "clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.5rem, 2vw, 0.6rem)",
              borderRadius: 999,
              border: "1px solid var(--border-subtle)",
              fontSize: "clamp(13px, 1.5vw, 14px)"
            }}
          />
        </div>
      </div>
      <button
        type="submit"
        style={{
          marginTop: "0.4rem",
          borderRadius: 999,
          border: "none",
          padding: "clamp(0.45rem, 1.5vw, 0.55rem) clamp(0.7rem, 2vw, 0.9rem)",
          background: "linear-gradient(135deg, var(--primary), var(--primary-soft))",
          color: "white",
          cursor: "pointer",
          alignSelf: "flex-start",
          fontSize: "clamp(12px, 1.5vw, 13px)",
          minHeight: 44
        }}
      >
        Save day
      </button>
    </form>
  );
};

