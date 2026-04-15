const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Reservation = sequelize.define("Reservation", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  reservationDate: { type: DataTypes.DATE },

  startTime: { type: DataTypes.DATE },

  endTime: { type: DataTypes.DATE },

  status: {
    type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
    defaultValue: "pending",
  },

  estimatedKwh: { type: DataTypes.FLOAT },

  estimatedCost: { type: DataTypes.FLOAT },

  vehicleType: { type: DataTypes.STRING },

  qrCodeId: {
    type: DataTypes.STRING,
    unique: true,
  },
});

module.exports = Reservation;