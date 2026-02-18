import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import fitnessRoutes from "./routes/fitnessRoutes.js";
import { startReminderJob } from "./cron/reminderJob.js";

const app = express();

// Basic security and parsing middleware
app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.nodeEnv !== "test") {
  app.use(morgan("dev"));
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/fitness", fitnessRoutes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectDb();
  app.listen(env.port, () => {
    console.log(`🚀 Server listening on port ${env.port}`);
  });
  startReminderJob();
};

start().catch((err) => {
  console.error("Failed to start server:", err);
});

