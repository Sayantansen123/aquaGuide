import express from "express";
import { acceptChat, startChat, takeoverChat, getSupportChats, getSupportChatMessages } from "../controllers/support_chat.controller.js";
import {adminRoute, protectRoute, supportOrAdminRoute} from "../middleware/auth.middleware.js";

const router = express.Router();


// USER starts a chat
router.post("/chat/start", protectRoute, startChat);

// ADMIN takes over a chat
router.post("/chat/takeover/:chatId",protectRoute, adminRoute, takeoverChat);

router.put("/chat/accept_chat/:chatId",protectRoute, supportOrAdminRoute, acceptChat);

router.get("/chat/get_all_chats", protectRoute, supportOrAdminRoute, getSupportChats);

router.get("/chats/messages/:chatId", protectRoute, supportOrAdminRoute, getSupportChatMessages);

export default router;
