import Conversation from "../models/conversation.model.js";
import ConversationParticipant from "../models/conversation_participant.model.js";
import PersonalMessage from "../models/personal_message.model.js";
import User from "../models/user.model.js";
import { Op } from "sequelize";

export const getOrCreatePrivateConversation = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const userId = req.user.id;

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Target user ID is required",
      });
    }

    if (targetUserId === userId) {
      return res.status(400).json({
        success: false,
        message: "Cannot create conversation with yourself",
      });
    }

    // Find existing conversation where both users are participants
    const existingConversations = await ConversationParticipant.findAll({
      where: {
        user_id: userId,
      },
      attributes: ["conversation_id"],
    });

    const conversationIds = existingConversations.map((cp) => cp.conversation_id);

    if (conversationIds.length > 0) {
      const sharedConversation = await ConversationParticipant.findOne({
        where: {
          conversation_id: { [Op.in]: conversationIds },
          user_id: targetUserId,
        },
        include: [
          {
            model: Conversation,
            as: "conversation",
            where: { type: "private" },
          },
        ],
      });

      if (sharedConversation) {
        return res.json({
          success: true,
          conversation: sharedConversation.conversation,
          message: "Conversation already exists",
        });
      }
    }

    // Create new conversation
    const conversation = await Conversation.create({
      type: "private",
      last_message_at: new Date(),
    });

    // Add both participants
    await ConversationParticipant.bulkCreate([
      {
        conversation_id: conversation.id,
        user_id: userId,
      },
      {
        conversation_id: conversation.id,
        user_id: targetUserId,
      },
    ]);

    res.json({
      success: true,
      conversation,
      message: "Conversation created",
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create conversation",
    });
  }
};

export const getPrivateMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // Verify user is part of conversation
    const participant = await ConversationParticipant.findOne({
      where: {
        conversation_id: conversationId,
        user_id: req.user.id,
      },
    });

    if (!participant) {
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

    // Get all conversations user is part of
    const userConversations = await ConversationParticipant.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: Conversation,
          as: "conversation",
          where: { type: "private" },
        },
      ],
    });

    const conversationIds = userConversations.map((uc) => uc.conversation_id);

    if (conversationIds.length === 0) {
      return res.json({
        success: true,
        data: [],
      });
    }

    // Get all participants for these conversations
    const allParticipants = await ConversationParticipant.findAll({
      where: {
        conversation_id: { [Op.in]: conversationIds },
        user_id: { [Op.ne]: userId }, // Exclude current user
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "userid"],
        },
        {
          model: Conversation,
          as: "conversation",
        },
      ],
    });

    // Get last message for each conversation
    const conversationsWithData = await Promise.all(
      allParticipants.map(async (participant) => {
        const lastMessage = await PersonalMessage.findOne({
          where: {
            conversation_id: participant.conversation_id,
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

        return {
          id: participant.conversation.id,
          type: participant.conversation.type,
          created_at: participant.conversation.createdAt,
          updated_at: participant.conversation.updatedAt,
          last_message_at: participant.conversation.last_message_at,
          otherUser: {
            id: participant.user.id,
            name: participant.user.name,
            userid: participant.user.userid,
          },
          lastMessage: lastMessage ? lastMessage.toJSON() : null,
        };
      })
    );

    // Sort by last message time
    conversationsWithData.sort((a, b) => {
      const timeA = a.last_message_at || a.created_at;
      const timeB = b.last_message_at || b.created_at;
      return new Date(timeB) - new Date(timeA);
    });

    res.json({
      success: true,
      data: conversationsWithData,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
};
