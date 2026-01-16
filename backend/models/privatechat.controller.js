import Conversation from "./conversation.model.js";
import ConversationParticipant from "./conversation_participant.model.js";
import User from "./user.model.js";
import { Op, fn, col, literal } from "sequelize";

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
