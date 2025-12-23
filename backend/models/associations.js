import Comments from './community_forum_comment.model.js';
import CommunityForum from "./community_forum_model.js";
import CommunityChat from "./community_chat.model.js";
import User from "./user.model.js";

CommunityForum.hasMany(Comments, { as: "Comments", foreignKey: "forum_id" });
User.hasMany(CommunityForum, {
    foreignKey: "creator_id",
    onDelete: "CASCADE"
});
CommunityForum.belongsTo(User, {
    foreignKey: "creator_id",
    as: "User",
});
Comments.belongsTo(CommunityForum, { as: "CommunityForum", foreignKey: "forum_id" });
Comments.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
});
User.hasMany(Comments, {foreignKey: "user_id"})

// Community Chat associations
User.hasMany(CommunityChat, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});
CommunityChat.belongsTo(User, {
    foreignKey: "user_id",
    as: "User",
});

export default function setupAssociations() { }