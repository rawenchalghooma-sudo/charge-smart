const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EnergyMetric = sequelize.define("EnergyMetric", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  solarProduction: { type: DataTypes.FLOAT },

  batteryLevel: { type: DataTypes.FLOAT },

  gridUsage: { type: DataTypes.FLOAT },

  consumption: { type: DataTypes.FLOAT },

  emsMode: { type: DataTypes.STRING },

  recordedAt: { type: DataTypes.DATE },
});

module.exports = EnergyMetric;