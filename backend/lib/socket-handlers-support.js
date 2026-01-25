import SupportChat from "../models/support_chat.model.js";
import SupportChatMessage from "../models/support_chat_message.model.js";
import SupportMember from "../models/support_member.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const setupSupportChat = (io) => {
    const supportNamespace = io.of("/support");

    supportNamespace.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }
        try {
            const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            socket.data.userId = payload.userId || payload.id;
            next();
        } catch (err) {
            next(new Error("Authentication error"));
        }
    });

    supportNamespace.on("connection", (socket) => {
        console.log(`[Support Socket] User connected: ${socket.id}`);

        socket.on("join_support_chat", async ({ chatId, userId }) => {
            try {
                const chat = await SupportChat.findByPk(chatId);
                if (!chat) {
                    socket.emit("error", { message: "Chat not found" });
                    return;
                }

                // Check if user is the initiator or a support member
                const isInitiator = chat.initiated_by === userId;
                const isSupportMember = await SupportMember.findOne({
                    where: { support_chat_id: chatId, user_id: userId },
                });

                console.log(`[DEBUG] Join chat ${chatId} by user ${userId}. IsInitiator: ${isInitiator}, IsSupportMember: ${!!isSupportMember}`);

                if (!(isInitiator || isSupportMember)) {
                    socket.emit("support_error", { message: "Unauthorized access to chat" });
                    return;
                }

                socket.join(`support_chat_${chatId}`);
                console.log(`[Support Socket] User ${userId} joined chat ${chatId}`);

                // Notify others in the room
                socket.to(`support_chat_${chatId}`).emit("user_joined", { userId });
            } catch (error) {
                console.error("Error joining support chat:", error);
                socket.emit("error", { message: "Failed to join chat" });
            }
        });

socket.on("send_support_message", async ({ chatId, senderId, message }) => {
  try {
    const chat = await SupportChat.findByPk(chatId);
    if (!chat) {
      socket.emit("error", { message: "Chat not found" });
      return;
    }

    const isInitiator = chat.initiated_by === senderId;

    const member = await SupportMember.findOne({
      where: { support_chat_id: chatId, user_id: senderId },
    });

    console.log(
      `[DEBUG] Msg from ${senderId} in chat ${chatId}. IsInitiator: ${isInitiator}, Member: ${!!member}, Locked: ${member?.is_locked}`
    );

    /**
     * 🔒 RULES
     * - Initiator (user) → always allowed
     * - Admin/Support → MUST be SupportMember AND unlocked
     */
    if (!isInitiator) {
      if (!member) {
        socket.emit("support_error", {
          message: "You must take over the chat to send messages",
        });
        return;
      }

      if (member.is_locked) {
        socket.emit("support_error", {
          message: "Chat is locked by another agent",
        });
        return;
      }
    }

    // ✅ Save message
    const newMessage = await SupportChatMessage.create({
      support_chat_id: chatId,
      sender_id: senderId,
      message,
    });

    // ✅ Broadcast
    supportNamespace
      .to(`support_chat_${chatId}`)
      .emit("receive_support_message", newMessage);

  } catch (error) {
    console.error("Error sending support message:", error);
    socket.emit("error", { message: "Failed to send message" });
  }
});

        socket.on("disconnect", () => {
            console.log(`[Support Socket] User disconnected: ${socket.id}`);
        });
    });
};

export const emitChatResolved = (io, chatId) => {
    io.of("/support")
        .to(`support_chat_${chatId}`)
        .emit("support:chat_resolved", { chatId });
};
