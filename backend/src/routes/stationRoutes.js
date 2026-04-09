const express = require("express");
const router = express.Router();

const {
  getStations,
  getStationById,
} = require("../controllers/stationController");

router.get("/", getStations);
router.get("/:id", getStationById);

module.exports = router;