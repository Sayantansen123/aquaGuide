import express from "express";
import { getOrCreatePrivateConversation } from "../models/privatechat.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, getOrCreatePrivateConversation);

export default router;
