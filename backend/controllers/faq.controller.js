import FAQ from "../models/faq.model.js";
import { Op, where, fn, col } from "sequelize";
import User from "../models/user.model.js";

export const addFAQ = async (req, res) => {
  try {
    const { question, answers } = req.body;

    // Duplicate check (case-insensitive)
    const existing = await FAQ.findOne({
      where: {
        [Op.and]: [{ question: { [Op.iLike]: question.trim() } }],
      },
    });

    if (existing) {
      return res.status(400).json({
        error: "Question already exists in the database",
        existing: {
          question_id: existing.id,
          question: existing.question,
          answers: existing.answers,
        },
      });
    }
    const createdBy = req.user.id;
    const newFAQ = await FAQ.create({
      ...req.body,
      created_by: createdBy,
    });

    return res.status(201).json({
      message: "FAQ added successfully",
      id: newFAQ.id,
      question: newFAQ.question,
      answers: newFAQ.answers,
    });
  } catch (error) {
    console.error("Error adding FAQ:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getFAQ = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.q || "";
    const whereCondition = search
      ? {
          [Op.or]: [
            { question: { [Op.iLike]: `%${search}%` } },
            { answers: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const { rows: question, count: total } = await FAQ.findAndCountAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset,
    });

    res.status(200).json({
      message: "FAQs fetched successfully",
      questions: question,
      pagination: {
        total_items: total,
        current_page: page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({
      message: "Failed to FAQs.",
      question: [],
      pagination: {
        total_items: 0,
        current_page: 1,
        totalPages: 0,
        pageSize: 0,
      },
    });
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    const { ids } = req.body;

    // Admin safety check
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete faq" });
    }

    // Validation
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids must be a non-empty array" });
    }

    // Bulk delete
    const deletedCount = await FAQ.destroy({
      where: {
        id: ids,
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        message: "No faq found for provided ids",
      });
    }

    return res.status(200).json({
      message: "Faq deleted successfully",
      deletedCount,
    });
  } catch (error) {
    console.error("Error deleting Faq:", error);
    return res.status(500).json({ error: "Failed to delete faq" });
  }
};
