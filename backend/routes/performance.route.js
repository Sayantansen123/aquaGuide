import express from "express";
import {
  getMetrics,
  getHistory,
  getSummary,
} from "../controllers/performance.controller.js";
import { protectRoute, supportOrAdminRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/metrics", protectRoute , supportOrAdminRoute, getMetrics);
router.get("/history", protectRoute , supportOrAdminRoute, getHistory);
router.get("/summary", protectRoute , supportOrAdminRoute, getSummary);

export default router;
