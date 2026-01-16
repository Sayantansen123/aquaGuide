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
  searchUser,
  getLiveUsers,
} from "../controllers/manageUsers.controller.js";
import { getUserSummaryStats } from "../controllers/userSummary.controller.js";

const router = Router();


// Base protection for all admin routes
router.use(protectRoute);


// Get users filtered by status (admin/support)
router.get("/manage-users", supportOrAdminRoute, manageUsers);
router.get("/live-users", supportOrAdminRoute, getLiveUsers);

// summary: Activate a user (admin only)
router.post("/user/:userId/activate", adminRoute, activateUser);


// Deactivate a user (admin only)
router.post("/user/:userId/deactivate", adminRoute, deactivateUser);

// Unlock a user account (admin/support)
router.post("/user/:userId/unlock", supportOrAdminRoute, unlockUser);

// Grant or remove admin rights (admin only)
router.post("/user/:userId/toggle_admin", adminRoute, toggleAdmin);

// Grant or remove support role (admin only)
router.post("/user/:userId/toggle_support", adminRoute, toggleSupport);

// Delete a user (admin only)
router.post("/user/:userId/delete", adminRoute, deleteUser);

// GET /api/manage_users/search?userName=
router.get("/search", supportOrAdminRoute, searchUser);

router.get("/stats/user-summary", supportOrAdminRoute, getUserSummaryStats);

export default router;
