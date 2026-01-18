import sequelize from "../lib/db.js";
import SupportChat from "../models/support_chat.model.js"
import SupportMember from "../models/support_member.model.js";
import User from "../models/user.model.js";

export const startChat = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'user') {
            return res.status(403).json({ error: "Only users can start support chats" });
        }

        const newChat = await SupportChat.create({
            initiated_by: user.id,
        });
        const admins = await User.findAll({ where: { role: 'admin' } });
        for (const admin of admins) {
            await SupportMember.create({
                user_id: admin.id,
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

    // Lock ALL existing support members
    await SupportMember.update(
      { is_locked: true },
      { where: {}, transaction }
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
      active_handler: adminId,
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
    
        if (role !== "user"){
            return res.status(403).json({ message: "Only users can resolve chats" });
        }
        const chat = await SupportChat.findByPk(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        chat.is_resolved = true;
        await chat.save();
        return res.json({ success: true, message: "Chat resolved" });
} catch (error) {
    console.error("Error resolving chat:", error.message);
    res.status(500).json({ error: "Failed to resolve chat" });
}
};
export const acceptChat = async (req, res) => {
try {
        const {chatId} = req.params;
        const user = req.user;
        if (user.role === "user") {
            return res.status(403).json({ message: "Only support and admins can accept chats" });
        }
        const chat = await SupportChat.findByPk(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        await SupportMember.update(
            { is_locked: false },
            { where: { user_id: user.id, support_chat_id: chatId } }   
        );
} catch (error) {
    console.error("Error accepting chat:", error.message);
    res.status(500).json({ error: "Failed to accept chat" });
}
}