import express from "express"
import { add_comment_to_forum, create_community_forum, delete_comment, dislike_community, get_community_form_by_id, get_community_forum, like_community} from "../controllers/community_forum.controller"
import { protectRoute, supportOrAdminRoute } from "../middleware/auth.middleware"

const router = express.Router()

router.get("/get_all_community_forums", get_community_forum)
router.get("/get_communtiy_form_by_id/:id", get_community_form_by_id)
router.post("/add_community_forum", supportOrAdminRoute, create_community_forum)
router.delete("/delete_comment", supportOrAdminRoute, delete_comment)
router.post("/add_comment", protectRoute, add_comment_to_forum)
router.put("/upvote", protectRoute, like_community)
router.put("/downvote", protectRoute, dislike_community)
router.delete("/comment", protectRoute, delete_comment)