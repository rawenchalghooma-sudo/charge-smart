const User = require("./User");
const Station = require("./Station");
const Reservation = require("./Reservation");
const ChargingSession = require("./ChargingSession");
const EnergyMetric = require("./EnergyMetric");

// Owner → Stations
User.hasMany(Station, { foreignKey: "ownerId", as: "stations" });
Station.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// User → Reservations
User.hasMany(Reservation, { foreignKey: "userId" });
Reservation.belongsTo(User, { foreignKey: "userId" });

// Station → Reservations
Station.hasMany(Reservation, { foreignKey: "stationId" });
Reservation.belongsTo(Station, { foreignKey: "stationId" });

// User → Sessions
User.hasMany(ChargingSession, { foreignKey: "userId" });
ChargingSession.belongsTo(User, { foreignKey: "userId" });

// Station → Sessions
Station.hasMany(ChargingSession, { foreignKey: "stationId" });
ChargingSession.belongsTo(Station, { foreignKey: "stationId" });

// Reservation → Session
Reservation.hasOne(ChargingSession, { foreignKey: "reservationId" });
ChargingSession.belongsTo(Reservation, { foreignKey: "reservationId" });

// Station → Energy
Station.hasMany(EnergyMetric, { foreignKey: "stationId" });
EnergyMetric.belongsTo(Station, { foreignKey: "stationId" });

module.exports = {
  User,
  Station,
  Reservation,
  ChargingSession,
  EnergyMetric,
};