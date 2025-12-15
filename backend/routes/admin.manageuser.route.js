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

// Apply base authentication to all admin routes
router.use(protectRoute);

// GET /api/admin/manage-users?status=active
router.get("/manage-users", supportOrAdminRoute, manageUsers);

// POST /api/admin/user/:userId/activate
router.post("/user/:userId/activate", adminRoute, activateUser);

// POST /api/admin/user/:userId/deactivate
router.post("/user/:userId/deactivate", adminRoute, deactivateUser);

// POST /api/admin/user/:userId/unlock
router.post("/user/:userId/unlock", supportOrAdminRoute, unlockUser); // Note: Uses supportRequired

// POST /api/admin/user/:userId/toggle_admin
router.post("/user/:userId/toggle_admin", adminRoute, toggleAdmin);

// POST /api/admin/user/:userId/toggle_support
router.post("/user/:userId/toggle_support", adminRoute, toggleSupport);

// POST /api/admin/user/:userId/delete
router.post("/user/:userId/delete", adminRoute, deleteUser);

// GET /api/manage_users/search?userName=
router.get("/search",supportOrAdminRoute,searchUser)

export default router;
