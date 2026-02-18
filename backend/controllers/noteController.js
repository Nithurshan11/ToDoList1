import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { Note } from "../models/Note.js";

const handleValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.details = errors.array();
    throw error;
  }
};

export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json({ notes });
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    handleValidation(req);
    const { content, color, position } = req.body;

    const note = await Note.create({
      userId: req.user.id,
      content,
      color,
      position
    });

    res.status(201).json({ note });
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    handleValidation(req);
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note id" });
    }

    const { content, color, position } = req.body;
    const updates = { content, color, position };
    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

    const note = await Note.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: updates },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ note });
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note id" });
    }

    const note = await Note.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted" });
  } catch (err) {
    next(err);
  }
};

