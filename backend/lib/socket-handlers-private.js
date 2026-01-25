import jwt from "jsonwebtoken";
import Conversation from "../models/conversation.model.js";
import ConversationParticipant from "../models/conversation_participant.model.js";
import PersonalMessage from "../models/personal_message.model.js";
import User from "../models/user.model.js";

export function setupPrivateChat(io) {
  const chat = io.of("/api/chat/private");
  
  console.log("Private chat namespace initialized");

  chat.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log("Auth middleware - Token present:", !!token);
    
    if (!token) {
      console.error("No token provided");
      return next(new Error("Authentication error"));
    }
    
    try {
      // Use ACCESS_TOKEN_SECRET to match the auth middleware
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("Decoded payload:", payload);
      
      // Use userId to match the auth middleware payload structure
      socket.data.userId = payload.userId || payload.id;
      console.log("User authenticated:", socket.data.userId);
      next();
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      console.error("Error details:", err);
      next(new Error("Authentication error"));
    }
  });

  chat.on("connection", (socket) => {
    const userId = socket.data.userId;
    console.log(`User ${userId} connected to private chat (socket: ${socket.id})`);

    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${userId} joined conversation ${conversationId}`);
    });

    socket.on("send-private-message", async ({ conversationId, message }, callback) => {
      console.log(`Message received from ${userId} to conversation ${conversationId}`);
      console.log(`Message content: "${message}"`);
      
      try {
        // Verify user is participant in this conversation
        const participant = await ConversationParticipant.findOne({
          where: {
            conversation_id: conversationId,
            user_id: userId,
          },
        });

        if (!participant) {
          const error = "You are not in this conversation";
          console.error("Error: ", error);
          socket.emit("error", error);
          if (callback) callback({ success: false, message: error });
          return;
        }

        console.log("User is participant");

        // Create message
        const msg = await PersonalMessage.create({
          conversation_id: conversationId,
          sender_id: userId,
          message,
        });

        console.log("Message saved to DB:", msg.id);

        // Update conversation last message time
        await Conversation.update(
          { last_message_at: new Date() },
          { where: { id: conversationId } }
        );

        // Fetch with sender details
        const fullMsg = await PersonalMessage.findByPk(msg.id, {
          include: { 
            model: User, 
            as: "sender", 
            attributes: ["id", "name", "userid"] 
          },
        });

        const messageData = {
          id: fullMsg.id,
          conversation_id: fullMsg.conversation_id,
          sender_id: fullMsg.sender_id,
          message: fullMsg.message,
          created_at: fullMsg.created_at,
          updated_at: fullMsg.updated_at,
          is_deleted: fullMsg.is_deleted,
          sender: fullMsg.sender,
        };

        console.log("Broadcasting message to room:", conversationId);
        
        // Emit to conversation room
        chat.to(conversationId).emit("private-message-received", messageData);

        console.log("Message sent successfully");
        if (callback) callback({ success: true, message: "Message sent" });
      } catch (err) {
        console.error("Error sending private message:", err);
        console.error("Stack:", err.stack);
        socket.emit("error", "Failed to send message");
        if (callback) callback({ success: false, message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected from private chat`);
    });
  });
}
