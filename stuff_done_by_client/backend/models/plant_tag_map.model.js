import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";
import AquaticPlants from "./aquatic_plants.model.js";
import PlantTags from "./plant_tags.model.js";

const PlantTagMap = sequelize.define("PlantTag_Map", {
  plant_id: {
    type: DataTypes.INTEGER,
    references: {
      model: AquaticPlants,
      key: 'id',
    },
    onDelete: 'CASCADE',
    primaryKey: true,
  },
  tag_id: {
    type: DataTypes.INTEGER,
    references: {
      model: PlantTags,
      key: 'id',
    },
    onDelete: 'CASCADE',
    primaryKey: true,
  },
}, {
  timestamps: false,
  tableName: 'PlantTag_Map',
});

export default PlantTagMap;
