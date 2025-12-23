import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db.js";

class Guest extends Model {}

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