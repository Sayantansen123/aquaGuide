import Comments from './community_forum_comment.model.js';
import CommunityForum from "./community_forum_model.js";
import CommunityChat from "./community_chat.model.js";
import User from "./user.model.js";
import AquaticPlants from "./aquatic_plants.model.js";
import PlantImages from "./plant_images.model.js";
import PlantTags from "./plant_tags.model.js";
import PlantTagMap from "./plant_tag_map.model.js";

CommunityForum.hasMany(Comments, { as: "Comments", foreignKey: "forum_id" });
User.hasMany(CommunityForum, {
    foreignKey: "creator_id",
    onDelete: "CASCADE"
});
CommunityForum.belongsTo(User, {
    foreignKey: "creator_id",
    as: "User",
});
Comments.belongsTo(CommunityForum, { as: "CommunityForum", foreignKey: "forum_id" });
Comments.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
});
User.hasMany(Comments, {foreignKey: "user_id"})

// Community Chat associations
User.hasMany(CommunityChat, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});
CommunityChat.belongsTo(User, {
    foreignKey: "user_id",
    as: "User",
});

// Aquatic Plants Associations
AquaticPlants.hasMany(PlantImages, { foreignKey: 'plant_id', as: 'images' });
PlantImages.belongsTo(AquaticPlants, { foreignKey: 'plant_id' });

AquaticPlants.belongsToMany(PlantTags, { through: PlantTagMap, foreignKey: 'plant_id', otherKey: 'tag_id', as: 'tags' });
PlantTags.belongsToMany(AquaticPlants, { through: PlantTagMap, foreignKey: 'tag_id', otherKey: 'plant_id', as: 'plants' });

export default function setupAssociations() { }