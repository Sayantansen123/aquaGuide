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
import { protectRoute, adminRoute,optionalProtectRoute } from "../middleware/auth.middleware.js";
import { heartbeat } from "../controllers/heartbeat.controller.js";
import { createGuest } from "../controllers/guest.controller.js";
import { getUserLocations} from "../controllers/user.locationController.js"

const router = express.Router();

// Register a new user
router.post("/signup", signup);

// Log in an existing user
router.post("/login", login);

// Log out the current user
router.post("/logout", logout);

// Refresh authentication token
router.post("/refresh-token", refreshToken);

// Get current user profile
router.get("/profile", protectRoute, getProfile);

//Get admin profile (test route)
router.get("/profile2", protectRoute, adminRoute, getProfile2);

// Update user password using current password
router.put("/update-password", protectRoute, updatePassword);

// Get logged-in user details with content counts
router.get("/user-details", protectRoute, getUserDetails);

// Get unique username suggestions
router.post("/suggest_userids", suggestUserIds);

// Get current role
router.get("/getrole", getUserRole);

// Get Live location
router.get("/getLocation", getUserLocation);

// Heartbeat
router.post("/heartbeat",optionalProtectRoute,heartbeat );

// Create Guest user
router.post("/guestCreate", createGuest);

export default router;
