/**
 * Conversation Model
 * Represents a unique conversation thread between users.
 * Can be of type 'private' or 'group' and tracks the last message timestamp.
 */
import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db.js";

class Conversation extends Model { }

Conversation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("private", "group"),
      allowNull: false,
      defaultValue: "private",
    },
    last_message_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Conversation",
    timestamps: true,
  }
);

export default Conversation;
