import React from "react";
import { AnalyticsOverview } from "../components/Dashboard/AnalyticsOverview.jsx";
import { NotesBoard } from "../components/Notes/NotesBoard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export const DashboardPage = () => {
  const { user } = useAuth();
  const name = user?.username || user?.email || "";

  return (
    <div className="page-pad grid-2-auto">
      <div>
        <h2 style={{ marginTop: 0, marginBottom: "0.25rem", fontSize: "clamp(18px, 3vw, 24px)" }}>
          {name ? `Hi ${name}, let's do the tasks!` : "Hi there, let's do the tasks!"}
        </h2>
        <p style={{ marginTop: 0, marginBottom: "0.7rem", fontSize: "clamp(12px, 1.5vw, 13px)", color: "var(--muted)" }}>
          Today at a glance
        </p>
        <AnalyticsOverview />
      </div>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "clamp(18px, 3vw, 24px)" }}>Sticky notes</h2>
        <NotesBoard />
      </div>
    </div>
  );
};

