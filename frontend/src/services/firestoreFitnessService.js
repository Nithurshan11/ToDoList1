import { db } from "../config/firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp
} from "firebase/firestore";

const COLLECTION = "fitnessEntries";

export const createFitnessService = (getUserId) => {
  return {
    async getDays(month) {
      const userId = getUserId?.();
      if (!userId) return [];
      
      // Parse month string (format: "YYYY-MM")
      const [year, monthNum] = month.split("-").map(Number);
      const start = new Date(year, monthNum - 1, 1);
      const end = new Date(year, monthNum, 0, 23, 59, 59, 999);
      
      // Firestore requires a composite index for multiple range queries
      // We'll query all user entries and filter in memory for now
      const q = query(
        collection(db, COLLECTION),
        where("userId", "==", userId)
      );
      
      const snap = await getDocs(q);
      const startTimestamp = Timestamp.fromDate(start);
      const endTimestamp = Timestamp.fromDate(end);
      
      return snap.docs
        .map((d) => {
          const data = d.data();
          const date = data.date?.toDate?.();
          const dateTimestamp = data.date instanceof Timestamp ? data.date : Timestamp.fromDate(date);
          
          return {
            id: d.id,
            _id: d.id,
            date: date ? date.toISOString().slice(0, 10) : data.date,
            dateTimestamp,
            entries: [{
              ...data,
              date: date ? date.toISOString().slice(0, 10) : data.date,
              createdAt: data.createdAt?.toDate?.() ?? data.createdAt,
              updatedAt: data.updatedAt?.toDate?.() ?? data.updatedAt
            }]
          };
        })
        .filter((d) => {
          if (!d.dateTimestamp) return false;
          return d.dateTimestamp >= startTimestamp && d.dateTimestamp <= endTimestamp;
        })
        .map(({ dateTimestamp, ...rest }) => rest);
    },

    async saveDay(payload) {
      const userId = getUserId?.();
      if (!userId) throw new Error("Not authenticated");
      
      const date = payload.date instanceof Date 
        ? payload.date 
        : new Date(payload.date);
      
      // Check if entry exists for this date
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const existingDays = await this.getDays(monthKey);
      const dateStr = date.toISOString().slice(0, 10);
      const existing = existingDays.find(
        (e) => e.date === dateStr || (e.date && e.date.slice(0, 10) === dateStr)
      );
      
      const data = {
        userId,
        date: Timestamp.fromDate(date),
        workoutType: payload.workoutType ?? "",
        durationMinutes: payload.durationMinutes ?? 0,
        caloriesBurned: payload.caloriesBurned ?? 0,
        waterIntakeMl: payload.waterIntakeMl ?? 0,
        bodyWeightKg: payload.bodyWeightKg ?? null,
        mood: payload.mood ?? "",
        sleepHours: payload.sleepHours ?? null,
        notes: payload.notes ?? "",
        updatedAt: Timestamp.now()
      };
      
      if (existing?.id) {
        // Update existing entry
        await updateDoc(doc(db, COLLECTION, existing.id), data);
        return {
          _id: existing.id,
          id: existing.id,
          ...payload
        };
      } else {
        // Create new entry
        const docRef = await addDoc(collection(db, COLLECTION), {
          ...data,
          createdAt: Timestamp.now()
        });
        return {
          _id: docRef.id,
          id: docRef.id,
          ...payload
        };
      }
    },

    async deleteEntry(id) {
      await deleteDoc(doc(db, COLLECTION, id));
    },

    async overview(month) {
      const days = await this.getDays(month);
      const [year, monthNum] = month.split("-").map(Number);
      const daysInMonth = new Date(year, monthNum, 0).getDate();
      
      // Group by week for weeklyFrequency and caloriesPerWeek
      const weeklyData = new Map();
      const weightTrend = [];
      let activeDays = 0;
      
      days.forEach((d) => {
        const entry = d.entries?.[0] || {};
        const date = new Date(d.date);
        const weekYear = this.getISOWeekYear(date);
        const week = this.getISOWeek(date);
        const weekKey = `${weekYear}-W${week}`;
        
        // Weekly frequency (count days with workouts)
        if (entry.durationMinutes > 0) {
          if (!weeklyData.has(weekKey)) {
            weeklyData.set(weekKey, { activeDays: 0, calories: 0 });
          }
          weeklyData.get(weekKey).activeDays++;
          activeDays++;
        }
        
        // Calories per week
        if (entry.caloriesBurned > 0) {
          if (!weeklyData.has(weekKey)) {
            weeklyData.set(weekKey, { activeDays: 0, calories: 0 });
          }
          weeklyData.get(weekKey).calories += entry.caloriesBurned ?? 0;
        }
        
        // Weight trend
        if (typeof entry.bodyWeightKg === "number") {
          weightTrend.push({
            date: date,
            weight: entry.bodyWeightKg
          });
        }
      });
      
      // Convert weekly data to arrays
      const weeklyFrequency = Array.from(weeklyData.entries())
        .map(([key, data]) => {
          const [y, w] = key.split("-W");
          return { year: parseInt(y), week: parseInt(w), ...data };
        })
        .sort((a, b) => a.year - b.year || a.week - b.week)
        .map((w) => ({
          label: `W${w.week}`,
          count: w.activeDays
        }));
      
      const caloriesPerWeek = Array.from(weeklyData.entries())
        .map(([key, data]) => {
          const [y, w] = key.split("-W");
          return { year: parseInt(y), week: parseInt(w), ...data };
        })
        .sort((a, b) => a.year - b.year || a.week - b.week)
        .map((w) => ({
          label: `W${w.week}`,
          calories: w.calories
        }));
      
      // Sort weight trend by date
      weightTrend.sort((a, b) => a.date - b.date);
      
      // Calculate consistency score
      const consistencyScore = daysInMonth ? Math.round((activeDays / daysInMonth) * 100) : 0;
      
      return {
        weeklyFrequency,
        caloriesPerWeek,
        weightTrend,
        consistency: {
          score: consistencyScore,
          activeDays,
          daysInMonth
        }
      };
    },
    
    // Helper functions for ISO week calculation
    getISOWeekYear(date) {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil((((d - yearStart) / 86400000) + 1) / 7) === 53 
        ? d.getUTCFullYear() + 1 
        : d.getUTCFullYear();
    },
    
    getISOWeek(date) {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }
  };
};
