import express from "express";
import {
  add_comment_to_forum,
  approve_community,
  create_community_forum,
  delete_comment,
  delete_Community_forum,
  dislike_community,
  get_approved_community_forum,
  get_community_form_by_id,
  get_community_forum,
  image_upload,
  like_community,
  reject_community,
  rejection_approval,
} from "../controllers/community_forum.controller.js";
import {
  adminRoute,
  protectRoute,
  supportOrAdminRoute,
} from "../middleware/auth.middleware.js";
import upload from "../middleware/file_upload.middleware.js";

const router = express.Router();

// Get all community forums
router.get(
  "/get_all_community_forum",
  protectRoute,
  adminRoute,
  get_community_forum
);

// Get all approved community forums
router.get("/get_all_approved_community_forum", get_approved_community_forum);

// Get a single community forum by ID
router.get("/get_community_forum_by_id/:id", get_community_form_by_id);

// Create a new community forum
router.post(
  "/add_community_forum",
  protectRoute,
  supportOrAdminRoute,
  create_community_forum
);

// Delete a comment (Admin/Support only)
router.delete(
  "/delete_comment",
  protectRoute,
  supportOrAdminRoute,
  delete_comment
);

// Add a comment to a forum
router.post("/add_comment/:forum_id", protectRoute, add_comment_to_forum);

router.put("/like", protectRoute, like_community);

router.put("/dislike", protectRoute, dislike_community);

// Delete your own comment
router.delete("/comment", protectRoute, delete_comment);

// Upload an image for the forum
router.post(
  "/image_upload",
  supportOrAdminRoute,
  upload.single("image"),
  image_upload
);

// Approve a community forum
router.put(
  "/approve_community",
  protectRoute,
  supportOrAdminRoute,
  approve_community
);

// Reject a community forum
router.put(
  "/reject_community",
  protectRoute,
  supportOrAdminRoute,
  reject_community
);

// Approve a community rejection request (admin only)
router.put(
  "/approve_rejection_request",
  protectRoute,
  adminRoute,
  rejection_approval
);

router.post(
  "/delete_community_forum",
  protectRoute,
  adminRoute,
  delete_Community_forum
);

export default router;
