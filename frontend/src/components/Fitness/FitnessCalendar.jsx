import React from "react";

const getDaysArray = (year, monthIndex) => {
  const result = [];
  const firstDay = new Date(year, monthIndex, 1);
  const startWeekday = firstDay.getDay(); // 0-6
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  for (let i = 0; i < startWeekday; i += 1) {
    result.push(null);
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    result.push(d);
  }
  return result;
};

export const FitnessCalendar = ({ year, monthIndex, daysSummary, selectedDate, onSelectDate }) => {
  const cells = getDaysArray(year, monthIndex);

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getDate()).padStart(2, "0")}`;

  const buildKey = (d) =>
    `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const selectedKey = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : null;

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: 4,
          fontSize: 11,
          marginBottom: 4,
          color: "var(--muted)"
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} style={{ textAlign: "center" }}>
            {d}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: 4,
          fontSize: 12
        }}
      >
        {cells.map((d, idx) => {
          if (!d) return <div key={idx} />;

          const key = buildKey(d);
          const info = daysSummary.get(key);
          const hasWorkout = info?.summary?.totalWorkoutMinutes > 0;

          const isToday = key === todayKey;
          const isSelected = key === selectedKey;

          let bg = "transparent";
          let border = "1px solid var(--border-subtle)";

          if (hasWorkout) {
            bg = "rgba(34,197,94,0.18)";
            border = "1px solid rgba(34,197,94,0.9)";
          } else if (new Date(key) < today) {
            bg = "rgba(248,113,113,0.08)";
          }

          if (isToday) {
            border = "1px solid rgba(59,130,246,0.9)";
          }
          if (isSelected) {
            bg = "rgba(59,130,246,0.25)";
          }

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(new Date(year, monthIndex, d))}
              className="fitness-calendar-cell"
              style={{
                height: "clamp(28px, 5vw, 34px)",
                borderRadius: 10,
                border,
                background: bg,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "clamp(11px, 2vw, 12px)",
                minHeight: 44
              }}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
};

