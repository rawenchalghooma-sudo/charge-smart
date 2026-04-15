const express = require("express");
const router = express.Router();

const {
  createReservation,
  getMyReservations,
  getReservationById,
  cancelReservation,
  getOwnerReservations,
  confirmReservationByOwner,
  cancelReservationByOwner,
} = require("../controllers/reservationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.use(authMiddleware);

// USER
router.post("/", roleMiddleware("user"), createReservation);
router.get("/my", roleMiddleware("user"), getMyReservations);

// OWNER
router.get("/owner/all", roleMiddleware("owner"), getOwnerReservations);
router.put("/owner/:id/confirm", roleMiddleware("owner"), confirmReservationByOwner);
router.put("/owner/:id/cancel", roleMiddleware("owner"), cancelReservationByOwner);

// USER detail
router.get("/:id", roleMiddleware("user"), getReservationById);
router.put("/:id/cancel", roleMiddleware("user"), cancelReservation);

module.exports = router;