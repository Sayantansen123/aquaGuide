/**
 * FAQ Model
 * Represents a Frequently Asked Question (FAQ) entry.
 * Stores the question, answer, and the administrator who created it.
 */
import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db.js";

class FAQ extends Model { }

FAQ.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    answers: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
    },
    created_by: {
      type: DataTypes.UUID,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "FAQ",
    timestamps: true,
  }
);

export default FAQ;
