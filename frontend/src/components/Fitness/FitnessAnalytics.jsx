import React, { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { useAuth } from "../../context/AuthContext.jsx";
import { createFitnessService } from "../../services/fitnessService.js";

export const FitnessAnalytics = ({ monthKey }) => {
  const { token } = useAuth();
  const fitnessService = createFitnessService(() => token);
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fitnessService.overview(monthKey);
      setData(res);
    };
    load();
  }, [monthKey]);

  if (!data) {
    return <div style={{ fontSize: 13, color: "var(--muted)" }}>Loading fitness analytics...</div>;
  }

  return (
    <div
      className="chart-container"
      style={{
        display: "grid",
        gap: "0.7rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))"
      }}
    >
      <div className="card">
        <h3 style={{ fontSize: "clamp(12px, 2vw, 13px)", marginTop: 0 }}>Weekly workout frequency</h3>
        <div style={{ overflowX: "auto" }}>
          <BarChart width={Math.min(260, typeof window !== "undefined" ? window.innerWidth - 80 : 260)} height={160} data={data.weeklyFrequency}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4ade80" />
          </BarChart>
        </div>
      </div>
      <div className="card">
        <h3 style={{ fontSize: "clamp(12px, 2vw, 13px)", marginTop: 0 }}>Weight change</h3>
        <div style={{ overflowX: "auto" }}>
          <LineChart width={Math.min(260, typeof window !== "undefined" ? window.innerWidth - 80 : 260)} height={160} data={data.weightTrend}>
            <XAxis dataKey="date" tickFormatter={(d) => new Date(d).getDate()} />
            <YAxis />
            <Tooltip labelFormatter={(d) => new Date(d).toLocaleDateString()} />
            <Line type="monotone" dataKey="weight" stroke="#60a5fa" strokeWidth={2} />
          </LineChart>
        </div>
      </div>
      <div className="card">
        <h3 style={{ fontSize: "clamp(12px, 2vw, 13px)", marginTop: 0 }}>Calories per week</h3>
        <div style={{ overflowX: "auto" }}>
          <BarChart width={Math.min(260, typeof window !== "undefined" ? window.innerWidth - 80 : 260)} height={160} data={data.caloriesPerWeek}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="calories" fill="#f97316" />
          </BarChart>
        </div>
      </div>
      <div className="card">
        <h3 style={{ fontSize: "clamp(12px, 2vw, 13px)", marginTop: 0 }}>Monthly consistency</h3>
        <div style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 700 }}>
          {data.consistency.score}
          <span style={{ fontSize: "clamp(14px, 3vw, 18px)" }}>%</span>
        </div>
        <p style={{ margin: 0, fontSize: "clamp(12px, 2vw, 13px)", color: "var(--muted)" }}>
          {data.consistency.activeDays} / {data.consistency.daysInMonth} days with workouts
        </p>
      </div>
    </div>
  );
};

