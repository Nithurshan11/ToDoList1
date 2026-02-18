import express from "express";
import { body } from "express-validator";
import { getNotes, createNote, updateNote, deleteNote } from "../controllers/noteController.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

const positionValidation = [
  body("position")
    .optional()
    .isObject()
    .withMessage("Position must be an object with x and y"),
  body("position.x").optional().isNumeric(),
  body("position.y").optional().isNumeric()
];

const createValidation = [
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("color").optional().isString(),
  ...positionValidation
];

const updateValidation = [
  body("content").optional().trim().notEmpty().withMessage("Content cannot be empty"),
  body("color").optional().isString(),
  ...positionValidation
];

router.use(authRequired);

router.get("/", getNotes);
router.post("/", createValidation, createNote);
router.put("/:id", updateValidation, updateNote);
router.delete("/:id", deleteNote);

export default router;

