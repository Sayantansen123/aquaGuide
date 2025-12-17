import express from "express";
import {
  getSpeciesDictionary,
  getSpeciesDetail,
  apiSpeciesSearch,
  apiSpeciesSuggestions,
} from "../controllers/speciesPublic.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Species
 *   description: Species dictionary and public species APIs
 */



/**
 * @swagger
 * /api/species-dictionary:
 *   get:
 *     summary: Get full species dictionary
 *     tags: [Species]
 *     responses:
 *       200:
 *         description: Species dictionary fetched successfully
 */
router.get("/species-dictionary", getSpeciesDictionary);



/**
 * @swagger
 * /api/species/{id}:
 *   get:
 *     summary: Get species detail by ID
 *     tags: [Species]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Species found
 *       404:
 *         description: Species not found
 */
router.get("/species/:id", getSpeciesDetail);



/**
 * @swagger
 * /api/public/species/search:
 *   get:
 *     summary: Search species
 *     tags: [Species]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: Search query string
 *     responses:
 *       200:
 *         description: Species search results
 *       400:
 *         description: Search query size is inadequate
 */
router.get("/public/species/search", apiSpeciesSearch);



/**
 * @swagger
 * /api/public/species/suggestions:
 *   get:
 *     summary: Get species suggestions
 *     tags: [Species]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: Partial name for suggestion
 *     responses:
 *       200:
 *         description: Species suggestions retrieved
 *       400:
 *         description: Search query size is inadequate
 */
router.get("/public/species/suggestions", apiSpeciesSuggestions);

export default router;
