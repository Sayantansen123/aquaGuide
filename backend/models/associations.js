import Comments from "./community_forum_comment.model.js";
import CommunityForum from "./community_forum_model.js";
import User from "./user.model.js";
import CommunityMember from "./community_member.model.js";
import Community from "./community_chat.model.js";
import CommunityMessage from "./community_chat_messages.model.js";
import Conversation from "./conversation.model.js";
import ConversationParticipant from "./conversation_participant.model.js";
import PersonalMessage from "./personal_message.model.js";

export default function setupAssociations() {
  console.log("setupAssociations CALLED");
  
  // ================= COMMUNITY FORUM ASSOCIATIONS =================
  CommunityForum.hasMany(Comments, { as: "Comments", foreignKey: "forum_id" });
  User.hasMany(CommunityForum, {
    foreignKey: "creator_id",
    onDelete: "CASCADE",
  });
  CommunityForum.belongsTo(User, {
    foreignKey: "creator_id",
    as: "User",
  });
  Comments.belongsTo(CommunityForum, {
    as: "CommunityForum",
    foreignKey: "forum_id",
  });
  Comments.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });
  User.hasMany(Comments, { foreignKey: "user_id" });

  // ================= USER ASSOCIATIONS =================
  User.hasMany(Community, {
    foreignKey: "created_by",
    as: "createdCommunities",
  });

  User.belongsToMany(Community, {
    through: CommunityMember,
    foreignKey: "user_id",
    otherKey: "community_id",
    as: "joinedCommunities",
  });

  User.hasMany(CommunityMessage, {
    foreignKey: "user_id",
    as: "communityMessages",
  });

  // ================= COMMUNITY ASSOCIATIONS =================
  Community.belongsTo(User, {
    foreignKey: "created_by",
    as: "creator",
  });

  Community.belongsToMany(User, {
    through: CommunityMember,
    foreignKey: "community_id",
    otherKey: "user_id",
    as: "members",
  });

  Community.hasMany(CommunityMessage, {
    foreignKey: "community_id",
    as: "messages",
  });

  // ================= COMMUNITY MEMBER ASSOCIATIONS =================
  CommunityMember.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  CommunityMember.belongsTo(Community, {
    foreignKey: "community_id",
    as: "community",
  });

  // ================= COMMUNITY MESSAGE ASSOCIATIONS =================
  CommunityMessage.belongsTo(User, {
    foreignKey: "user_id",
    as: "sender",
  });

  CommunityMessage.belongsTo(Community, {
    foreignKey: "community_id",
    as: "community",
  });

  // ================= PRIVATE CONVERSATION ASSOCIATIONS =================
  // User <-> Conversation (Many-to-Many through ConversationParticipant)
  User.belongsToMany(Conversation, {
    through: ConversationParticipant,
    foreignKey: "user_id",
    otherKey: "conversation_id",
    as: "conversations",
  });

  Conversation.belongsToMany(User, {
    through: ConversationParticipant,
    foreignKey: "conversation_id",
    otherKey: "user_id",
    as: "participants",
  });

  // Conversation has many ConversationParticipants
  Conversation.hasMany(ConversationParticipant, {
    foreignKey: "conversation_id",
    as: "conversationParticipants",
  });

  // ConversationParticipant belongs to Conversation
  ConversationParticipant.belongsTo(Conversation, {
    foreignKey: "conversation_id",
    as: "conversation",
  });

  // ConversationParticipant belongs to User
  ConversationParticipant.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  // User has many ConversationParticipants
  User.hasMany(ConversationParticipant, {
    foreignKey: "user_id",
    as: "participations",
  });

  // Conversation has many messages
  Conversation.hasMany(PersonalMessage, {
    foreignKey: "conversation_id",
    as: "messages",
  });

  // PersonalMessage belongs to User (sender)
  PersonalMessage.belongsTo(User, {
    foreignKey: "sender_id",
    as: "sender",
  });

  // PersonalMessage belongs to Conversation
  PersonalMessage.belongsTo(Conversation, {
    foreignKey: "conversation_id",
    as: "conversation",
  });

  // User has many sent messages
  User.hasMany(PersonalMessage, {
    foreignKey: "sender_id",
    as: "sentMessages",
  });

  console.log("All associations set up successfully");
}
