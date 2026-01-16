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
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },

  supportId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
        model: User,
        key: 'id'
    }
  },
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'SupportChat'
});

export default SupportChat;