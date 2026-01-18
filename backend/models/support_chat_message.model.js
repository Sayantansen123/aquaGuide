import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db.js";
import User from "./user.model.js";
import SupportChat from "./support_chat.model.js";

class SupportChatMessage extends Model {}

SupportChatMessage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    support_chat_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: SupportChat,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 5000],
      },
    },
    datestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "SupportChatMessage",
    tableName: "support_chat_messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [{ fields: ["support_chat_id", "created_at"] }, { fields: ["sender_id"] }],
  }
);

export default SupportChatMessage;