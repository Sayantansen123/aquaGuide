import express from "express";
import {
  approve_or_reject_rejection_request,
  approve_or_reject_text,
  get_all_guides,
  get_text_guide,
  get_text_guide_by_id,
  post_text_guide,
  approve_or_reject_for_support,
  bulk_action_text_guides,
  update_text_guide,
  delete_text_guide,
} from "../controllers/text_guide.controller.js";
import {
  adminRoute,
  protectRoute,
  supportOnlyRoute,
  supportOrAdminRoute,
  canEditGuideMiddleware,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: TextGuide
 *   description: Routes for public, support, and admin text guide operations
 */

/**
 * @swagger
 * /api/text_guide:
 *   post:
 *     summary: Create a text guide
 *     tags: [TextGuide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Text guide created
 *       400:
 *         description: Invalid data
 */
router.post("/text_guide", protectRoute, post_text_guide);

/**
 * @swagger
 * /api/get_all_guides:
 *   get:
 *     summary: Get all approved text guides
 *     tags: [TextGuide]
 *     responses:
 *       200:
 *         description: List of guides
 */
router.get("/get_all_guides", get_text_guide);

/**
 * @swagger
 * /api/get_text_guide/{id}:
 *   get:
 *     summary: Get a text guide by ID
 *     tags: [TextGuide]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Text guide found
 *       404:
 *         description: Not found
 */
router.get("/get_text_guide/:id", get_text_guide_by_id);

/**
 * @swagger
 * /api/all_text_guides:
 *   get:
 *     summary: Get all text guides (admin/support)
 *     tags: [TextGuide]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All guides fetched
 */
router.get(
  "/all_text_guides",
  protectRoute,
  supportOrAdminRoute,
  get_all_guides
);

/**
 * @swagger
 * /api/approve_or_reject/{id}:
 *   put:
 *     summary: Approve or reject a text guide (admin only)
 *     tags: [TextGuide]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Status updated
 */

//sayantan
router.put(
  "/approve_or_reject",
  protectRoute,
  adminRoute,
  approve_or_reject_text
);

/**
 * @swagger
 * /api/approve_or_deny_rejection_request/{id}:
 *   put:
 *     summary: Approve or deny a rejection request (admin only)
 *     tags: [TextGuide]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Request handled
 */
router.put(
  "/approve_or_deny_rejection_request/:id",
  protectRoute,
  adminRoute,
  approve_or_reject_rejection_request
);

// Approve or reject a text guide (support only)
router.put(
  "/approve_or_reject_text_guide/:id",
  protectRoute,
  supportOnlyRoute,
  approve_or_reject_for_support
);
// Bulk approve or reject text guides (admin only)
router.post(
  "/text_guides/bulk_action",
  protectRoute,
  adminRoute,
  bulk_action_text_guides
);

// Update a text guide (admin or owner)
router.put(
  "/text_guide/:id",
  protectRoute,
  canEditGuideMiddleware,
  update_text_guide
);

// Delete a text guide (admin only)


//sayantan
router.post("/text_guide_delete", protectRoute, adminRoute, delete_text_guide);

export default router;
