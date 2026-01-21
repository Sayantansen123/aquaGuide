/**
 * Community Forum Model
 * Represents a forum post or discussion thread created by a user.
 * Includes title, content, engagement metrics (likes/dislikes), and approval status.
 */
import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db.js';


class CommunityForum extends Model { }

CommunityForum.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        creator_id: {
            type: DataTypes.UUID,
            references: {
                model: "Users",
                key: "id"
            },
            allowNull: false,
        },
        likes: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        dislike: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        is_private: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM("pending", "approved", "rejected"),
            defaultValue: "pending",
            allowNull: false
        },
        rejection_justification: {
            type: DataTypes.TEXT,
            allowNull: true

        },
        rejection_requested_by: {
            type: DataTypes.UUID,
            references: {
                model: "Users",
                key: "id",
            },
            allowNull: true,
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        rejection_status: {
            type: DataTypes.ENUM("pending", "approved", "denied"),
            defaultValue: "pending",
            allowNull: true
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: "CommunityForum",
        timestamps: true,
    }
)

export default CommunityForum;