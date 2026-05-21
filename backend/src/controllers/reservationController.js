const { Reservation, Station, User } = require("../models");

// =========================
// Calcul temps minimum
// =========================
const calculateMinimumChargeTime = (
  batteryKwh,
  targetPercent,
  chargerPowerKw
) => {
  const energyNeeded = batteryKwh * (targetPercent / 100);
  const timeHours = energyNeeded / chargerPowerKw;

  return Math.ceil(timeHours * 60);
};

// =========================
// Calcul urgency intelligente
// =========================
const calculateUrgency = (selectedDuration, minimumDuration) => {
  if (selectedDuration <= minimumDuration) return 100;
  if (selectedDuration <= minimumDuration + 15) return 80;
  if (selectedDuration <= minimumDuration + 30) return 60;
  if (selectedDuration <= minimumDuration + 60) return 40;

  return 10;
};

// =========================
// USER - Créer réservation
// QR n'est PAS généré ici
// =========================
const createReservation = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Utilisateur non authentifié.",
      });
    }

    const userId = req.user.id;

    const {
      stationId,
      reservationDate,
      startTime,
      endTime,
      estimatedKwh,
      estimatedCost,
      vehicleType,
      batteryKwh,
      targetPercent,
      chargerPowerKw,
      durationMin,
    } = req.body;

    if (!stationId || !reservationDate || !startTime || !endTime) {
      return res.status(400).json({
        message:
          "stationId, reservationDate, startTime et endTime sont obligatoires.",
      });
    }

    if (durationMin < 10 || durationMin > 120) {
      return res.status(400).json({
        message: "La durée doit être entre 10 minutes et 2 heures.",
      });
    }

    if (targetPercent < 10 || targetPercent > 100) {
      return res.status(400).json({
        message: "Le pourcentage doit être entre 10% et 100%.",
      });
    }

    const station = await Station.findByPk(stationId);

    if (!station) {
      return res.status(404).json({
        message: "Station introuvable.",
      });
    }

    const minimumDuration = calculateMinimumChargeTime(
      batteryKwh,
      targetPercent,
      chargerPowerKw
    );

    const urgencyScore = calculateUrgency(durationMin, minimumDuration);

    const reservation = await Reservation.create({
      userId,
      stationId,
      reservationDate,
      startTime,
      endTime,

      estimatedKwh: estimatedKwh || 0,
      estimatedCost: estimatedCost || 0,

      vehicleType: vehicleType || "electric",

      batteryKwh,
      targetPercent,
      chargerPowerKw,

      durationMin,
      minimumDuration,
      urgencyScore,

      status: "pending",
      qrCodeId: null,
    });

    return res.status(201).json({
      message:
        "Réservation créée avec succès. En attente de confirmation du propriétaire.",
      reservation,
    });
  } catch (error) {
    console.error("Erreur createReservation :", error.message);
    console.error("MYSQL ERROR :", error.parent?.sqlMessage);
    console.error("SQL :", error.parent?.sql);

    return res.status(500).json({
      message: error.parent?.sqlMessage || error.message,
    });
  }
};

// =========================
// USER - Mes réservations
// =========================
const getMyReservations = async (req, res) => {
  try {
    const userId = req.user.id;

    const reservations = await Reservation.findAll({
      where: { userId },
      include: [
        {
          model: Station,
          attributes: [
            "id",
            "name",
            "address",
            "city",
            "powerKw",
            "status",
            "pricePerKwh",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(reservations);
  } catch (error) {
    console.error("Erreur getMyReservations :", error.message);

    return res.status(500).json({
      message: error.parent?.sqlMessage || error.message,
    });
  }
};

// =========================
// USER - Réservation ID
// =========================
const getReservationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const reservation = await Reservation.findOne({
      where: {
        id,
        userId,
      },
      include: [{ model: Station }],
    });

    if (!reservation) {
      return res.status(404).json({
        message: "Réservation introuvable.",
      });
    }

    return res.status(200).json(reservation);
  } catch (error) {
    console.error("Erreur getReservationById :", error.message);

    return res.status(500).json({
      message: error.parent?.sqlMessage || error.message,
    });
  }
};

// =========================
// USER - Annuler réservation
// =========================
const cancelReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const reservation = await Reservation.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!reservation) {
      return res.status(404).json({
        message: "Réservation introuvable.",
      });
    }

    reservation.status = "cancelled";
    await reservation.save();

    return res.status(200).json({
      message: "Réservation annulée avec succès.",
      reservation,
    });
  } catch (error) {
    console.error("Erreur cancelReservation :", error.message);

    return res.status(500).json({
      message: error.parent?.sqlMessage || error.message,
    });
  }
};

// =========================
// USER - Vérifier accès live charge
// Seulement si réservation confirmed
// =========================
const checkLiveChargingAccess = async (req, res) => {
  try {
    const userId = req.user.id;

    const reservation = await Reservation.findOne({
      where: {
        userId,
        status: "confirmed",
      },
      include: [{ model: Station }],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      hasAccess: !!reservation,
      reservation,
    });
  } catch (error) {
    console.error("Erreur checkLiveChargingAccess :", error.message);

    return res.status(500).json({
      message: error.parent?.sqlMessage || error.message,
    });
  }
};

// =========================
// OWNER - Voir réservations
// =========================
const getOwnerReservations = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const reservations = await Reservation.findAll({
      include: [
        {
          model: Station,
          where: { ownerId },
          attributes: [
            "id",
            "name",
            "address",
            "city",
            "powerKw",
            "status",
            "pricePerKwh",
          ],
        },
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(reservations);
  } catch (error) {
    console.error("Erreur getOwnerReservations :", error.message);

    return res.status(500).json({
      message: error.parent?.sqlMessage || error.message,
    });
  }
};

// =========================
// OWNER - Confirmer réservation
// QR généré ici seulement
// =========================
const confirmReservationByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const reservation = await Reservation.findOne({
      where: { id },
      include: [
        {
          model: Station,
          where: { ownerId },
        },
      ],
    });

    if (!reservation) {
      return res.status(404).json({
        message: "Réservation introuvable pour ce propriétaire.",
      });
    }

    reservation.status = "confirmed";

    const qrCodeId = `ID:${reservation.id}|URGENCY:${reservation.urgencyScore || 0}`;
    reservation.qrCodeId = qrCodeId;

    await reservation.save();

    return res.status(200).json({
      message: "Réservation confirmée avec succès. QR code généré.",
      reservation,
    });
  } catch (error) {
    console.error("Erreur confirmReservationByOwner :", error.message);

    return res.status(500).json({
      message: error.parent?.sqlMessage || error.message,
    });
  }
};

// =========================
// OWNER - Rejeter réservation
// Pas de QR
// =========================
const rejectReservationByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const reservation = await Reservation.findOne({
      where: { id },
      include: [
        {
          model: Station,
          where: { ownerId },
        },
      ],
    });

    if (!reservation) {
      return res.status(404).json({
        message: "Réservation introuvable pour ce propriétaire.",
      });
    }

    reservation.status = "rejected";
    reservation.qrCodeId = null;

    await reservation.save();

    return res.status(200).json({
      message: "Réservation rejetée avec succès.",
      reservation,
    });
  } catch (error) {
    console.error("Erreur rejectReservationByOwner :", error.message);

    return res.status(500).json({
      message: error.parent?.sqlMessage || error.message,
    });
  }
};

// =========================
// OWNER - Annuler réservation
// Pas de QR
// =========================
const cancelReservationByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const reservation = await Reservation.findOne({
      where: { id },
      include: [
        {
          model: Station,
          where: { ownerId },
        },
      ],
    });

    if (!reservation) {
      return res.status(404).json({
        message: "Réservation introuvable pour ce propriétaire.",
      });
    }

    reservation.status = "cancelled";
    reservation.qrCodeId = null;

    await reservation.save();

    return res.status(200).json({
      message: "Réservation annulée par le propriétaire avec succès.",
      reservation,
    });
  } catch (error) {
    console.error("Erreur cancelReservationByOwner :", error.message);

    return res.status(500).json({
      message: error.parent?.sqlMessage || error.message,
    });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  getReservationById,
  cancelReservation,
  checkLiveChargingAccess,
  getOwnerReservations,
  confirmReservationByOwner,
  rejectReservationByOwner,
  cancelReservationByOwner,
};