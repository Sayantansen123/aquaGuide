import { fn, col } from "sequelize";
import SpeciesDictionary from "../models/speciesDictionary.model.js";
import VideoGuide from "../models/video.model.js";
import TextModel from "../models/text.model.js";
import CommunityForum from "../models/community_forum_model.js";
import Community from "../models/community_chat.model.js";
import FAQ from "../models/faq.model.js";
import User from "../models/user.model.js";

export const getAdminDashboardStats = async (req, res) => {
  try {
    /* =======================
       SPECIES
    ======================= */
    const totalSpecies = await SpeciesDictionary.count();

    const speciesStatusRaw = await SpeciesDictionary.findAll({
      attributes: ["status", [fn("COUNT", col("status")), "count"]],
      group: ["status"],
    });

    const speciesStatus = { draft: 0, published: 0, archived: 0 };
    speciesStatusRaw.forEach((s) => {
      speciesStatus[s.status] = Number(s.get("count"));
    });

    /* =======================
       VIDEO
    ======================= */
    const totalVideo = await VideoGuide.count();

    const videoStatusRaw = await VideoGuide.findAll({
      attributes: ["status", [fn("COUNT", col("status")), "count"]],
      group: ["status"],
    });

    const videoTypes = { approved: 0, pending: 0, rejected: 0 };
    videoStatusRaw.forEach((v) => {
      videoTypes[v.status] = Number(v.get("count"));
    });

    /* =======================
       TEXT GUIDE
    ======================= */
    const totalText = await TextModel.count();

    const textStatusRaw = await TextModel.findAll({
      attributes: ["status", [fn("COUNT", col("status")), "count"]],
      group: ["status"],
    });

    const textTypes = { pending: 0, approved: 0, rejected: 0 };
    textStatusRaw.forEach((t) => {
      textTypes[t.status] = Number(t.get("count"));
    });

    /* =======================
       COMMUNITY FORUM
    ======================= */
    const totalForum = await CommunityForum.count();

    const forumByRoleRaw = await CommunityForum.findAll({
      attributes: [
        [fn("COUNT", col("CommunityForum.id")), "count"],
        [col("User.role"), "role"],
      ],
      include: [
        {
          model: User,
          attributes: [],
          as: "User",
        },
      ],
      group: ["User.role"],
    });

    const forumCounts = { admin: 0, support: 0, user: 0 };
    forumByRoleRaw.forEach((f) => {
      forumCounts[f.get("role")] = Number(f.get("count"));
    });

    /* =======================
       COMMUNITY
    ======================= */
    const totalCommunity = await Community.count();
    const privateCount = await Community.count({ where: { is_private: true } });
    const publicCount = await Community.count({ where: { is_private: false } });

    /* =======================
       FAQ  ✅ NEW
    ======================= */
    const totalFaq = await FAQ.count();

    /* =======================
       FINAL RESPONSE
    ======================= */
    return res.json({
      species: {
        totalSpecies,
        statusCount: speciesStatus,
      },
      video: {
        totalVideo,
        typesOfVideo: videoTypes,
      },
      forum: {
        totalForum,
        createdByAdmin: forumCounts.admin,
        createdBySupport: forumCounts.support,
        createdByUser: forumCounts.user,
      },
      textGuide: {
        totalText,
        typesOfText: textTypes,
      },
      community: {
        totalCommunity,
        privateCount,
        publicCount,
      },
      faq: {
        totalFaq,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
};
