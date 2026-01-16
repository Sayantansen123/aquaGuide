import Conversation from "../models/conversation.model.js";
import ConversationParticipant from "../models/conversation_participant.model.js";
import PersonalMessage from "../models/personal_message.model.js";
import User from "../models/user.model.js";

export function setupPrivateChat(io) {
  const chat = io.of("/api/chat/private");

  chat.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.userId = payload.id;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  chat.on("connection", (socket) => {
    const userId = socket.data.userId;

    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("send-private-message", async ({ conversationId, message }) => {
      try {
        // Ensure user is a participant
        const participant = await ConversationParticipant.findOne({
          where: { conversation_id: conversationId, user_id: userId },
        });
        if (!participant)
          return socket.emit("error", "You are not in this conversation");

        const msg = await PersonalMessage.create({
          conversation_id: conversationId,
          sender_id: userId,
          message,
        });

        const fullMsg = await PersonalMessage.findByPk(msg.id, {
          include: { model: User, as: "sender", attributes: ["id", "name"] },
        });

        chat.to(conversationId).emit("private-message-received", {
          id: fullMsg.id,
          community_id: fullMsg.conversation_id,
          message: fullMsg.message,
          created_at: fullMsg.created_at,
          sender: fullMsg.sender,
        });
      } catch (err) {
        console.error(err);
        socket.emit("error", "Failed to send message");
      }
    });
  });
}
