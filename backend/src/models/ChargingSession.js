const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ChargingSession = sequelize.define("ChargingSession", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  startTime: { type: DataTypes.DATE },

  endTime: { type: DataTypes.DATE },

  status: {
    type: DataTypes.ENUM("active", "completed", "cancelled"),
    defaultValue: "active",
  },

  energyConsumed: { type: DataTypes.FLOAT },

  cost: { type: DataTypes.FLOAT },

  energySourceUsed: { type: DataTypes.STRING },
});

module.exports = ChargingSession;