import { Router } from "express";
import {
  adminRoute,
  protectRoute,
  supportOrAdminRoute,
} from "../middleware/auth.middleware.js";
import {
  manageUsers,
  activateUser,
  deactivateUser,
  unlockUser,
  toggleAdmin,
  toggleSupport,
  deleteUser,
  searchUser
} from "../controllers/manageUsers.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AdminUsers
 *   description: Admin and support user management routes
 */



// Base protection for all admin routes
router.use(protectRoute);



/**
 * @swagger
 * /api/admin/manage-users:
 *   get:
 *     summary: Get users filtered by status (admin/support)
 *     tags: [AdminUsers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter users by status (active, inactive, locked)
 *     responses:
 *       200:
 *         description: User list retrieved
 *       403:
 *         description: Forbidden
 */
router.get("/manage-users", supportOrAdminRoute, manageUsers);



/**
 * @swagger
 * /api/admin/user/{userId}/activate:
 *   post:
 *     summary: Activate a user (admin only)
 *     tags: [AdminUsers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200:
 *         description: User activated
 */
router.post("/user/:userId/activate", adminRoute, activateUser);



/**
 * @swagger
 * /api/admin/user/{userId}/deactivate:
 *   post:
 *     summary: Deactivate a user (admin only)
 *     tags: [AdminUsers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200:
 *         description: User deactivated
 */
router.post("/user/:userId/deactivate", adminRoute, deactivateUser);



/**
 * @swagger
 * /api/admin/user/{userId}/unlock:
 *   post:
 *     summary: Unlock a user account (admin/support)
 *     tags: [AdminUsers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200:
 *         description: User unlocked
 */
router.post("/user/:userId/unlock", supportOrAdminRoute, unlockUser);



/**
 * @swagger
 * /api/admin/user/{userId}/toggle_admin:
 *   post:
 *     summary: Grant or remove admin rights (admin only)
 *     tags: [AdminUsers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200:
 *         description: Admin role toggled
 */
router.post("/user/:userId/toggle_admin", adminRoute, toggleAdmin);



/**
 * @swagger
 * /api/admin/user/{userId}/toggle_support:
 *   post:
 *     summary: Grant or remove support role (admin only)
 *     tags: [AdminUsers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200:
 *         description: Support role toggled
 */
router.post("/user/:userId/toggle_support", adminRoute, toggleSupport);



/**
 * @swagger
 * /api/admin/user/{userId}/delete:
 *   post:
 *     summary: Delete a user (admin only)
 *     tags: [AdminUsers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200:
 *         description: User deleted
 */
router.post("/user/:userId/delete", adminRoute, deleteUser);

// GET /api/manage_users/search?userName=
router.get("/search",supportOrAdminRoute,searchUser)

export default router;
