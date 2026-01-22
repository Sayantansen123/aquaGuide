import sequelize from "../lib/db.js";
import SupportChat from "../models/support_chat.model.js"
import SupportChatMessage from "../models/support_chat_message.model.js";
import SupportMember from "../models/support_member.model.js";
import User from "../models/user.model.js";
import { emitChatResolved } from "../lib/socket-handlers-support.js";

export const startChat = async (req, res) => {
    try {
        const user = req.user;
        const { description } = req.body;
        if (user.role !== 'user') {
            return res.status(403).json({ error: "Only users can start support chats" });
        }

        const newChat = await SupportChat.create({
            initiated_by: user.id,
            description: description,
            is_accepted: false,
            status: "active",
        });
        // Add both admins and support users as SupportMembers
        const supportStaff = await User.findAll({
            where: {
                role: ['admin', 'support']
            }
        });
        for (const staff of supportStaff) {
            await SupportMember.create({
                user_id: staff.id,
                description: description,
                support_chat_id: newChat.id,
                is_locked: true,
            });
        }
        res.status(201).json({ success: true, chat: newChat });
    }
    catch (error) {
        console.error("Error starting support chat:", error);
        res.status(500).json({ error: "Failed to start support chat" });
    }
}



export const takeoverChat = async (req, res) => {
    const { chatId } = req.params;
    const adminId = req.user.id;
    const role = req.user.role;

    if (role !== "admin") {
        return res.status(403).json({ message: "Only admin can takeover chats" });
    }

    const transaction = await sequelize.transaction();

    try {
        const chat = await SupportChat.findByPk(chatId, { transaction });
        if (!chat) {
            await transaction.rollback();
            return res.status(404).json({ message: "Chat not found" });
        }

        const member = await SupportMember.findOne({
            where: { support_chat_id: chatId, is_locked: false },
            transaction,
        });

        const user = await User.findByPk(member.user_id);
        if (user.role === "admin") {
            const current = await User.findByPk(adminId);
            if (current.created_at < user.created_at) {
                await transaction.rollback();
                return res.status(403).json({ message: "Another admin is already active in this chat" });
            }
        }

        // Lock ALL existing support members
        await SupportMember.update(
            { is_locked: true },
            { where: { support_chat_id: chatId }, transaction }
        );


        // Ensure admin exists as SupportMember
        const [adminMember] = await SupportMember.findOrCreate({
            where: { user_id: adminId },
            defaults: { is_locked: false },
            transaction,
        });

        // Unlock admin
        adminMember.is_locked = false;
        await adminMember.save({ transaction });

        await transaction.commit();

        return res.json({
            success: true,
            message: "Chat takeover successful",
        });
    } catch (err) {
        await transaction.rollback();
        console.error(err);
        return res.status(500).json({ message: "Takeover failed" });
    }
};


export const resolveChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const role = req.user.role;

    // ✅ only admin & support can resolve
    if (!["admin", "support"].includes(role)) {
      return res.status(403).json({
        message: "Only admin or support can resolve chats",
      });
    }

    const chat = await SupportChat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // ✅ soft-resolve instead of delete
    await chat.update({ status: "resolved" });

    // 🔔 notify all connected users
    emitChatResolved(req.app.get("io"), chatId);

    return res.json({
        success: true,
        message: "Chat resolved successfully",
    });
  } catch (error) {
    console.error("Error resolving chat:", error);
    res.status(500).json({ error: "Failed to resolve chat" });
  }
};



export const acceptChat = async (req, res) => {
    try {
        console.log("Accept chat called");
        const { chatId } = req.params;
        const user = req.user;
        if (user.role === "user") {
            return res.status(403).json({ message: "Only support and admins can accept chats" });
        }
        const chat = await SupportChat.findByPk(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        if (chat.status === "resolved") {
            return res.status(400).json({ message: "Cannot accept a resolved chat" });
        }

        console.log("Chat found:", chat.id);
        if (chat.is_accepted) {
            return res.status(400).json({ message: "Chat already accepted" });
        }
        const supportMember = await SupportMember.findOne({
            where: {
                user_id: user.id,
                support_chat_id: chat.id,
            },
        });
        if (!supportMember) {
            await SupportMember.create({
                user_id: user.id,
                support_chat_id: chat.id,
                is_locked: false,
            });
            console.log("Support member created:", user.id);
        }
        else {
            supportMember.is_locked = false;
        }
        chat.is_accepted = true;

        const t = await sequelize.transaction();

        try {
            await chat.save({ transaction: t });
            await supportMember.save({ transaction: t });

            await t.commit();
        } catch (error) {
            await t.rollback();
            res.status(500).json({ error: "Failed to accept chat" });
            return;
        }
        console.log("Support member unlocked:", supportMember.id);
        res.status(200).json({ success: true, message: "Chat accepted" });
    } catch (error) {
        console.error("Error accepting chat:", error.message);
        res.status(500).json({ error: "Failed to accept chat" });
    }
}


export const getSupportChats = async (req, res) => {
  try {
    const user = req.user;

    const chats = await SupportChat.findAll({
      where: {
        is_accepted: true,
        status: "active", // ✅ belongs to SupportChat
      },
      include: [
        {
          model: SupportMember,
          as: "supportMembers",
          where: { user_id: user.id }, // ✅ only membership filter
          attributes: ["id", "user_id", "is_locked"],
        },
        {
          model: User,
          as: "initiator",
          attributes: ["id", "name", "userid"],
        },
      ],
      order: [["updated_at", "DESC"]],
    });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error("Error fetching support chats:", error);
    res.status(500).json({ error: "Failed to fetch support chats" });
  }
};

export const getSupportChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const user = req.user;
        const chat = await SupportChat.findByPk(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        const isInitiator = chat.initiated_by === user.id;
        const isSupportMember = await SupportMember.findOne({
            where: { support_chat_id: chatId, user_id: user.id },
        });
        if (!(isInitiator || isSupportMember)) {
            return res.status(403).json({ message: "Unauthorized access to chat messages" });
        }
        const messages = await SupportChatMessage.findAll({
            where: { support_chat_id: chatId },
            order: [['created_at', 'ASC']],
        });
        res.json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching support chat messages:", error);
        res.status(500).json({ error: "Failed to fetch support chat messages" });
    }
};


export const get_unaccepted_chats = async (req, res) => {
    try {
        const unacceptedChats = await SupportChat.findAll({
            where: {
                is_accepted: false,
                status: "active",
            },

        });
        res.json({ success: true, chats: unacceptedChats });
    } catch (error) {
        console.error("Error fetching unaccepted chats:", error);
        res.status(500).json({ error: "Failed to fetch unaccepted chats" });
    }
};


// Get user's own support chats
export const getUserChats = async (req, res) => {
    try {
        const userId = req.user.id;
        const chats = await SupportChat.findAll({
            where: { initiated_by: userId },
            order: [['created_at', 'DESC']],
        });
        res.json({ success: true, chats });
    } catch (error) {
        console.error("Error fetching user chats:", error);
        res.status(500).json({ error: "Failed to fetch user chats" });
    }
};