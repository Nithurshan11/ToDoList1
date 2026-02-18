import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { createAnalyticsService } from "../services/analyticsService.js";

export const AnalyticsPage = () => {
  const { token } = useAuth();
  const analyticsService = createAnalyticsService(() => token);
  const [calendar, setCalendar] = useState({ byDate: [] });
  const [month, setMonth] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await analyticsService.byDate(month || undefined);
      setCalendar(data);
    };
    load();
  }, [month]);

  return (
    <div className="page-pad">
      <h2 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "clamp(20px, 4vw, 24px)" }}>Calendar view</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.8rem", flexWrap: "wrap" }}>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{
            padding: "clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.6rem, 2vw, 0.7rem)",
            borderRadius: 999,
            border: "1px solid var(--border-subtle)",
            fontSize: "clamp(13px, 1.5vw, 14px)",
            minHeight: 44
          }}
        />
        <span style={{ fontSize: "clamp(12px, 1.5vw, 13px)", color: "var(--muted)" }}>
          Highlighted days show how many tasks are due.
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {calendar.byDate.map((d) => (
          <span
            key={d.date}
            style={{
              minWidth: "clamp(70px, 15vw, 80px)",
              padding: "clamp(0.3rem, 1vw, 0.35rem) clamp(0.5rem, 1.5vw, 0.6rem)",
              borderRadius: 999,
              border: "1px solid var(--border-subtle)",
              background: d.count ? "var(--bg-accent)" : "transparent",
              fontSize: "clamp(11px, 1.5vw, 12px)"
            }}
          >
            {d.date} · {d.count}
          </span>
        ))}
      </div>
    </div>
  );
};

