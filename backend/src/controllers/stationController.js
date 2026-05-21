const {
  Station,
  Reservation,
  ChargingSession,
  EnergyMetric,
} = require("../models");

// -------- Helpers --------
const formatStatus = (status) => {
  if (status === "available") return "Disponible";
  if (status === "occupied") return "Occupée";
  if (status === "offline") return "Hors ligne";
  return "Inconnu";
};

const formatEnergySource = (energySource) => {
  if (energySource === "solar") return "Solaire";
  if (energySource === "battery") return "Batterie";
  if (energySource === "solar_battery") return "Solaire + Batterie";
  if (energySource === "solar_grid") return "Solaire + Réseau";
  if (energySource === "battery_grid") return "Batterie + Réseau";
  if (energySource === "grid") return "Réseau";
  return energySource || "Non renseignée";
};

const formatStationListItem = (station) => ({
  id: station.id,
  name: station.name,
  location: station.address || station.city || "Inconnue",
  address: station.address || "Inconnue",
  city: station.city || "Inconnue",
  lat: station.latitude,
  lng: station.longitude,
  power_kw: station.powerKw || 0,
  status: formatStatus(station.status),
  energy_source: formatEnergySource(station.energySource),
  station_battery: station.batteryLevel || 0,
  price_per_kwh: station.pricePerKwh || 0,
  is_active: station.isActive,
  owner_id: station.ownerId,
});

// -------- CREATE station --------
const createStation = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const {
      name,
      address,
      city,
      latitude,
      longitude,
      powerKw,
      energySource,
      batteryLevel,
      pricePerKwh,
      status,
      isActive,
    } = req.body;

    if (!name || !address || !city || !powerKw) {
      return res.status(400).json({
        message:
          "Les champs nom, adresse, ville et puissance sont obligatoires.",
      });
    }

    const station = await Station.create({
      name,
      address,
      city,
      latitude: latitude !== "" && latitude !== undefined ? latitude : null,
      longitude: longitude !== "" && longitude !== undefined ? longitude : null,
      powerKw: powerKw !== "" && powerKw !== undefined ? powerKw : null,
      energySource: energySource || "solar",
      batteryLevel:
        batteryLevel !== "" && batteryLevel !== undefined
          ? batteryLevel
          : null,
      pricePerKwh:
        pricePerKwh !== "" && pricePerKwh !== undefined
          ? pricePerKwh
          : null,
      status: status || "available",
      isActive: typeof isActive === "boolean" ? isActive : true,
      ownerId,
    });

    return res.status(201).json({
      message: "Borne créée avec succès.",
      station: formatStationListItem(station),
    });
  } catch (error) {
    console.error("createStation error:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la création de la borne.",
      error: error.message,
    });
  }
};

// -------- GET all active stations --------
const getStations = async (req, res) => {
  try {
    const stations = await Station.findAll({
      where: { isActive: true },
      order: [["id", "DESC"]],
    });

    const formattedStations = stations.map(formatStationListItem);

    return res.json(formattedStations);
  } catch (error) {
    console.error("getStations error:", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// -------- GET stations by city --------
const getStationsByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const stations = await Station.findAll({
      where: {
        city,
        isActive: true,
      },
      order: [["id", "DESC"]],
    });

    const formattedStations = stations.map(formatStationListItem);

    return res.json(formattedStations);
  } catch (error) {
    console.error("getStationsByCity error:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des bornes par ville.",
    });
  }
};

// -------- GET owner stations --------
const getMyStations = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const stations = await Station.findAll({
      where: { ownerId },
      order: [["id", "DESC"]],
    });

    const formattedStations = stations.map(formatStationListItem);

    return res.json(formattedStations);
  } catch (error) {
    console.error("getMyStations error:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des bornes du propriétaire.",
    });
  }
};

// -------- GET station by id --------
const getStationById = async (req, res) => {
  try {
    const stationId = req.params.id;

    const station = await Station.findByPk(stationId);

    if (!station) {
      return res.status(404).json({ message: "Station introuvable." });
    }

    const reservationsCount = await Reservation.count({
      where: { stationId: station.id },
    });

    const sessionsCount = await ChargingSession.count({
      where: { stationId: station.id },
    });

    const latestEnergyMetric = await EnergyMetric.findOne({
      where: { stationId: station.id },
      order: [["recordedAt", "DESC"]],
    });

    return res.json({
      id: station.id,
      name: station.name,
      location: station.address || station.city || "Inconnue",
      address: station.address || "Inconnue",
      city: station.city || "Inconnue",
      lat: station.latitude,
      lng: station.longitude,
      power_kw: station.powerKw || 0,
      status: formatStatus(station.status),
      energy_source: formatEnergySource(station.energySource),
      station_battery: station.batteryLevel || 0,
      price_per_kwh: station.pricePerKwh || 0,
      is_active: station.isActive,
      connector: "Non renseigné",
      solar_production: latestEnergyMetric?.solarProduction || 0,
      energy_battery_level:
        latestEnergyMetric?.batteryLevel ?? station.batteryLevel ?? 0,
      grid_usage: latestEnergyMetric?.gridUsage || 0,
      consumption: latestEnergyMetric?.consumption || 0,
      ems_mode: latestEnergyMetric?.emsMode || "Non défini",
      reservations: reservationsCount,
      sessions: sessionsCount,
      last_recorded_at: latestEnergyMetric?.recordedAt || null,
    });
  } catch (error) {
    console.error("getStationById error:", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  getStations,
  getStationsByCity,
  getMyStations,
  getStationById,
  createStation,
};