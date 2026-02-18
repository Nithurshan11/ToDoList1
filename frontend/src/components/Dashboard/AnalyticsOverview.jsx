import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";
import { useAuth } from "../../context/AuthContext.jsx";
import { createAnalyticsService } from "../../services/analyticsService.js";

const PRIORITY_COLORS = ["#f97373", "#facc15", "#22c55e"];
const STATUS_COLORS = ["#60a5fa", "#22c55e"];

export const AnalyticsOverview = () => {
  const { token } = useAuth();
  const analyticsService = createAnalyticsService(() => token);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await analyticsService.overview();
      setOverview(data);
    };
    load();
  }, []);

  if (!overview) {
    return <div style={{ fontSize: 14, color: "var(--muted)" }}>Loading analytics...</div>;
  }

  return (
    <div
      className="chart-container"
      style={{
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))"
      }}
    >
      <div className="card">
        <h3 style={{ fontSize: "clamp(13px, 2vw, 14px)", marginTop: 0 }}>Tasks by priority</h3>
        <div style={{ overflowX: "auto" }}>
          <PieChart width={Math.min(260, typeof window !== "undefined" ? window.innerWidth - 80 : 260)} height={180}>
            <Pie
              data={overview.byPriority}
              dataKey="count"
              nameKey="priority"
              innerRadius={40}
              outerRadius={70}
            >
              {overview.byPriority.map((entry, index) => (
                <Cell key={entry.priority} fill={PRIORITY_COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
      <div className="card">
        <h3 style={{ fontSize: "clamp(13px, 2vw, 14px)", marginTop: 0 }}>Completed vs pending</h3>
        <div style={{ overflowX: "auto" }}>
          <BarChart width={Math.min(260, typeof window !== "undefined" ? window.innerWidth - 80 : 260)} height={180} data={overview.byStatus}>
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count">
              {overview.byStatus.map((entry, index) => (
                <Cell key={entry.status} fill={STATUS_COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>
      <div className="card">
        <h3 style={{ fontSize: "clamp(13px, 2vw, 14px)", marginTop: 0 }}>Tasks completed per week</h3>
        <div style={{ overflowX: "auto" }}>
          <LineChart width={Math.min(320, typeof window !== "undefined" ? window.innerWidth - 80 : 320)} height={180} data={overview.weeklyCompleted}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#60a5fa" strokeWidth={2} />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

