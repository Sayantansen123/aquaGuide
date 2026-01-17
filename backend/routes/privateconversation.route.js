import express from "express";
import {
  getOrCreatePrivateConversation,
  getPrivateMessages,
  getPrivateConversations,
} from "../controllers/privatechat.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, getOrCreatePrivateConversation);
router.get("/list", protectRoute, getPrivateConversations);
router.get("/:conversationId/messages", protectRoute, getPrivateMessages);

export default router;
