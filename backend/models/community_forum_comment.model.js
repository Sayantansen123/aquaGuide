/**
 * Community Forum Comment Model
 * Represents comments made by users on specific forum posts.
 * Links the comment content to both the user and the forum post.
 */
import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db.js';
import CommunityForum from './community_forum_model.js';

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
                model: CommunityForum,
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