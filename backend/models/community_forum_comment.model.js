import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db.js';
import CommunityForum from './community_forum_model.js';
import User from './user.model.js';

class Comments extends Model { }

Comments.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            references: {
                model: "Users",
                key: "id"
            },
            allowNull: false
        },
        forum_id: {
            type: DataTypes.UUID,
            references: {
                model: "Community_Forum",
                key: "id"
            },
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "Comments",
        timestamps: true,
    }
)



export default Comments;