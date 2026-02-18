import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import { getOverview, getByDate } from "../controllers/analyticsController.js";

const router = express.Router();

router.use(authRequired);

router.get("/overview", getOverview);
router.get("/by-date", getByDate);

export default router;

