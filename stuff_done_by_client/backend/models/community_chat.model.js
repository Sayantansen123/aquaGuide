// import { DataTypes, Model } from "sequelize";
// import sequelize from "../lib/db.js";
// import User from "./user.model.js";

// class CommunityChat extends Model {}

// CommunityChat.init(
//     {
//         id: {
//             type: DataTypes.UUID,
//             defaultValue: DataTypes.UUIDV4,
//             primaryKey: true,
//         },
//         user_id: {
//             type: DataTypes.UUID,
//             allowNull: false,
//             references: {
//                 model: User,
//                 key: "id",
//             },
//         },
//         room_id:{
//             type: DataTypes.UUID,
//             defaultValue: DataTypes.UUIDV4,
//             allowNull: false
//         },
//         edited_at: {
//             type: DataTypes.DATE,
//             allowNull: true,
//         },
//         rejection_justification: {
//             type: DataTypes.TEXT,
//             allowNull: true

//         },
//         rejection_requested_by: {
//             type: DataTypes.UUID,
//             references: {
//                 model: "Users",
//                 key: "id",
//             },
//             allowNull: true,
//             onDelete: "CASCADE",
//             onUpdate: "CASCADE"
//         },
//         rejection_status: {
//             type: DataTypes.ENUM("pending", "approved", "denied"),
//             defaultValue: "pending",
//             allowNull: true
//         },
//         is_deleted: {
//             type: DataTypes.BOOLEAN,
//             defaultValue: false,
//         },
//     },
//     {
//         sequelize,
//         modelName: "CommunityChat",
//         tableName: "CommunityChat",
//         timestamps: true,
//         createdAt: "created_at",
//         updatedAt: "updated_at",
//     }
// );

// export default CommunityChat;

import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db.js";
import User from "./user.model.js";

class CommunityChat extends Model {}

CommunityChat.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        room_id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1, 5000],
            },
        },
        edited_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "CommunityChat",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

export default CommunityChat;