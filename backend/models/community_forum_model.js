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
            type: DataTypes.ARRAY(DataTypes.UUIDV4),
            defaultValue: []
        },
        dislike: {
            type: DataTypes.ARRAY(DataTypes.UUIDV4),
            defaultValue: []
        },
        is_private: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },

    },
    {
        sequelize,
        modelName: "Community_Forum",
        timestamps: true,
    }
)

export default CommunityForum;