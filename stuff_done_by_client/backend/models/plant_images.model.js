import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";
import AquaticPlants from "./aquatic_plants.model.js";

const PlantImages = sequelize.define("PlantImages", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  plant_id: {
    type: DataTypes.INTEGER,
    references: {
      model: AquaticPlants,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  caption: DataTypes.STRING(255),
}, {
  timestamps: false,
});

export default PlantImages;
