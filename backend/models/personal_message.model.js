/**
 * Personal Message Model
 * Represents a direct message sent between users in a private conversation.
 * Stores sender, content, and associated conversation ID.
 */
import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db.js";
import Conversation from "./conversation.model.js";
import User from "./user.model.js";

class PersonalMessage extends Model { }

PersonalMessage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conversation_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Conversation,
        key: "id",
      },
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "PersonalMessage",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default PersonalMessage;
