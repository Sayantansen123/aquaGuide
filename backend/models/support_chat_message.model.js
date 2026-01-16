import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db.js";

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
        model: "SupportChats",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
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
    
}, {
    sequelize,
    modelName: "SupportChatMessage",
    tableName: "SupportChatMessages",
    timestamps: true,
});

export default SupportChatMessage;