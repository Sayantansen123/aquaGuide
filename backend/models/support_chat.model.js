import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db.js';
import User from './user.model.js';


class SupportChat extends Model {}

SupportChat.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  is_resolved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  initiated_by: {
    type: DataTypes.UUID,
    allowNull: true,
    defaultValue: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'SupportChat'
});

export default SupportChat;