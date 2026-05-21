const express = require("express");
const router = express.Router();

const {
  createReservation,
  getMyReservations,
  getReservationById,
  cancelReservation,
  checkLiveChargingAccess,
  getOwnerReservations,
  confirmReservationByOwner,
  rejectReservationByOwner,
  cancelReservationByOwner,
} = require("../controllers/reservationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.use(authMiddleware);

// USER
router.post("/", roleMiddleware("user"), createReservation);
router.get("/my", roleMiddleware("user"), getMyReservations);

// accès live charge seulement si réservation confirmée
router.get(
  "/live-access",
  roleMiddleware("user"),
  checkLiveChargingAccess
);

// OWNER
router.get("/owner/all", roleMiddleware("owner"), getOwnerReservations);

router.put(
  "/owner/:id/confirm",
  roleMiddleware("owner"),
  confirmReservationByOwner
);

router.put(
  "/owner/:id/reject",
  roleMiddleware("owner"),
  rejectReservationByOwner
);

router.put(
  "/owner/:id/cancel",
  roleMiddleware("owner"),
  cancelReservationByOwner
);

// USER detail
// IMPORTANT: garder /:id après /my, /live-access et /owner/...
router.get("/:id", roleMiddleware("user"), getReservationById);

router.put("/:id/cancel", roleMiddleware("user"), cancelReservation);

module.exports = router;