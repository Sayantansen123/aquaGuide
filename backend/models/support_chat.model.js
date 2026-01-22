import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db.js';
import User from './user.model.js';


class SupportChat extends Model { }

SupportChat.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM("active", "resolved"),
    defaultValue: "active",
  },
  initiated_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
    onDelete: 'SET NULL'
  },
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'SupportChat',
  tableName: 'support_chats'
});

export default SupportChat;