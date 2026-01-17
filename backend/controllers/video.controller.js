// controllers/videoGuide.controller.js
import { Op } from "sequelize";
import VideoGuide from "../models/video.model.js";
import { getVideoDetails } from "../utils/youtube.util.js";

export const createVideoGuide = async (req, res) => {
  try {
    const { title, youtubeLink, category, description } = req.body;
    const userId = req.user.id;
    const videoId = youtubeLink
      ? youtubeLink.split("v=")[1]?.substring(0, 11)
      : null;

    if (!title || !youtubeLink || !videoId) {
      return res
        .status(400)
        .json({ message: "Title, YouTube link, and video ID are required." });
    }

    const existing = await VideoGuide.findOne({ where: { videoId } });
    if (existing)
      return res.status(409).json({ message: "Video already exists." });

    const videoDetails = await getVideoDetails(videoId);
    const channelAvatarUrl = videoDetails?.channelAvatarUrl || null;

    const finalTitle = title.trim() || videoDetails?.title;
    const finalDescription = description?.trim() || videoDetails?.description;
    const newStatus =
      req.user && req.user.role === "admin" ? "approved" : "pending";
    const newVideo = await VideoGuide.create({
      title: finalTitle,
      youtubeLink,
      videoId,
      description: finalDescription,
      category,
      submittedBy: userId,
      channelAvatarUrl,
      status: newStatus,
    });

    res
      .status(201)
      .json({ message: "Video guide created successfully.", video: newVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating video guide." });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const where = req.user.isAdmin ? {} : { submittedBy: req.user.id };

    const { rows: videos, count: total } = await VideoGuide.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.status(200).json({
      message: "all video fetched successfully.",
      data: videos, // Changed from 'video' to 'data' to match user's implied structure or similar structures
      pagination: {
        total_items: total,
        current_page: page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ message: "Error fetching videos." });
  }
};

export const approveVideo = async (req, res) => {
  try {
    const { ids } = req.body; // Expect array of ids

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids must be a non-empty array" });
    }

    const updatedCount = await VideoGuide.update(
      { status: "approved" },
      {
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      }
    );

    res.json({
      message: "Videos approved.",
      updatedCount,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

export const rejectVideo = async (req, res) => {
  try {
    const { ids } = req.body; // expect array of ids

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids must be a non-empty array" });
    }

    const updatedCount = await VideoGuide.update(
      { status: "rejected" },
      {
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      }
    );

    res.json({
      message: "Videos rejected successfully.",
      updatedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reject videos",
      error: error.message,
    });
  }
};

export const deleteVideoGuide = async (req, res) => {
  try {
    const { ids } = req.body; // array of ids

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids must be a non-empty array" });
    }

    const deletedCount = await VideoGuide.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    res.json({
      message: "Videos deleted successfully.",
      deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete videos",
      error: error.message,
    });
  }
};

export const deleteSelectedVideos = async (req, res) => {
  const { ids } = req.body;
  if (!ids || !ids.length)
    return res.status(400).json({ message: "No videos selected." });
  const count = await VideoGuide.destroy({ where: { id: ids } });
  res.json({ message: `${count} videos deleted.` });
};

export const getActiveVideoGuides = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { rows: videos, count: total } = await VideoGuide.findAndCountAll({
      where: { isActive: true, status: "approved" },
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset,
    });

    res.status(200).json({
      message: "Active video guides fetched successfully",
      videos,
      pagination: {
        total_items: total,
        current_page: page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching active video guides:", error);
    res.status(500).json({
      message: "Failed to load video guides.",
      videos: [],
      pagination: {
        total_items: 0,
        current_page: 1,
        totalPages: 0,
        pageSize: 0,
      },
    });
  }
};

// 🧭 Admin route: Toggle 'isActive' status
export const toggleVideoActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await VideoGuide.findByPk(id);
    if (!video) return res.status(404).json({ message: "Video not found." });

    video.isActive = !video.isActive;
    await video.save();

    res.status(200).json({
      message: `Video is now ${video.isActive ? "active" : "inactive"}.`,
      video,
    });
  } catch (error) {
    console.error("Error toggling active status:", error);
    res.status(500).json({ message: "Error updating video status." });
  }
};
