import Conversation from "../models/conversation.model.js";
import PersonalMessage from "../models/personal_message.model.js";
import User from "../models/user.model.js";
import { Op } from "sequelize";

// POST /api/conversations/private
export const getOrCreatePrivateConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.body;

    if (!targetUserId)
      return res.status(400).json({ error: "targetUserId required" });

    // Step 1: find conversation id that has BOTH users
    const convoIds = await ConversationParticipant.findAll({
      where: { user_id: { [Op.in]: [userId, targetUserId] } },
      attributes: ["conversation_id"],
      group: ["conversation_id"],
      having: literal("COUNT(DISTINCT user_id) = 2"),
    });

    let convo;

    if (convoIds.length > 0) {
      // Fetch the conversation with participants
      convo = await Conversation.findByPk(convoIds[0].conversation_id, {
        include: [
          {
            model: User,
            as: "users",
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        ],
      });

      return res.json(convo);
    }

    // Step 2: Create new conversation if not exists
    const newConvo = await Conversation.create({ type: "private" });

    await ConversationParticipant.bulkCreate([
      { conversation_id: newConvo.id, user_id: userId },
      { conversation_id: newConvo.id, user_id: targetUserId },
    ]);

    // Fetch newly created conversation with users
    const fullConvo = await Conversation.findByPk(newConvo.id, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    return res.json(fullConvo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getPrivateMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // Verify user is part of conversation
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (
      conversation.participant1_id !== req.user.id &&
      conversation.participant2_id !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to conversation",
      });
    }

    const { count, rows: messages } = await PersonalMessage.findAndCountAll({
      where: {
        conversation_id: conversationId,
        is_deleted: false,
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "userid"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: messages.reverse(), // Oldest to newest
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        totalItems: count,
      },
    });
  } catch (error) {
    console.error("Error fetching private messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

export const getPrivateConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [{ participant1_id: userId }, { participant2_id: userId }],
      },
      include: [
        {
          model: User,
          as: "participant1",
          attributes: ["id", "name", "userid"],
        },
        {
          model: User,
          as: "participant2",
          attributes: ["id", "name", "userid"],
        },
      ],
      order: [["updated_at", "DESC"]],
    });

    // Get last message for each conversation
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await PersonalMessage.findOne({
          where: {
            conversation_id: conv.id,
            is_deleted: false,
          },
          order: [["created_at", "DESC"]],
          include: [
            {
              model: User,
              as: "sender",
              attributes: ["id", "name", "userid"],
            },
          ],
        });

        const otherUser =
          conv.participant1_id === userId ? conv.participant2 : conv.participant1;

        return {
          id: conv.id,
          participant1_id: conv.participant1_id,
          participant2_id: conv.participant2_id,
          created_at: conv.created_at,
          updated_at: conv.updated_at,
          otherUser: {
            id: otherUser.id,
            name: otherUser.name,
            userid: otherUser.userid,
          },
          lastMessage: lastMessage ? lastMessage.toJSON() : null,
        };
      })
    );

    res.json({
      success: true,
      data: conversationsWithLastMessage,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
};
