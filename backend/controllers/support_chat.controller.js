import SupportChat from "../models/support_chat.model";
import SupportMember from "../models/support_member.model";

export const startChat = async (req, res) => {
    try {
        const user = req.user;
        const {support_user_id} = req.body;
        if (user.role !== 'user') {
            return res.status(403).json({ error: "Only users can start support chats" });
        }

        const newChat = await SupportChat.create({
            initiated_by: user.id,
        });

        const supportMember = await SupportMember.create({
            support_chat_id: newChat.id,
            user_id: support_user_id,
            is_locked: false,
        });

        res.status(201).json({ "message": "Support chat started successfully", "chat": newChat,
             "support_member": supportMember });
    }
    catch (error) {
        console.error("Error starting support chat:", error);
        res.status(500).json({ error: "Failed to start support chat" });
    }
}


export const takeOver = async (req, res) =>{
    
}