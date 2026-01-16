import express from "express";
import {
  addSpecies,
  editSpecies,
  deleteSpecies,
  getSpeciesManagement,
  searchSpeciesManagement
} from "../controllers/manageSpecies.controller.js";
import { protectRoute, supportOrAdminRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all species for management
router.get(
  "/species-management",
  protectRoute,
  supportOrAdminRoute,
  getSpeciesManagement
);


// Add a new species
router.post(
  "/species-management/new",
  protectRoute,
  supportOrAdminRoute,
  addSpecies
);



// Edit species by ID
router.put(
  "/species-management/:fish_id",
  protectRoute,
  supportOrAdminRoute,
  editSpecies
);


// Delete species by ID
router.delete(
  "/species-management/:fish_id",
  protectRoute,
  supportOrAdminRoute,
  deleteSpecies
);

// Search species
router.get(
  "/species/search",
  protectRoute,
  supportOrAdminRoute,
  searchSpeciesManagement
);

export default router;
