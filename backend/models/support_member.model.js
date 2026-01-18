import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db.js";
import User from "./user.model.js";
import SupportChat from "./support_chat.model.js";

class SupportMember extends Model {}
SupportMember.init(
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
                model: SupportChat,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "SET NULL",
        },
        is_locked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    },
    {
        sequelize,
        modelName: "SupportMember",
        tableName: "support_members",
        timestamps: true,
    }
)

export default SupportMember;