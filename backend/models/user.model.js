/**
 * User Model
 * Represents a registered user on the platform.
 * Handles authentication, personal details, roles, and account status.
 */
import { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../lib/db.js";
import Comments from "./community_forum_comment.model.js";

class User extends Model {
  async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "rather_not_say"),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "support"),
      defaultValue: "user",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "locked"),
      allowNull: false,
      defaultValue: "active",
    },

    failed_login_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },

    last_seen: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },

    community_rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isIP: true, // supports IPv4 & IPv6
      },
    },
    country_code: {
      type: DataTypes.STRING(2), // ISO-2: IN, US, GB
      allowNull: true,
    },
    region: {
      type: DataTypes.STRING, // e.g. "West Bengal", "California"
      allowNull: true,
    },

    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },

    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("password") && !user.password.startsWith("$2b$")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);
export default User;
