import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db.js";

class SupportMember extends Model {}
SupportMember.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "Users",
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
        tableName: "SupportMembers",
        timestamps: true,
    }
)