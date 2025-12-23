import CommunityChat from "../models/community_chat.model.js"
import User from "../models/user.model.js"

export function setupChatSocket(io) {
  const chatNamespace = io.of("/api/community/chat")

  chatNamespace.on("connection", (socket) => {
    console.log(`[Chat] User connected: ${socket.id}`)

    const userId = socket.handshake.auth?.userId
    if (userId) {
      socket.data.userId = userId
      socket.join(`user-${userId}`)
      console.log(`[Chat] User ${userId} authenticated`)
    }

    socket.on("join-room", (roomId, callback) => {
      if (!roomId) {
        return callback?.({ success: false, error: "Room ID required" })
      }

      socket.join(roomId)
      console.log(`[Chat] ${socket.id} joined room ${roomId}`)

      chatNamespace.to(roomId).emit("user-joined", {
        roomId,
        timestamp: new Date(),
      })

      callback?.({ success: true })
    })

    socket.on("send-message", async (data, callback) => {
      try {
        const { message, roomId } = data
        const userId = socket.data.userId

        if (!userId) {
          return callback({ success: false, error: "User not authenticated" })
        }

        if (!roomId) {
          return callback({ success: false, error: "Room ID required" })
        }

        if (!message || message.trim().length === 0) {
          return callback({ success: false, error: "Message cannot be empty" })
        }

        if (message.length > 5000) {
          return callback({
            success: false,
            error: "Message is too long (max 5000 characters)",
          })
        }

        const newMessage = await CommunityChat.create({
          user_id: userId,
          room_id: roomId,
          message: message.trim(),
        })

        const messageWithUser = await CommunityChat.findByPk(newMessage.id, {
          include: [
            {
              model: User,
              attributes: ["id", "userid", "name"],
            },
          ],
        })

        chatNamespace.to(roomId).emit("message-received", {
          id: messageWithUser.id,
          room_id: roomId,
          user_id: messageWithUser.user_id,
          message: messageWithUser.message,
          edited_at: messageWithUser.edited_at,
          is_deleted: messageWithUser.is_deleted,
          created_at: messageWithUser.created_at,
          updated_at: messageWithUser.updated_at,
          User: messageWithUser.User,
        })

        callback({
          success: true,
          data: messageWithUser,
        })
      } catch (error) {
        console.error("[Chat] Error sending message:", error)
        callback({ success: false, error: "Failed to send message" })
      }
    })

    socket.on("edit-message", async (data, callback) => {
      try {
        const { messageId, message, roomId } = data
        const userId = socket.data.userId

        if (!userId || !roomId) {
          return callback({ success: false, error: "Invalid request" })
        }

        const chatMessage = await CommunityChat.findByPk(messageId)

        if (!chatMessage || chatMessage.user_id !== userId) {
          return callback({ success: false, error: "Not allowed" })
        }

        await chatMessage.update({
          message: message.trim(),
          edited_at: new Date(),
        })

        const updatedMessage = await CommunityChat.findByPk(messageId, {
          include: [
            {
              model: User,
              attributes: ["id", "userid", "name"],
            },
          ],
        })

        chatNamespace.to(roomId).emit("message-edited", updatedMessage)

        callback({ success: true, data: updatedMessage })
      } catch (error) {
        console.error("[Chat] Error editing message:", error)
        callback({ success: false, error: "Failed to edit message" })
      }
    })

    socket.on("delete-message", async (data, callback) => {
      try {
        const { messageId, roomId } = data
        const userId = socket.data.userId

        if (!userId || !roomId) {
          return callback({ success: false, error: "Invalid request" })
        }

        const chatMessage = await CommunityChat.findByPk(messageId)

        if (!chatMessage || chatMessage.user_id !== userId) {
          return callback({ success: false, error: "Not allowed" })
        }

        await chatMessage.update({
          is_deleted: true,
          message: "[Message deleted]",
        })

        chatNamespace.to(roomId).emit("message-deleted", {
          id: messageId,
        })

        callback({ success: true })
      } catch (error) {
        console.error("[Chat] Error deleting message:", error)
        callback({ success: false, error: "Failed to delete message" })
      }
    })

    socket.on("typing", async (data) => {
      try {
        const { roomId, isTyping } = data
        const userId = socket.data.userId
        if (!userId || !roomId) return

        const user = await User.findByPk(userId, {
          attributes: ["id", "userid", "name"],
        })

        if (user) {
          chatNamespace.to(roomId).emit("user-typing", {
            roomId,
            user,
            isTyping,
          })
        }
      } catch (error) {
        console.error("[Chat] Typing error:", error)
      }
    })

    socket.on("load-messages", async (data, callback) => {
      try {
        const { roomId, page = 1, limit = 50 } = data
        const offset = (page - 1) * limit

        const { count, rows } = await CommunityChat.findAndCountAll({
          where: { room_id: roomId, is_deleted: false },
          include: [
            {
              model: User,
              attributes: ["id", "userid", "name"],
            },
          ],
          order: [["created_at", "ASC"]],
          limit,
          offset,
        })

        callback({
          success: true,
          data: rows,
          pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
          },
        })
      } catch (error) {
        console.error("[Chat] Load messages error:", error)
        callback({ success: false, error: "Failed to load messages" })
      }
    })

    socket.on("disconnect", () => {
      console.log(`[Chat] User disconnected: ${socket.id}`)
    })

    socket.on("error", (error) => {
      console.error(`[Chat] Socket error:`, error)
    })
  })
}
