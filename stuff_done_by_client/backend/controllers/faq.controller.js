import FAQ from "../models/faq.model.js";
import { Op, where, fn, col } from "sequelize";
import User from "../models/user.model.js";

export const addFAQ = async (req, res) => {
  try {
    const { question } = req.body;

    // Duplicate check (case-insensitive)
    const existing = await FAQ.findOne({
      where: {
        [Op.and]: [
          { question: { [Op.iLike]: question.trim() } },
        ],
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
      question,
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
    const { faqId } = req.params;
    const FAQs = await FAQ.findByPk(faqId);

  if (!FAQs) return res.status(404).json({ error: "Species not found" });

    await FAQs.destroy();
    return res.status(204).json({ message: "Species deleted successfully" });
  } catch (error) {
    console.error("Error deleting species:", error);
    return res.status(500).json({ error: "Failed to delete species" });
  }
};