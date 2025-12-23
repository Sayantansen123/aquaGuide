import { Op } from "sequelize";
import SpeciesDictionary from "../models/speciesDictionary.model.js";

/**
 * GET /species-dictionary
 * JSON response with filters + pagination
 */
export const getSpeciesDictionary = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 20;
    const search = req.query.q || "";
    const water_type = req.query.water_type || "";
    const care_level = req.query.care_level || "";
    const category = req.query.category || "";

    const where = { status: "published" };

    // 🔍 Search filter
    if (search) {
      where[Op.or] = [
        { common_name: { [Op.iLike]: `%${search}%` } },
        { scientific_name: { [Op.iLike]: `%${search}%` } },
        { family: { [Op.iLike]: `%${search}%` } },
        { origin: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { water_type: { [Op.iLike]: `%${search}%` } },
        { care_level: { [Op.iLike]: `%${search}%` } },
        { diet_type: { [Op.iLike]: `%${search}%` } },
        { temperament: { [Op.iLike]: `%${search}%` } },
        { diet_info: { [Op.iLike]: `%${search}%` } },
        { compatibility_notes: { [Op.iLike]: `%${search}%` } },
        { breeding_notes: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // ⚙️ Filters
    if (water_type) where.water_type = water_type;
    if (care_level) where.care_level = care_level;
    if (category === "compatibility") {
      where.compatibility_notes = { [Op.not]: null };
    }

    // 📦 Pagination query
    const { count, rows: species } = await SpeciesDictionary.findAndCountAll({
      where,
      order: [["common_name", "ASC"]],
      limit: perPage,
      offset: (page - 1) * perPage,
    });

    const totalPages = Math.ceil(count / perPage);

    // 🔙 Send JSON response
    return res.status(200).json({
      page,
      perPage,
      total: count,
      totalPages,
      filters: {
        search,
        water_type,
        care_level,
        category,
      },
      species,
    });
  } catch (error) {
    console.error("❌ Error in getSpeciesDictionary:", error);
    return res.status(500).json({ error: "Failed to load species dictionary" });
  }
};

/**
 * GET /species/:id
 * Returns one species + related species
 */
export const getSpeciesDetail = async (req, res) => {
  try {
    const fishId = req.params.id;

    const species = await SpeciesDictionary.findOne({
      where: { fish_id: fishId, status: "published" },
    });

    if (!species) {
      return res.status(404).json({ error: "Species not found" });
    }

    // 👁️ Increment view count
    species.views_count = (species.views_count || 0) + 1;
    await species.save();

    // 🔗 Related species (same family/water type)
    const related_species = await SpeciesDictionary.findAll({
      where: {
        fish_id: { [Op.ne]: fishId },
        status: "published",
        [Op.or]: [
          { family: species.family },
          { water_type: species.water_type },
        ],
      },
      limit: 6,
    });

    return res.status(200).json({
      species,
      related_species,
    });
  } catch (error) {
    console.error("❌ Error in getSpeciesDetail:", error);
    return res.status(500).json({ error: "Failed to load species details" });
  }
};

/**
 * GET /api/species/search
 * Autocomplete for species (lightweight)
 */
export const apiSpeciesSearch = async (req, res) => {
  try {
    // 🔎 Sanitize and normalize the query
    const query = (req.query.q || "").trim();

    // 🔒 Prevent empty or single-character queries
    if (!query || query.length < 2) {
      return res.status(400).json({
        error: "Search query must be at least 2 characters long.",
        example: "/api/species/search?q=betta"
      });
    }

    // 🐠 Search species in the published dictionary
    const species = await SpeciesDictionary.findAll({
      where: {
        status: "published",
        [Op.or]: [
          { common_name: { [Op.iLike]: `%${query}%` } },
          { scientific_name: { [Op.iLike]: `%${query}%` } },
          { family: { [Op.iLike]: `%${query}%` } },
          { origin: { [Op.iLike]: `%${query}%` } },
        ],
      },
      limit: 10,
      order: [["common_name", "ASC"]],
    });

    // 🧩 Map to clean JSON results
    const results = species.map((s) => ({
      fish_id: s.fish_id,
      common_name: s.common_name,
      scientific_name: s.scientific_name,
      primary_image: s.primary_image || "",
      family: s.family || "",
      origin: s.origin || "",
      water_type: s.water_type || "",
      care_level: s.care_level || "",
    }));

    // ✅ Respond
    return res.status(200).json({
      query,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("❌ Error in apiSpeciesSearch:", error);
    return res.status(500).json({
      error: "Internal server error while performing search.",
    });
  }
};

/**
 * GET /api/species/suggestions
 * Richer suggestions for search dropdown
 */
export const apiSpeciesSuggestions = async (req, res) => {
  try {
    const query = (req.query.q || "").trim();
    if (!query || query.length < 2) {
      return res.status(400).json({
        error: "Search query must be at least 2 characters long.",
      });
    }

    const likeQuery = `%${query}%`;

    // 🚫 No ENUM columns here
    const species = await SpeciesDictionary.findAll({
      where: {
        status: "published",
        [Op.or]: [
          { common_name: { [Op.iLike]: likeQuery } },
          { scientific_name: { [Op.iLike]: likeQuery } },
          { family: { [Op.iLike]: likeQuery } },
          { origin: { [Op.iLike]: likeQuery } },
          { description: { [Op.iLike]: likeQuery } },
          { diet_info: { [Op.iLike]: likeQuery } },
          { compatibility_notes: { [Op.iLike]: likeQuery } },
          { breeding_notes: { [Op.iLike]: likeQuery } },
        ],
      },
      limit: 8,
      order: [["common_name", "ASC"]],
    });

    const suggestions = species.map((s) => ({
      fish_id: s.fish_id,
      common_name: s.common_name,
      scientific_name: s.scientific_name,
      description: s.description || "",
      primary_image: s.primary_image || "",
      water_type: s.water_type || "",
      care_level: s.care_level || "",
      family: s.family || "",
      origin: s.origin || "",
      temperament: s.temperament || "",
      diet_type: s.diet_type || "",
      max_size_cm: s.max_size_cm ? parseFloat(s.max_size_cm) : null,
      min_tank_size_liters: s.min_tank_size_liters,
    }));

    return res.status(200).json({
      query,
      count: suggestions.length,
      suggestions,
    });
  } catch (error) {
  console.error("❌ Error in apiSpeciesSuggestions:", error);
  return res.status(500).json({ error: error?.message || error });
}
};