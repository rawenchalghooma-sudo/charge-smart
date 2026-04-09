const { Station } = require("../models");

// GET all stations
const getStations = async (req, res) => {
  try {
    const stations = await Station.findAll();

    const formattedStations = stations.map((station) => ({
      id: station.id,
      name: station.name,
      location: station.address || station.city || "Inconnue",
      lat: station.latitude,
      lng: station.longitude,
      power_kw: station.powerKw,
      status: station.status === "available" ? "Disponible" : "Occupée",
      energy_source:
        station.energySource === "solar"
          ? "Solaire"
          : station.energySource === "battery"
          ? "Batterie"
          : "Réseau",
      station_battery: station.batteryLevel || 0,
    }));

    res.json(formattedStations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET station by id
const getStationById = async (req, res) => {
  try {
    const station = await Station.findByPk(req.params.id);

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    res.json({
      id: station.id,
      name: station.name,
      location: station.address || station.city || "Inconnue",
      lat: station.latitude,
      lng: station.longitude,
      power_kw: station.powerKw,
      status: station.status === "available" ? "Disponible" : "Occupée",
      energy_source:
        station.energySource === "solar"
          ? "Solaire"
          : station.energySource === "battery"
          ? "Batterie"
          : "Réseau",
      station_battery: station.batteryLevel || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getStations,
  getStationById,
};