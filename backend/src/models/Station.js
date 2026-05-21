const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Station = sequelize.define("Station", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },

  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },

  powerKw: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("available", "occupied", "offline"),
    defaultValue: "available",
  },

  energySource: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  batteryLevel: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },

  pricePerKwh: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Station;