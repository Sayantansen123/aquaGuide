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

// Get all active public video guides
router.get("/public", getActiveVideoGuides);



// Protected routes (all require auth)
router.use(protectRoute);



// Create a new video guide (admin only)
router.post("/", adminRoute, createVideoGuide);



// Get all video guides (admin only)
router.get("/", adminRoute, getAllVideos);



// Approve a video guide (admin only)
router.put("/approve", adminRoute, approveVideo);



// Reject a video guide (admin only)
router.put("/reject", adminRoute, rejectVideo);



// Delete a video guide (admin only)
router.post("/delete", adminRoute, deleteVideoGuide);



// Bulk delete selected videos (admin only)

router.post("/delete-selected", adminRoute, deleteSelectedVideos);



// Toggle active status of a video guide (admin only)
router.patch("/:id/toggle-active", adminRoute, toggleVideoActiveStatus);

export default router;
