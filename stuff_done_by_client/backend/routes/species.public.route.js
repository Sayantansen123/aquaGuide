import express from "express";
import {
  getSpeciesDictionary,
  getSpeciesDetail,
  apiSpeciesSearch,
  apiSpeciesSuggestions,
  getSpeciesCompatibilityOptions,
} from "../controllers/speciesPublic.controller.js";

const router = express.Router();

// Get full species dictionary
router.get("/species-dictionary", getSpeciesDictionary);

// Get compatibility options (New)
router.get("/species/compatibility-options", getSpeciesCompatibilityOptions);

// Get species detail by ID
router.get("/species/:id", getSpeciesDetail);



// Search species
router.get("/public/species/search", apiSpeciesSearch);



// Get species suggestions
router.get("/public/species/suggestions", apiSpeciesSuggestions);

// Compatibility options for UI
// (duplicate route removed)

export default router;
