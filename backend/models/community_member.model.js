/**
 * Community Member Model
 * Represents the membership association between a user and a community.
 * A specific table to track which users are part of which communities.
 */
import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db.js";
import User from "./user.model.js";
import Community from "./community_chat.model.js";

class CommunityMember extends Model { }

CommunityMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    community_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Community,
        key: "id",
      },
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "CommunityMember",
    tableName: "community_members",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [{ unique: true, fields: ["community_id", "user_id"] }],
  }
);

export default CommunityMember;
