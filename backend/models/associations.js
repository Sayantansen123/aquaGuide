import Comments from './community_forum_comment.model.js';
import CommunityForum from "./community_forum_model.js";
import User from "./user.model.js";

CommunityForum.hasMany(Comments, { as: "Comments", foreignKey: "forum_id" });
Comments.belongsTo(CommunityForum, { as: "CommunityForum", foreignKey: "forum_id" })
Comments.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
});
User.hasMany(Comments, {foreignkey: "user_id"})

export default function setupAssociations() { }