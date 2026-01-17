

export const startChat = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'user') {
            return res.status(403).json({ error: "Only users can start support chats" });
        }

        const newChat = await SupportChat.create({
            initiated_by: user.id,
        });

        res.status(201).json({ success: true, chat: newChat });
    }
    catch (error) {
        console.error("Error starting support chat:", error);
        res.status(500).json({ error: "Failed to start support chat" });
    }
}