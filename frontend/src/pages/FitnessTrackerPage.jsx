import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { createFitnessService } from "../services/firestoreFitnessService.js";
import { FitnessCalendar } from "../components/Fitness/FitnessCalendar.jsx";
import { FitnessDayForm } from "../components/Fitness/FitnessDayForm.jsx";
import { FitnessNotes } from "../components/Fitness/FitnessNotes.jsx";
import { FitnessAnalytics } from "../components/Fitness/FitnessAnalytics.jsx";

export const FitnessTrackerPage = () => {
  const { user } = useAuth();
  const fitnessService = createFitnessService(() => user?._id ?? user?.id);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [days, setDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);

  const monthKey = useMemo(
    () => `${year}-${String(monthIndex + 1).padStart(2, "0")}`,
    [year, monthIndex]
  );

  const daysMap = useMemo(() => {
    const map = new Map();
    days.forEach((d) => map.set(d.date, d));
    return map;
  }, [days]);

  const selectedDayData = useMemo(() => {
    if (!selectedDate) return null;
    const key = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(selectedDate.getDate()).padStart(2, "0")}`;
    return daysMap.get(key) || null;
  }, [selectedDate, daysMap]);

  const loadMonth = async (y, m) => {
    const mk = `${y}-${String(m + 1).padStart(2, "0")}`;
    const list = await fitnessService.getDays(mk);
    setDays(list);
  };

  useEffect(() => {
    loadMonth(year, monthIndex);
  }, [year, monthIndex]);

  const handleMonthChange = (value) => {
    if (!value) return;
    const [y, m] = value.split("-").map((v) => Number(v));
    if (y && m) {
      setYear(y);
      setMonthIndex(m - 1);
    }
  };

  const handleSaveDay = async (formValues) => {
    if (!selectedDate) return;
    const payload = {
      date: selectedDate.toISOString(),
      ...Object.fromEntries(
        Object.entries(formValues).map(([k, v]) => [k, v === "" ? undefined : Number.isNaN(+v) ? v : Number(v)])
      )
    };
    await fitnessService.saveDay(payload);
    await loadMonth(year, monthIndex);
  };

  const handleNotesChange = async (html) => {
    if (!selectedDate) return;
    const entry = selectedDayData?.entries[0];
    const payload = {
      date: selectedDate.toISOString(),
      workoutType: entry?.workoutType,
      durationMinutes: entry?.durationMinutes,
      caloriesBurned: entry?.caloriesBurned,
      waterIntakeMl: entry?.waterIntakeMl,
      bodyWeightKg: entry?.bodyWeightKg,
      mood: entry?.mood,
      sleepHours: entry?.sleepHours,
      notes: html
    };
    await fitnessService.saveDay(payload);
    await loadMonth(year, monthIndex);
  };

  return (
    <div className="page-pad grid-2-fitness">
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "0.7rem",
            flexWrap: "wrap"
          }}
        >
          <h2 style={{ margin: 0, fontSize: "clamp(18px, 3vw, 24px)" }}>Fitness Tracker</h2>
          <input
            type="month"
            value={monthKey}
            onChange={(e) => handleMonthChange(e.target.value)}
            style={{
              marginLeft: "auto",
              padding: "clamp(0.3rem, 1vw, 0.4rem) clamp(0.5rem, 1.5vw, 0.6rem)",
              borderRadius: 999,
              border: "1px solid var(--border-subtle)",
              minHeight: 44,
              fontSize: "clamp(13px, 1.5vw, 14px)"
            }}
          />
        </div>
        <div className="card">
          <FitnessCalendar
            year={year}
            monthIndex={monthIndex}
            daysSummary={daysMap}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>
      </div>
      <div style={{ display: "grid", gap: "0.7rem", gridTemplateRows: "min-content minmax(0, 1fr)" }}>
        <div className="card">
          <FitnessDayForm date={selectedDate} dayData={selectedDayData} onSave={handleSaveDay} />
        </div>
        <div className="grid-2" style={{ gap: "0.7rem" }}>
          <div className="card">
            <FitnessNotes
              initialText={selectedDayData?.entries[0]?.notes || ""}
              onChange={handleNotesChange}
            />
          </div>
          <div style={{ background: "transparent" }}>
            <FitnessAnalytics monthKey={monthKey} />
          </div>
        </div>
      </div>
    </div>
  );
};

