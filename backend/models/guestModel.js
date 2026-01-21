/**
 * Guest Model
 * Represents an unregistered user (guest) visiting the platform.
 * Tracks IP address, location data, and assigns a temporary guest name.
 */
import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db.js";

class Guest extends Model { }

Guest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    guest_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    ip_address: {
      type: DataTypes.STRING,
      allowNull: false,
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
    last_seen: {
      type: DataTypes.DATE,
      allowNull: true,
    },

  },
  {
    sequelize,
    modelName: "Guest",
    timestamps: true,

    hooks: {
      beforeValidate: async (guest) => {
        if (!guest.guest_name) {
          guest.guest_name = `guest${Math.floor(1000 + Math.random() * 9000)}`;
        }
      },
    },
  }
);

export default Guest;