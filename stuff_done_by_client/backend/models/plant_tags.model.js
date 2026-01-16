import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";

const PlantTags = sequelize.define("PlantTags", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tag_name: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
}, {
  timestamps: false,
});

export default PlantTags;
