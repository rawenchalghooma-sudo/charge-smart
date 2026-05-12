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
// =========================
const createReservation = async (req, res) => {
  try {
    console.log("USER:", req.user);
    console.log("BODY:", req.body);

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

    // =========================
    // VALIDATIONS
    // =========================

    if (
      !stationId ||
      !reservationDate ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        message:
          "stationId, reservationDate, startTime et endTime sont obligatoires.",
      });
    }

    if (durationMin < 10 || durationMin > 120) {
      return res.status(400).json({
        message:
          "La durée doit être entre 10 minutes et 2 heures.",
      });
    }

    if (targetPercent < 10 || targetPercent > 100) {
      return res.status(400).json({
        message:
          "Le pourcentage doit être entre 10% et 100%.",
      });
    }

    const station = await Station.findByPk(stationId);

    if (!station) {
      return res.status(404).json({
        message: "Station introuvable.",
      });
    }

    // =========================
    // CALCUL IA
    // =========================

    const minimumDuration = calculateMinimumChargeTime(
      batteryKwh,
      targetPercent,
      chargerPowerKw
    );

    const urgencyScore = calculateUrgency(
      durationMin,
      minimumDuration
    );

    // =========================
    // CREATE RESERVATION
    // =========================

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
    });

    // =========================
    // QR CODE
    // =========================

    const qrCodeId = `ID:${reservation.id}|URGENCY:${urgencyScore}`;

    reservation.qrCodeId = qrCodeId;

    await reservation.save();

    return res.status(201).json({
      message: "Réservation créée avec succès.",

      reservation: {
        ...reservation.toJSON(),

        urgencyScore,
        minimumDuration,
        qrCodeId,
      },
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

      include: [
        {
          model: Station,
        },
      ],
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
// USER - Annuler
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
            "status",
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
// OWNER - Confirmer
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
        message:
          "Réservation introuvable pour ce propriétaire.",
      });
    }

    reservation.status = "confirmed";

    await reservation.save();

    return res.status(200).json({
      message: "Réservation confirmée avec succès.",
      reservation,
    });
  } catch (error) {
    console.error(
      "Erreur confirmReservationByOwner :",
      error.message
    );

    return res.status(500).json({
      message: error.parent?.sqlMessage || error.message,
    });
  }
};

// =========================
// OWNER - Annuler
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
        message:
          "Réservation introuvable pour ce propriétaire.",
      });
    }

    reservation.status = "cancelled";

    await reservation.save();

    return res.status(200).json({
      message:
        "Réservation annulée par le propriétaire avec succès.",
      reservation,
    });
  } catch (error) {
    console.error(
      "Erreur cancelReservationByOwner :",
      error.message
    );

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
  getOwnerReservations,
  confirmReservationByOwner,
  cancelReservationByOwner,
};