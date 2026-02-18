import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { FitnessEntry } from "../models/FitnessEntry.js";

const objectId = mongoose.Types.ObjectId;

const handleValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.details = errors.array();
    throw error;
  }
};

const normalizeDate = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

export const getDaysForMonth = async (req, res, next) => {
  try {
    const { month } = req.query; // YYYY-MM
    const now = new Date();

    let year = now.getFullYear();
    let m = now.getMonth(); // 0-based

    if (month) {
      const [y, mm] = month.split("-").map((v) => Number(v));
      if (!y || !mm) {
        return res.status(400).json({ message: "month must be in format YYYY-MM" });
      }
      year = y;
      m = mm - 1;
    }

    const from = new Date(year, m, 1);
    const to = new Date(year, m + 1, 1);

    const entries = await FitnessEntry.find({
      userId: new objectId(req.user.id),
      date: { $gte: from, $lt: to }
    }).sort({ date: 1 });

    const byDateMap = new Map();
    for (const e of entries) {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
      const list = byDateMap.get(key) || [];
      list.push(e);
      byDateMap.set(key, list);
    }

    const days = [];
    byDateMap.forEach((list, key) => {
      let totalWorkoutMinutes = 0;
      let totalCalories = 0;
      let waterIntakeMl = 0;
      let sleepSum = 0;
      let sleepCount = 0;
      let lastWeight;

      list.forEach((e) => {
        totalWorkoutMinutes += e.durationMinutes || 0;
        totalCalories += e.caloriesBurned || 0;
        waterIntakeMl += e.waterIntakeMl || 0;
        if (typeof e.sleepHours === "number") {
          sleepSum += e.sleepHours;
          sleepCount += 1;
        }
        if (typeof e.bodyWeightKg === "number") {
          lastWeight = e.bodyWeightKg;
        }
      });

      days.push({
        date: key,
        entries: list,
        summary: {
          totalWorkoutMinutes,
          totalCalories,
          waterIntakeMl,
          averageSleep: sleepCount ? sleepSum / sleepCount : null,
          lastWeight
        }
      });
    });

    res.json({ days });
  } catch (err) {
    next(err);
  }
};

export const upsertDay = async (req, res, next) => {
  try {
    handleValidation(req);
    const {
      date,
      workoutType,
      durationMinutes,
      caloriesBurned,
      waterIntakeMl,
      bodyWeightKg,
      mood,
      sleepHours,
      notes
    } = req.body;

    const normalized = normalizeDate(date);

    const entry = await FitnessEntry.findOneAndUpdate(
      { userId: req.user.id, date: normalized },
      {
        $set: {
          date: normalized,
          workoutType,
          durationMinutes,
          caloriesBurned,
          waterIntakeMl,
          bodyWeightKg,
          mood,
          sleepHours,
          notes
        }
      },
      { new: true, upsert: true }
    );

    res.json({ entry });
  } catch (err) {
    next(err);
  }
};

export const deleteEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid fitness entry id" });
    }

    const deleted = await FitnessEntry.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ message: "Entry deleted" });
  } catch (err) {
    next(err);
  }
};

export const getOverview = async (req, res, next) => {
  try {
    const { month } = req.query;
    const now = new Date();
    let year = now.getFullYear();
    let m = now.getMonth();

    if (month) {
      const [y, mm] = month.split("-").map((v) => Number(v));
      if (!y || !mm) {
        return res.status(400).json({ message: "month must be in format YYYY-MM" });
      }
      year = y;
      m = mm - 1;
    }

    const from = new Date(year, m, 1);
    const to = new Date(year, m + 1, 1);

    const userId = new objectId(req.user.id);

    const pipeline = [
      {
        $match: {
          userId,
          date: { $gte: from, $lt: to }
        }
      },
      {
        $facet: {
          weeklyFrequency: [
            {
              $group: {
                _id: {
                  year: { $isoWeekYear: "$date" },
                  week: { $isoWeek: "$date" }
                },
                activeDays: {
                  $sum: {
                    $cond: [{ $gt: ["$durationMinutes", 0] }, 1, 0]
                  }
                }
              }
            },
            { $sort: { "_id.year": 1, "_id.week": 1 } }
          ],
          caloriesPerWeek: [
            {
              $group: {
                _id: {
                  year: { $isoWeekYear: "$date" },
                  week: { $isoWeek: "$date" }
                },
                calories: { $sum: "$caloriesBurned" }
              }
            },
            { $sort: { "_id.year": 1, "_id.week": 1 } }
          ],
          weightTrend: [
            {
              $sort: { date: 1 }
            },
            {
              $project: {
                date: 1,
                bodyWeightKg: 1
              }
            }
          ],
          consistency: [
            {
              $group: {
                _id: {
                  year: { $year: "$date" },
                  month: { $month: "$date" },
                  day: { $dayOfMonth: "$date" }
                },
                hasWorkout: {
                  $max: {
                    $cond: [{ $gt: ["$durationMinutes", 0] }, 1, 0]
                  }
                }
              }
            }
          ]
        }
      }
    ];

    const [result] = await FitnessEntry.aggregate(pipeline);

    const weeklyFrequency = result.weeklyFrequency.map((w) => ({
      label: `W${w._id.week}`,
      count: w.activeDays
    }));

    const caloriesPerWeek = result.caloriesPerWeek.map((w) => ({
      label: `W${w._id.week}`,
      calories: w.calories
    }));

    const weightTrend = result.weightTrend
      .filter((w) => typeof w.bodyWeightKg === "number")
      .map((w) => ({
        date: w.date,
        weight: w.bodyWeightKg
      }));

    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const activeDays = result.consistency.filter((d) => d.hasWorkout).length;
    const consistencyScore = daysInMonth ? Math.round((activeDays / daysInMonth) * 100) : 0;

    res.json({
      weeklyFrequency,
      caloriesPerWeek,
      weightTrend,
      consistency: {
        score: consistencyScore,
        activeDays,
        daysInMonth
      }
    });
  } catch (err) {
    next(err);
  }
};

