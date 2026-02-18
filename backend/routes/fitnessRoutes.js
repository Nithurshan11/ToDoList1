import express from "express";
import { body, query } from "express-validator";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  getDaysForMonth,
  upsertDay,
  deleteEntry,
  getOverview
} from "../controllers/fitnessController.js";

const router = express.Router();

const monthValidation = [query("month").optional().isString()];

const dayUpsertValidation = [
  body("date").notEmpty().isISO8601().withMessage("Valid date is required"),
  body("durationMinutes").optional().isNumeric(),
  body("caloriesBurned").optional().isNumeric(),
  body("waterIntakeMl").optional().isNumeric(),
  body("bodyWeightKg").optional().isNumeric(),
  body("sleepHours").optional().isNumeric(),
  body("workoutType").optional().isString().isLength({ max: 80 }),
  body("mood").optional().isString().isLength({ max: 40 }),
  body("notes").optional().isString().isLength({ max: 4000 })
];

router.use(authRequired);

router.get("/days", monthValidation, getDaysForMonth);
router.post("/day", dayUpsertValidation, upsertDay);
router.delete("/day/:id", deleteEntry);
router.get("/analytics/overview", monthValidation, getOverview);

export default router;

