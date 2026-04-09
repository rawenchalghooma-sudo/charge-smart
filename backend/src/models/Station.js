const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Station = sequelize.define("Station", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  name: { type: DataTypes.STRING, allowNull: false },

  address: { type: DataTypes.STRING },

  city: { type: DataTypes.STRING },

  latitude: { type: DataTypes.FLOAT },

  longitude: { type: DataTypes.FLOAT },

  powerKw: { type: DataTypes.FLOAT },

  status: {
    type: DataTypes.ENUM("available", "occupied", "offline"),
    defaultValue: "available",
  },

  energySource: { type: DataTypes.STRING },

  batteryLevel: { type: DataTypes.FLOAT },

  pricePerKwh: { type: DataTypes.FLOAT },

  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Station;