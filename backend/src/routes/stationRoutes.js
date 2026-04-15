const express = require("express");
const router = express.Router();

const {
  getStations,
  getStationById,
  createStation,
} = require("../controllers/stationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public / connected routes existantes
router.get("/", getStations);
router.get("/:id", getStationById);

// Owner only
router.post("/", authMiddleware, roleMiddleware("owner"), createStation);

module.exports = router;