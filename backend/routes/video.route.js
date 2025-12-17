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

/**
 * @swagger
 * tags:
 *   name: VideoGuide
 *   description: Public and admin video guide management routes
 */



/**
 * @swagger
 * /api/video-guides/public:
 *   get:
 *     summary: Get all active public video guides
 *     tags: [VideoGuide]
 *     responses:
 *       200:
 *         description: Active video guides retrieved
 */
router.get("/public", getActiveVideoGuides);



// Protected routes (all require auth)
router.use(protectRoute);



/**
 * @swagger
 * /api/video-guides:
 *   post:
 *     summary: Create a new video guide (admin only)
 *     tags: [VideoGuide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Video guide created
 *       403:
 *         description: Forbidden
 */
router.post("/", adminRoute, createVideoGuide);



/**
 * @swagger
 * /api/video-guides:
 *   get:
 *     summary: Get all video guides (admin only)
 *     tags: [VideoGuide]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All videos retrieved
 */
router.get("/", adminRoute, getAllVideos);



/**
 * @swagger
 * /api/video-guides/approve:
 *   put:
 *     summary: Approve a video guide (admin only)
 *     tags: [VideoGuide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Video approved
 */
router.put("/approve", adminRoute, approveVideo);



/**
 * @swagger
 * /api/video-guides/reject:
 *   put:
 *     summary: Reject a video guide (admin only)
 *     tags: [VideoGuide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Video rejected
 */
router.put("/reject", adminRoute, rejectVideo);



/**
 * @swagger
 * /api/video-guides/delete:
 *   post:
 *     summary: Delete a video guide (admin only)
 *     tags: [VideoGuide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Video deleted
 */
router.post("/delete", adminRoute, deleteVideoGuide);



/**
 * @swagger
 * /api/video-guides/delete-selected:
 *   post:
 *     summary: Bulk delete selected videos (admin only)
 *     tags: [VideoGuide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Selected videos deleted
 */
router.post("/delete-selected", adminRoute, deleteSelectedVideos);



/**
 * @swagger
 * /api/video-guides/{id}/toggle-active:
 *   patch:
 *     summary: Toggle active status of a video guide (admin only)
 *     tags: [VideoGuide]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Active status toggled
 */
router.patch("/:id/toggle-active", adminRoute, toggleVideoActiveStatus);

export default router;
