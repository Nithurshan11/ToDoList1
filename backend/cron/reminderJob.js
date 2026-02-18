import cron from "node-cron";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { sendTaskReminderEmail } from "../utils/emailService.js";

const HOURS_BEFORE_DUE = 10;

const findDueSoonTasks = async () => {
  const now = new Date();
  const upperBound = new Date(now.getTime() + HOURS_BEFORE_DUE * 60 * 60 * 1000);

  // Pending tasks, not yet reminded, due within the next HOURS_BEFORE_DUE hours
  const tasks = await Task.find({
    status: "Pending",
    reminderSent: false,
    dueDate: { $gte: now, $lte: upperBound }
  }).populate("userId", "username email");

  return tasks;
};

const processReminders = async () => {
  try {
    const tasks = await findDueSoonTasks();
    if (!tasks.length) return;

    for (const task of tasks) {
      const user = task.userId;
      if (!user || !user.email) continue;

      const hoursLeft = Math.max(
        1,
        Math.round((new Date(task.dueDate).getTime() - Date.now()) / (60 * 60 * 1000))
      );

      try {
        await sendTaskReminderEmail(user, task, hoursLeft);

        // Mark as reminded so we don't send again
        await Task.updateOne(
          { _id: task._id, reminderSent: false },
          { $set: { reminderSent: true } }
        );
      } catch (err) {
        console.error("Failed to send reminder email for task", task._id.toString(), err.message);
      }
    }
  } catch (err) {
    console.error("Error running reminder job:", err.message);
  }
};

export const startReminderJob = () => {
  // Run every hour at minute 0
  cron.schedule("0 * * * *", () => {
    console.log("⏰ Running reminder cron job");
    void processReminders();
  });
};

