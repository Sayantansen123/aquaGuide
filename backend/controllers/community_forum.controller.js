import sequelize from "../lib/db.js";
import "../models/associations.js"; // ensure associations are initialized
import Comments from "../models/community_forum_comment.model.js";
import CommunityForum from "../models/community_forum_model.js";
import User from "../models/user.model.js";

export const create_community_forum = async (req, res) => {
  try {
    const creator_id = req.user.id;
    const { title, content } = req.body;
    const community = await CommunityForum.create({
      title,
      content,
      creator_id,
    });
    if (req.user.role == "admin") {
      community.status = "approved";
      await community.save();
    }
    res.status(201).json({
      message: "Community Created succesfully",
      data: community,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error failed to create Community Forum",
    });
  }
};

export const get_community_forum = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    const { count, rows } = await CommunityForum.findAndCountAll({
      include: [
        {
          model: Comments,
          as: "Comments", // must match association alias
          attributes: [],
          required: false,
        },
        {
          model: User,
          as: "User",
          attributes: [],
          required: true,
        },
      ],

      attributes: {
        include: [
          [
            sequelize.fn("COUNT", sequelize.col("Comments.id")),
            "Total_Comments",
          ],
          [sequelize.col("User.userid"), "Creator_Username"],
        ],
      },

      group: ["CommunityForum.id", "User.userid", "User.id"],
      subQuery: false,   // ensure the JOIN is included in the outer query
      offset,
      limit,
      order: [["createdAt", "DESC"]]
    });
    res.status(200).json({
      data: rows,
      pagination: {
        total_items: count,
        total_pages: Math.ceil(count / limit),
        page_size: limit,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Error occured fetching Community records please try again",
    });
  }
};

export const get_approved_community_forum = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const { count, rows } = await CommunityForum.findAndCountAll({
      where: { status: "approved" },

      include: [
        {
          model: Comments,
          as: "Comments", // must match association alias
          attributes: [],
          required: false,
        },
        {
          model: User,
          as: "User",
          attributes: [],
          required: true,
        },
      ],

      attributes: {
        include: [
          [
            sequelize.fn("COUNT", sequelize.col("Comments.id")),
            "Total_Comments",
          ],
          [sequelize.col("User.userid"), "Creator_Username"],
        ],
      },

      group: ["CommunityForum.id", "User.userid", "User.id"],
      subQuery: false,   // ensure the JOIN is included in the outer query
      offset,
      limit,
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json({
      data: rows,
      pagination: {
        total_items: count.length,
        total_pages: Math.ceil(count.length / limit),
        page_size: limit,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error occured fetching Community records please try again",
    });
  }
};

export const get_community_form_by_id = async (req, res) => {
  try {
    const { id } = req.params;
    const community_forum = await CommunityForum.findByPk(id, {
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userid"],
        },
      ],
      attributes: {
        include: [[sequelize.col("User.userid"), "Creator_Username"]]
      }
    });
    if (community_forum == null) {
      res.status(404).json({
        message: "Community forum not found",
      });
    }
    const { count, rows } = await Comments.findAndCountAll({
      where: { forum_id: id },
      attributes: {
        include: [[sequelize.col("User.userid"), "UserId"]],
      },
      include: [
        {
          model: User,
          attributes: [],
        },
      ],
    });
    res.status(200).json({
      message: "Community_forum found successfully",
      data: community_forum,
      comments: rows,
      total_comments: count,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Error fetching community forum",
    });
  }
};

export const delete_Community_forum = async (req, res) => {
  try {
    const user = req.user;
    const user_id = user.id;
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "ids must be a non-empty array",
      });
    }

    let deletedCount = 0;

    // Admin or Support → delete any forum
    if (user.role === "admin" || user.role === "support") {
      deletedCount = await CommunityForum.destroy({
        where: { id: ids },
      });
    }
    // Normal user → delete only own forums
    else {
      deletedCount = await CommunityForum.destroy({
        where: {
          id: ids,
          creator_id: user_id,
        },
      });
    }

    if (deletedCount === 0) {
      return res.status(404).json({
        message: "No community forums found to delete",
      });
    }

    return res.status(200).json({
      message: "Community forums deleted successfully",
      deletedCount,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Server error deleting forum",
    });
  }
};

export const add_comment_to_forum = async (req, res) => {
  try {
    const { forum_id } = req.params;
    const forum = await CommunityForum.findByPk(forum_id);
    if (forum == null) {
      res.status(404).json({
        message: "No forum found",
      });
    }
    const user_id = req.user.id;
    const { content } = req.body;
    const comment = Comments.create({
      user_id,
      forum_id,
      content,
    });
    res.status(201).json({
      data: comment,
      message: "Successfully created",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Error occured adding comment",
    });
  }
};

export const like_community = async (req, res) => {
  try {
    // forum_id should come from req.body for PUT, fallback to params for backward compatibility
    const forum_id = req.body.forum_id;
    const user_id = req.user.id;
    const community = await CommunityForum.findByPk(forum_id);
    if (!community) {
      console.error(forum_id);
      return res.status(404).json({ message: "Community Not found" });
    }

    // Ensure likes/dislike arrays are not null
    if (!Array.isArray(community.likes)) community.likes = [];
    if (!Array.isArray(community.dislike)) community.dislike = [];

    // Remove user from dislikes if present
    if (community.dislike.includes(user_id)) {
      community.dislike = community.dislike.filter((id) => id !== user_id);
    }

    // Toggle like: if already liked, remove; else add

    if (community.likes.includes(user_id)) {
      community.likes = community.likes.filter((id) => id !== user_id);
    } else {
      // Assign a new array to trigger Sequelize change tracking
      community.likes = [...community.likes, user_id];
    }

    await community.save();
    await community.reload();
    return res.status(200).json({
      data: community,
      message: "Liked successfully",
    });
  } catch (err) {
    console.error(err.message);
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Some error occurred liking the forum",
      });
    }
  }
};

export const dislike_community = async (req, res) => {
  try {
    // forum_id should come from req.body for PUT, fallback to params for backward compatibility
    const forum_id = req.body.forum_id;
    const user_id = req.user.id;
    const community = await CommunityForum.findByPk(forum_id);
    if (!community) {
      console.error(forum_id);
      return res.status(404).json({ message: "Community Not found" });
    }

    // Ensure likes/dislike arrays are not null
    if (!Array.isArray(community.likes)) community.likes = [];
    if (!Array.isArray(community.dislike)) community.dislike = [];

    // Remove user from dislikes if present
    if (community.likes.includes(user_id)) {
      community.likes = community.likes.filter((id) => id !== user_id);
    }

    // Toggle like: if already liked, remove; else add

    if (community.dislike.includes(user_id)) {
      community.dislike = community.dislike.filter((id) => id !== user_id);
    } else {
      // Assign a new array to trigger Sequelize change tracking
      community.dislike = [...community.dislike, user_id];
    }

    await community.save();
    await community.reload();
    return res.status(200).json({
      data: community,
      message: "DisLiked successfully",
    });
  } catch (err) {
    console.error(err.message);
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Some error occurred disliking the forum",
      });
    }
  }
};
export const delete_comment = async (req, res) => {
  try {
    const { comment_id } = req.query;
    const delete_comment = await Comments.destroy({
      where: { id: comment_id },
    });
    if (delete_comment === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(204).json({ message: "Comment deleted succesfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Some error occured deleting comment" });
  }
};

export const reject_community = async (req, res) => {
  try {
    const user = req.user;
    const { ids, rejection_justification } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids must be a non-empty array" });
    }

    const forums = await CommunityForum.findAll({
      where: { id: ids },
    });

    if (forums.length === 0) {
      return res.status(404).json({ message: "No community forums found" });
    }

    const results = {
      rejected: [],
      alreadyRejected: [],
      notAllowed: [],
    };

    for (const forum of forums) {
      if (forum.status === "rejected") {
        results.alreadyRejected.push(forum.id);
        continue;
      }

      if (user.role === "admin") {
        forum.status = "rejected";
        await forum.save();
        results.rejected.push(forum.id);
      } else {
        forum.rejection_justification = rejection_justification;
        forum.rejection_requested_by = user.id;
        await forum.save();
        results.rejected.push(forum.id);
      }
    }

    return res.status(200).json({
      message: "Community rejection process completed",
      result: results,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error encountered" });
  }
};

export const rejection_approval = async (req, res) => {
  try {
    const { forum_id } = req.query;
    const community_forum = await CommunityForum.findByPk(forum_id);
    if (!community_forum) {
      res.status(404).json({ message: "community_forum not found" });
    }
    community_forum.rejection_status = req.body.rejection_status;
    if (community_forum.rejection_status == "denied") {
      community_forum.status = "accepted";
    } else if (community_forum.rejection_status == "approved") {
      community_forum.status = "rejected";
    }
    await community_forum.save();
    res.status(200).json({ message: "Rejection status updated successfully" });
  } catch (error) {
    console.error(err.message);
    res.status(500).json({ message: "Server error encountered" });
  }
};

export const approve_community = async (req, res) => {
  try {
    const user = req.user;
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "forum_ids must be a non-empty array",
      });
    }

    const forums = await CommunityForum.findAll({
      where: { id: ids },
    });

    if (forums.length === 0) {
      return res.status(404).json({
        message: "No community forums found",
      });
    }

    const result = {
      approved: [],
      alreadyApproved: [],
    };

    for (const forum of forums) {
      if (forum.status === "approved") {
        result.alreadyApproved.push(forum.id);
        continue;
      }

      forum.status = "approved";
      await forum.save();
      result.approved.push(forum.id);
    }

    return res.status(200).json({
      message: "Community approval completed",
      result,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Server error encountered",
    });
  }
};

export const image_upload = async (req, res) => {
  try {
    if (!req.image_file) {
      res.status(400).json({
        message: "File not found",
      });
    }
    const { forum_id } = req.query;
    const community_forum = await CommunityForum.findByPk(forum_id);

    if (!community_forum) {
      res.status(404).json({ message: "Forum not found" });
    }

    const path = "/uploads/${req.image_file.filename}";
    community_forum.image_url = path;

    await community_forum.save();

    return res.status(202).json({
      message: "image uploaded successfully",
      path,
    });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ message: "Image upload failed due to server error" });
  }
};
