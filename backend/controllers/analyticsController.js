import mongoose from "mongoose";
import { Task } from "../models/Task.js";

const objectId = mongoose.Types.ObjectId;

export const getOverview = async (req, res, next) => {
  try {
    const userId = new objectId(req.user.id);

    const pipeline = [
      { $match: { userId } },
      {
        $facet: {
          byPriority: [
            {
              $group: {
                _id: "$priority",
                count: { $sum: 1 }
              }
            }
          ],
          byStatus: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 }
              }
            }
          ],
          weeklyCompleted: [
            { $match: { status: "Completed" } },
            {
              $group: {
                _id: {
                  year: { $isoWeekYear: "$updatedAt" },
                  week: { $isoWeek: "$updatedAt" }
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { "_id.year": 1, "_id.week": 1 } },
            { $limit: 8 }
          ],
          monthlyProductivity: [
            { $match: { status: "Completed" } },
            {
              $group: {
                _id: {
                  year: { $year: "$updatedAt" },
                  month: { $month: "$updatedAt" }
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
          ]
        }
      }
    ];

    const [result] = await Task.aggregate(pipeline);

    const priorities = ["High", "Medium", "Low"];
    const byPriority = priorities.map((p) => {
      const entry = result.byPriority.find((x) => x._id === p);
      return { priority: p, count: entry ? entry.count : 0 };
    });

    const statuses = ["Pending", "Completed"];
    const byStatus = statuses.map((s) => {
      const entry = result.byStatus.find((x) => x._id === s);
      return { status: s, count: entry ? entry.count : 0 };
    });

    const weeklyCompleted = result.weeklyCompleted.map((w) => ({
      label: `W${w._id.week} ${w._id.year}`,
      count: w.count
    }));

    const monthlyProductivity = result.monthlyProductivity.map((m) => ({
      label: `${m._id.year}-${String(m._id.month).padStart(2, "0")}`,
      count: m.count
    }));

    res.json({
      byPriority,
      byStatus,
      weeklyCompleted,
      monthlyProductivity
    });
  } catch (err) {
    next(err);
  }
};

export const getByDate = async (req, res, next) => {
  try {
    const userId = new objectId(req.user.id);
    const { month } = req.query; // expected format YYYY-MM

    const now = new Date();
    let start, end;

    if (month) {
      const [year, m] = month.split("-").map((v) => Number(v));
      if (!year || !m) {
        return res.status(400).json({ message: "month must be in format YYYY-MM" });
      }
      start = new Date(year, m - 1, 1);
      end = new Date(year, m, 1);
    } else {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    const pipeline = [
      {
        $match: {
          userId,
          dueDate: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$dueDate" },
            month: { $month: "$dueDate" },
            day: { $dayOfMonth: "$dueDate" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ];

    const result = await Task.aggregate(pipeline);

    const byDate = result.map((d) => ({
      date: `${d._id.year}-${String(d._id.month).padStart(2, "0")}-${String(d._id.day).padStart(
        2,
        "0"
      )}`,
      count: d.count
    }));

    res.json({ byDate, monthStart: start, monthEnd: end });
  } catch (err) {
    next(err);
  }
};

