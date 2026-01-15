import sequelize from "../lib/db.js";
import AquaticPlants from "../models/aquatic_plants.model.js";
import PlantImages from "../models/plant_images.model.js";
import PlantTags from "../models/plant_tags.model.js";
import PlantTagMap from "../models/plant_tag_map.model.js";
import setupAssociations from "../models/associations.js";

const syncTables = async () => {
  try {
    setupAssociations();
    await sequelize.authenticate();
    console.log("Connected to database.");

    // Sync specific models
    await AquaticPlants.sync({ alter: true });
    await PlantImages.sync({ alter: true });
    await PlantTags.sync({ alter: true });
    await PlantTagMap.sync({ alter: true });

    console.log("Aquatic Plants tables synced successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error syncing tables:", error);
    process.exit(1);
  }
};

syncTables();
