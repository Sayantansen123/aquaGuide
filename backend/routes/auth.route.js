import express from "express";
import {
  getProfile,
  getProfile2,
  getUserDetails,
  login,
  logout,
  refreshToken,
  signup,
  updatePassword,
  suggestUserIds,
  getUserRole,
  getUserLocation,
} from "../controllers/auth.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { createGuest } from "../controllers/guest.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user session management
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User already exists
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid credentials
 *       403:
 *         description: Account locked or inactive
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh authentication token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: No refresh token provided
 */
router.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", protectRoute, getProfile);

/**
 * @swagger
 * /api/auth/profile2:
 *   get:
 *     summary: Get admin profile (test route)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns admin profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden — Admins only
 *       401:
 *         description: Unauthorized
 */
router.get("/profile2", protectRoute, adminRoute, getProfile2);

/**
 * @swagger
 * /api/auth/update-password:
 *   put:
 *     summary: Update user password using current password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 example: newSecurePass456
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid current password
 */
router.put("/update-password", protectRoute, updatePassword);

/**
 * @swagger
 * /api/auth/user-details:
 *   get:
 *     summary: Get logged-in user details with content counts
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the logged-in user's details with counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "c0a80123-4567-89ab-cdef-0123456789ab"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *                 dob:
 *                   type: string
 *                   format: date
 *                   example: "1990-01-01"
 *                 gender:
 *                   type: string
 *                   enum: ["male", "female", "rather_not_say"]
 *                   example: "male"
 *                 role:
 *                   type: string
 *                   enum: ["user", "admin", "support"]
 *                   example: "user"
 *                 status:
 *                   type: string
 *                   enum: ["active", "inactive", "locked"]
 *                   example: "active"
 *                 community_rating:
 *                   type: integer
 *                   example: 0
 *                 videos_posted:
 *                   type: integer
 *                   example: 12
 *                 articles_posted:
 *                   type: integer
 *                   example: 5
 *                 createdAt:
 *                   type: string
 *                   example: 12-03-2025
 *       401:
 *         description: Unauthorized - invalid or missing token
 */

router.get("/user-details", protectRoute, getUserDetails);
router.post("/suggest_userids", suggestUserIds);
router.get("/getrole", getUserRole);

// Live location
router.get("/getLocation", getUserLocation);
router.post("/guestCreate", createGuest);
export default router;
