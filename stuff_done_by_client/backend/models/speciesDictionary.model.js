import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db.js";
import User from "./user.model.js";

class SpeciesDictionary extends Model {}

SpeciesDictionary.init(
  {
    fish_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    common_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    scientific_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    family: {
      type: DataTypes.STRING(100),
    },
    origin: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    // Water parameters
    min_temp: { type: DataTypes.DECIMAL(4, 1) },
    max_temp: { type: DataTypes.DECIMAL(4, 1) },
    min_ph: { type: DataTypes.DECIMAL(3, 1) },
    max_ph: { type: DataTypes.DECIMAL(3, 1) },
    min_hardness: { type: DataTypes.INTEGER },
    max_hardness: { type: DataTypes.INTEGER },
    water_type: {
      type: DataTypes.ENUM("freshwater", "brackish", "marine"),
      allowNull: false,
    },

    // Care info
    diet_type: {
      type: DataTypes.ENUM("herbivore", "carnivore", "omnivore"),
    },
    diet_info: { type: DataTypes.TEXT },
    max_size_cm: { type: DataTypes.DECIMAL(5, 2) },
    min_tank_size_liters: { type: DataTypes.INTEGER },
    care_level: {
      type: DataTypes.ENUM("very_easy", "easy", "moderate", "difficult", "expert"),
      defaultValue: "moderate",
    },
    temperament: {
      type: DataTypes.ENUM("peaceful", "semi_aggressive", "aggressive", "territorial"),
      defaultValue: "peaceful",
    },
    compatibility_notes: { type: DataTypes.TEXT },

    // Media
    primary_image: { type: DataTypes.STRING(500) },
    gallery_images: { type: DataTypes.JSON },

    // Breeding info
    breeding_difficulty: {
      type: DataTypes.ENUM("very_easy", "easy", "moderate", "difficult", "very_difficult"),
    },
    breeding_notes: { type: DataTypes.TEXT },

    // Meta
    views_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_by: {
      type: DataTypes.UUID,
      references: { model: "Users", key: "id" },
    },
    status: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      defaultValue: "published",
    },
  },
  {
    sequelize,
    modelName: "SpeciesDictionary",
    tableName: "SpeciesDictionary",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["common_name", "scientific_name"], // prevents duplicate fish entries
      },
    ],
  }
);

// Relationships
SpeciesDictionary.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

User.hasMany(SpeciesDictionary, {
  foreignKey: "created_by",
  as: "SpeciesDictionary",
});

export default SpeciesDictionary;
