import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db.js";
import User from "./user.model.js";


class TextModel extends Model { }

TextModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: () => {
                const now = new Date();
                const isoffset = 5.5 * 60 * 60 * 1000;
                return new Date(now.getTime() + isoffset);
            }
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: () => {
                const now = new Date();
                const isoffset = 5.5 * 60 * 60 * 1000;
                return new Date(now.getTime() + isoffset);
            }
        },
        status: {
            type: DataTypes.ENUM("pending", "approved", "rejected"),
            defaultValue: "pending",
            allowNull: false
        },
        author: {
            type: DataTypes.UUID,
            references: {
                model: "Users",
                key: "id"
            },
            allowNull: false,
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        //rejection
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
        }
    },
    { sequelize, modelName: "TextModel", tableName: "textguides" }
);

User.belongsToMany(TextModel, {
  through: "text_authors",
  foreignKey: "user_id",
  otherKey: "text_id",
});
    
TextModel.belongsToMany(User, {
  through: "text_authors",
  foreignKey: "text_id",
  otherKey: "user_id",
});
TextModel.belongsTo(User, {
  foreignKey: "author",
  as: "authorUser",
});
export default TextModel;