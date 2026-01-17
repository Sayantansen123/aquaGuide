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
        const admins = await User.findAll({ where: { role: 'admin' } });
        for (const admin of admins) {
            await SupportMember.create({
                support_chat_id: newChat.id,
                user_id: admin.id,
                is_locked: true,
            });
        }

        res.status(201).json({ "message": "Support chat started successfully", "chat": newChat,
             "support_member": supportMember });
    }
    catch (error) {
        console.error("Error starting support chat:", error);
        res.status(500).json({ error: "Failed to start support chat" });
    }
}


export const takeOver = async (req, res) =>{
    try{
        const user = req.user;
        const {chat_id} = req.params;
        if(user.role !== 'admin'){
            return res.status(403).json({ error: "Only admin members can take over support chats" });
        }
        const supportChat = await SupportChat.findByPk(chat_id);
        if(!supportChat){
            return res.status(404).json({ error: "Support chat not found" });
        }
        const supportMember = await SupportMember.findOne({
            where: { support_chat_id: chat_id, user_id: user.id }
        })
        supportMember.is_locked = false;
        await supportMember.save();
        await SupportMember.update(
            { is_locked: true },
            { where: {
                support_chat_id: chat_id,
                user_id: { [Op.ne]: user.id }
            },
        }
        );  
        res.status(200).json({ message: "Support chat taken over successfully", supportMember });
    }
    catch (error) {
        console.error("Error taking over support chat:", error);
        res.status(500).json({ error: "Failed to take over support chat" });
    }
}