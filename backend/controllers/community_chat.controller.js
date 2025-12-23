import CommunityChat from "../models/community_chat.model.js";
import User from "../models/user.model.js";
import sequelize from "../lib/db.js";

/**
 * REST API Controller for Community Chat
 * Note: Real-time messaging is handled via WebSockets in socket-handlers.js
 * These endpoints are for fetching history and statistics
 */

// Get all chat messages with pagination
export const getAllMessages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;

        const { count, rows } = await CommunityChat.findAndCountAll({
            where: { is_deleted: false },
            include: [
                {
                    model: User,
                    attributes: ["id", "userid", "name"],
                },
            ],
            order: [["created_at", "ASC"]],
            limit,
            offset,
        });

        res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};

// Get recent messages
export const getRecentMessages = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;

        const messages = await CommunityChat.findAll({
            where: { is_deleted: false },
            include: [
                {
                    model: User,
                    attributes: ["id", "userid", "name"],
                },
            ],
            order: [["created_at", "DESC"]],
            limit,
        });

        res.status(200).json({
            success: true,
            data: messages.reverse(),
        });
    } catch (error) {
        console.error("Error fetching recent messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};

// Get user's messages
export const getUserMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;

        const { count, rows } = await CommunityChat.findAndCountAll({
            where: { user_id: userId, is_deleted: false },
            include: [
                {
                    model: User,
                    attributes: ["id", "userid", "name"],
                },
            ],
            order: [["created_at", "ASC"]],
            limit,
            offset,
        });

        res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching user messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};

// Get messages statistics
export const getChatStatistics = async (req, res) => {
    try {
        const totalMessages = await CommunityChat.count({
            where: { is_deleted: false },
        });

        const totalUsers = await CommunityChat.count({
            distinct: true,
            col: "user_id",
            where: { is_deleted: false },
        });

        const messagesPerDay = await CommunityChat.findAll({
            attributes: [
                [sequelize.fn("DATE", sequelize.col("created_at")), "date"],
                [sequelize.fn("COUNT", sequelize.col("id")), "count"],
            ],
            where: { is_deleted: false },
            group: [sequelize.fn("DATE", sequelize.col("created_at"))],
            order: [[sequelize.fn("DATE", sequelize.col("created_at")), "DESC"]],
            raw: true,
            limit: 30,
        });

        res.status(200).json({
            success: true,
            data: {
                totalMessages,
                totalUsers,
                messagesPerDay,
            },
        });
    } catch (error) {
        console.error("Error fetching chat statistics:", error);
        res.status(500).json({ error: "Failed to fetch statistics" });
    }
};
