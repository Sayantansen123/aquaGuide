// import { DataTypes, Model } from "sequelize";
// import sequelize from "../lib/db.js";

// class CommunityChatMessages extends Model {
    
// }

// CommunityChatMessages.init(
//     {
//         id:{
//             type: DataTypes.UUID,
//             defaultValue: DataTypes.UUIDV4,
//             primaryKey: true,
//         },
//         community_chat_id:{
//             type: DataTypes.UUID,
//             references:{
//                 model: "CommunityChat",
//                 key: "id"
//             },
//             allowNull: false,
//         },
//         message:{
//             type: DataTypes.TEXT,
//             allowNull: false,
//             validate:{
//                 len: [1, 5000],
//             },
//         },
//         user_id:{
//             type: DataTypes.UUID,
//                 allowNull: false,
//             references:{
//                 model: "User",
//                 key: "id"
//             }
//         },
        
//     },
//     {
//         sequelize,
//         modelName: "CommunityChatMessages",
//         timestamps: true,
//         createdAt: "created_at",
//         updatedAt: "updated_at",
//     }
// )

// export default CommunityChatMessages;