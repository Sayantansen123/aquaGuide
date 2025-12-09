import express from "express"
import { add_comment_to_forum, create_community_forum, delete_comment, dislike_community, get_community_form_by_id, get_community_forum, image_upload, like_community } from "../controllers/community_forum.controller.js"
import { protectRoute, supportOrAdminRoute } from "../middleware/auth.middleware.js"
import upload from "../middleware/file_upload.middleware.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Community Forum
 *   description: Api Related to Community Forums
 */

/**
 * @swagger
 * /api/community/get_all_community_forums:
 *   get:
 *     summary: Get all community forums
 *     tags: [Community]
 *     responses:
 *       200:
 *         description: List of all community forums
 */
router.get("/get_all_community_forums", get_community_forum)


/**
 * @swagger
 * /api/community/get_communtiy_form_by_id/{id}:
 *   get:
 *     summary: Get a single community forum by ID
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the community forum
 *     responses:
 *       200:
 *         description: Forum details fetched successfully
 *       404:
 *         description: Forum not found
 */
router.get("/get_communtiy_form_by_id/:id", get_community_form_by_id)


/**
 * @swagger
 * /api/community/add_community_forum:
 *   post:
 *     summary: Create a new community forum
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateForumRequest'
 *     responses:
 *       201:
 *         description: Community forum created successfully
 *       500:
 *         description: Interna; Server Errors
 */
router.post("/add_community_forum", supportOrAdminRoute, create_community_forum)


/**
 * @swagger
 * /api/community/delete_comment:
 *   delete:
 *     summary: Delete a comment (Admin/Support only)
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment_id:
 *                 type: string
 *                 required: true
 *     responses:
 *       204:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
router.delete("/delete_comment", supportOrAdminRoute, delete_comment)

/**
 * @swagger
 * /api/community/add_comment:
 *   post:
 *     summary: Add a comment to a forum
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCommentRequest'
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       404:
 *         description: Forum not found
 */
router.post("/add_comment", protectRoute, add_comment_to_forum)


/**
 * @swagger
 * /api/community/like:
 *   put:
 *     summary: Like a community forum
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               forum_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Forum liked successfully
 *       404:
 *         description: Forum not found
 */
router.put("/like", protectRoute, like_community)


/**
 * @swagger
 * /api/community/dislike:
 *   put:
 *     summary: Dislike a community forum
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               forum_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Forum disliked successfully
 *       404:
 *         description: Forum not found
 */
router.put("/dislike", protectRoute, dislike_community)


/**
 * @swagger
 * /api/community/comment:
 *   delete:
 *     summary: Delete your own comment
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
router.delete("/comment", protectRoute, delete_comment)


/**
 * @swagger
 * /api/community/image_upload:
 *   post:
 *     summary: Upload an image for the forum
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       202:
 *         description: Image uploaded successfully
 *       400:
 *         description: File Not found or invalid file format
 */
router.post("/image_upload", supportOrAdminRoute, upload.single("image"), image_upload)

export default router;