const express = require("express");
const router = express.Router();

const {
  getStations,
  getStationsByCity,
  getMyStations,
  getStationById,
  createStation,
} = require("../controllers/stationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public routes
router.get("/", getStations);
router.get("/city/:city", getStationsByCity);
router.get("/:id", getStationById);

// Owner only
router.get(
  "/owner/my-stations",
  authMiddleware,
  roleMiddleware("owner"),
  getMyStations
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("owner"),
  createStation
);

module.exports = router;