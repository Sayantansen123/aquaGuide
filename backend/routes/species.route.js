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

/**
 * @swagger
 * tags:
 *   name: SpeciesManagement
 *   description: Admin and support species management routes
 */



/**
 * @swagger
 * /api/species-management:
 *   get:
 *     summary: Get all species for management
 *     tags: [SpeciesManagement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Species management list retrieved
 */
router.get(
  "/species-management",
  protectRoute,
  supportOrAdminRoute,
  getSpeciesManagement
);



/**
 * @swagger
 * /api/species-management/new:
 *   post:
 *     summary: Add a new species
 *     tags: [SpeciesManagement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Species created successfully
 *       400:
 *         description: Invalid data
 */
router.post(
  "/species-management/new",
  protectRoute,
  supportOrAdminRoute,
  addSpecies
);



/**
 * @swagger
 * /api/species-management/{fish_id}:
 *   put:
 *     summary: Edit species by ID
 *     tags: [SpeciesManagement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fish_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Species updated
 *       404:
 *         description: Species not found
 */
router.put(
  "/species-management/:fish_id",
  protectRoute,
  supportOrAdminRoute,
  editSpecies
);



/**
 * @swagger
 * /api/species-management/{fish_id}:
 *   delete:
 *     summary: Delete species by ID
 *     tags: [SpeciesManagement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fish_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Species deleted
 *       404:
 *         description: Species not found
 */
router.delete(
  "/species-management/:fish_id",
  protectRoute,
  supportOrAdminRoute,
  deleteSpecies
);

router.get(
  "/species/search",
  protectRoute,
  supportOrAdminRoute,
  searchSpeciesManagement
);

export default router;
