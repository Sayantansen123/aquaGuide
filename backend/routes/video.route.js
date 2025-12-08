// routes/videoGuide.routes.js
import express from "express";
import {
  createVideoGuide,
  getAllVideos,
  approveVideo,
  rejectVideo,
  deleteVideoGuide,
  deleteSelectedVideos,
  getActiveVideoGuides,
  toggleVideoActiveStatus,
} from "../controllers/video.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/public", getActiveVideoGuides);

// 🔐 Protected routes
router.use(protectRoute);

router.post("/", adminRoute, createVideoGuide);
router.get("/", adminRoute, getAllVideos);
router.put("/approve", adminRoute, approveVideo);
router.put("/reject", adminRoute, rejectVideo);
router.post("/delete", adminRoute, deleteVideoGuide);
router.post("/delete-selected", adminRoute, deleteSelectedVideos);

// 🧭 Toggle isActive (admin only)
router.patch("/:id/toggle-active", adminRoute, toggleVideoActiveStatus);

export default router;
