import SpeciesDictionary from "../models/speciesDictionary.model.js";
import { Op,where,fn,col } from "sequelize";
import User from "../models/user.model.js";
/**
 * POST /admin/species-management/new
 * Add a new species (no duplicates)
 */
export const addSpecies = async (req, res) => {
  try {
    const { common_name, scientific_name } = req.body;

    // Duplicate check (case-insensitive)
    const existing = await SpeciesDictionary.findOne({
      where: {
        [Op.and]: [
          { common_name: { [Op.iLike]: common_name.trim() } },
          { scientific_name: { [Op.iLike]: scientific_name.trim() } },
        ],
      },
    });

    if (existing) {
      return res.status(400).json({
        error: "Species already exists in the dictionary",
        existing: {
          fish_id: existing.fish_id,
          common_name: existing.common_name,
          scientific_name: existing.scientific_name,
        },
      });
    }

    const newSpecies = await SpeciesDictionary.create({
      ...req.body,
      created_by: req.user?.id || null,
      status: req.body.status || "published",
    });

    return res.status(201).json({
      message: "Species added successfully",
      fish_id: newSpecies.fish_id,
      common_name: newSpecies.common_name,
      scientific_name: newSpecies.scientific_name,
    });
  } catch (error) {
    console.error("Error adding species:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * PUT /admin/species-management/:fish_id
 * Update species info
 */
export const editSpecies = async (req, res) => {
  try {
    const { fish_id } = req.params;
    const species = await SpeciesDictionary.findByPk(fish_id);

    if (!species) return res.status(404).json({ error: "Species not found" });

    await species.update(req.body);
    return res.status(200).json({
      message: "Species updated successfully",
      species,
    });
  } catch (error) {
    console.error("Error updating species:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE /admin/species-management/:fish_id
 */
export const deleteSpecies = async (req, res) => {
  try {
    const { fish_id } = req.params;
    const species = await SpeciesDictionary.findByPk(fish_id);

    if (!species) return res.status(404).json({ error: "Species not found" });

    await species.destroy();
    return res.status(204).json({ message: "Species deleted successfully" });
  } catch (error) {
    console.error("Error deleting species:", error);
    return res.status(500).json({ error: "Failed to delete species" });
  }
};

/**
 * GET /admin/species-management
 */
export const getSpeciesManagement = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 20;
    const offset = (page - 1) * perPage;

    const { count, rows: species } = await SpeciesDictionary.findAndCountAll({
      order: [["created_at", "DESC"]],
      limit: perPage,
      offset,
    });

    return res.status(200).json({
      page,
      perPage,
      total: count,
      totalPages: Math.ceil(count / perPage),
      species,
    });
  } catch (error) {
    console.error("Error fetching species:", error);
    return res.status(500).json({ error: "Failed to fetch species" });
  }
};


export const searchSpeciesManagement = async (req, res) => {
  try {
    const {
      q,        // search query
      status,   // draft | published | archived
      type,     // freshwater | brackish | marine
      page = 1,
      limit = 20,
    } = req.query;

    const perPage = parseInt(limit);
    const currentPage = parseInt(page);
    const offset = (currentPage - 1) * perPage;

    /* ------------------ BUILD FILTERS ------------------ */
    const whereConditions = [];

    if (q && q.trim()) {
      const searchValue = `%${q.toLowerCase()}%`;
      whereConditions.push({
        [Op.or]: [
          where(fn("LOWER", col("common_name")), { [Op.like]: searchValue }),
          where(fn("LOWER", col("scientific_name")), { [Op.like]: searchValue }),
        ],
      });
    }

    if (status && ["draft", "published", "archived"].includes(status)) {
      whereConditions.push({ status });
    }

    if (type && ["freshwater", "brackish", "marine"].includes(type)) {
      whereConditions.push({ water_type: type });
    }

    const finalWhere =
      whereConditions.length > 0 ? { [Op.and]: whereConditions } : {};

    /* ------------------ TOTAL SPECIES (NO FILTER) ------------------ */
    const totalSpecies = await SpeciesDictionary.count();

    /* ------------------ FILTERED + PAGINATED ------------------ */
    const { count: totalFiltered, rows: species } =
      await SpeciesDictionary.findAndCountAll({
        where: finalWhere,
        order: [["created_at", "DESC"]],
        limit: perPage,
        offset,
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id", "userid", "email", "role"],
          },
        ],
      });

    return res.status(200).json({
      page: currentPage,
      perPage,
      totalSpecies,
      totalFiltered,
      totalPages: Math.ceil(totalFiltered / perPage),
      species,
    });
  } catch (error) {
    console.error("Error searching species:", error);
    return res.status(500).json({
      error: "Failed to search species",
    });
  }
};