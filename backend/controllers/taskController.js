import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { Task } from "../models/Task.js";

const handleValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.details = errors.array();
    throw error;
  }
};

// Build query filters from request query params
const buildFilters = (req) => {
  const { status, priority, fromDate, toDate, search } = req.query;
  const filters = { userId: req.user.id };

  if (status) {
    filters.status = status;
  }

  if (priority) {
    filters.priority = priority;
  }

  if (fromDate || toDate) {
    filters.dueDate = {};
    if (fromDate) {
      filters.dueDate.$gte = new Date(fromDate);
    }
    if (toDate) {
      filters.dueDate.$lte = new Date(toDate);
    }
  }

  if (search) {
    const regex = new RegExp(search, "i");
    filters.$or = [{ title: regex }, { description: regex }];
  }

  return filters;
};

export const getTasks = async (req, res, next) => {
  try {
    const filters = buildFilters(req);
    const tasks = await Task.find(filters).sort({ dueDate: 1, createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    handleValidation(req);
    const { title, description, dueDate, priority } = req.body;

    const task = await Task.create({
      userId: req.user.id,
      title,
      description,
      dueDate,
      priority
    });

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    handleValidation(req);

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const updates = (({ title, description, dueDate, priority, status }) => ({
      title,
      description,
      dueDate,
      priority,
      status
    }))(req.body);

    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: updates },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ task });
  } catch (err) {
    next(err);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    handleValidation(req);

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const { status } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: { status } },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ task });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

export const getTaskHistory = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const history = await Task.find({
      userId: req.user.id,
      status: "Completed"
    })
      .sort({ updatedAt: -1 })
      .limit(Number(limit));

    res.json({ tasks: history });
  } catch (err) {
    next(err);
  }
};

