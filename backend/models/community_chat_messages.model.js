// models/community_message.model.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db.js";
import User from "./user.model.js";
import Community from "./community_chat.model.js";

class CommunityMessage extends Model {}

CommunityMessage.init(
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
      onDelete: "CASCADE",
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "SET NULL",
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 5000],
      },
    },

    edited_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "CommunityMessage",
    tableName: "community_messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["community_id", "created_at"] },
      { fields: ["user_id"] },
    ],
  }
);

export default CommunityMessage;
