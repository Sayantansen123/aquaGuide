/**
 * Conversation Participant Model
 * Represents a user participating in a specific conversation.
 * Links User and Conversation models.
 */
import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db.js";
import Conversation from "./conversation.model.js";
import User from "./user.model.js";

class ConversationParticipant extends Model { }

ConversationParticipant.init(
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
    modelName: "ConversationParticipant",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["conversation_id", "user_id"],
      },
    ],
  }
);

export default ConversationParticipant;
