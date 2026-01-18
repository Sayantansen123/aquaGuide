import express from "express";
import { joinChatAsSupport, startChat, takeoverChat } from "../controllers/support_chat.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();


// USER starts a chat
router.post("/chat/start", protectRoute, startChat);

// ADMIN takes over a chat
router.post("/chat/takeover/:chatId", protectRoute, takeoverChat);

export default router;
