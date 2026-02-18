import express from "express";
import { body } from "express-validator";
import { register, login, getMe, getStats } from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

const registerValidation = [
  body("username").trim().isLength({ min: 2, max: 50 }).withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required")
];

router.post("/register", registerValidation, register);
router.post("/login", loginLimiter, loginValidation, login);
router.get("/me", authRequired, getMe);
router.get("/stats", getStats);

export default router;

