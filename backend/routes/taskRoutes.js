import express from "express";
import { body, query } from "express-validator";
import {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskHistory
} from "../controllers/taskController.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

const taskCreateValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("dueDate").notEmpty().withMessage("Due date is required").isISO8601().toDate(),
  body("priority")
    .optional()
    .isIn(["High", "Medium", "Low"])
    .withMessage("Priority must be High, Medium, or Low")
];

const taskUpdateValidation = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("dueDate").optional().isISO8601().toDate(),
  body("priority")
    .optional()
    .isIn(["High", "Medium", "Low"])
    .withMessage("Priority must be High, Medium, or Low"),
  body("status")
    .optional()
    .isIn(["Pending", "Completed"])
    .withMessage("Status must be Pending or Completed")
];

const statusUpdateValidation = [
  body("status")
    .notEmpty()
    .isIn(["Pending", "Completed"])
    .withMessage("Status must be Pending or Completed")
];

const listValidation = [
  query("status").optional().isIn(["Pending", "Completed"]),
  query("priority").optional().isIn(["High", "Medium", "Low"]),
  query("fromDate").optional().isISO8601(),
  query("toDate").optional().isISO8601()
];

router.use(authRequired);

router.get("/", listValidation, getTasks);
router.post("/", taskCreateValidation, createTask);
router.put("/:id", taskUpdateValidation, updateTask);
router.patch("/:id/status", statusUpdateValidation, updateTaskStatus);
router.delete("/:id", deleteTask);
router.get("/history", getTaskHistory);

export default router;

