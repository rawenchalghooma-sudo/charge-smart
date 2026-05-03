const { Reservation, Station, User } = require("../models");

// =========================
// HELPER - Calculer urgency
// =========================
const computeUrgency = (reservationDate, startTime) => {
  const reservationDateTime = new Date(`${reservationDate}T${startTime}`);
  const now = new Date();
  const minutesUntil = (reservationDateTime - now) / (1000 * 60);

  if (minutesUntil <= 0)        return 100; // déjà en retard
  if (minutesUntil <= 15)       return 100;
  if (minutesUntil <= 30)       return 85;
  if (minutesUntil <= 60)       return 65;
  if (minutesUntil <= 120)      return 40;
  if (minutesUntil <= 240)      return 20;
  return 5;
};

// =========================
// USER - Créer une réservation
// =========================
const createReservation = async (req, res) => {
  try {
    console.log("USER:", req.user);
    console.log("BODY:", req.body);

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Utilisateur non authentifié. Token manquant ou invalide.",
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
    } = req.body;

    if (!stationId || !reservationDate || !startTime || !endTime) {
      return res.status(400).json({
        message:
          "stationId, reservationDate, startTime et endTime sont obligatoires.",
      });
    }

    const station = await Station.findByPk(stationId);

    if (!station) {
      return res.status(404).json({
        message: "Station introuvable.",
      });
    }

    const reservation = await Reservation.create({
      userId,
      stationId,
      reservationDate,
      startTime,
      endTime,
      estimatedKwh: estimatedKwh || 0,
      estimatedCost: estimatedCost || 0,
      vehicleType: vehicleType || "electric",
      status: "pending",
    });

    // =============================================
    // QR CODE FORMAT : ID:{id} | URGENCY:{urgency}
    // Exemple : ID:18 | URGENCY:85
    //   18  = id de la réservation
    //   85  = score d'urgence (0-100) pour l'IA embarquée
    // Lisible directement par n'importe quelle caméra
    // =============================================
    const urgencyScore = computeUrgency(reservationDate, startTime);
    const qrCodeId = `ID:${reservation.id} | URGENCY:${urgencyScore}`;

    reservation.qrCodeId = qrCodeId;
    await reservation.save();

    return res.status(201).json({
      message: "Réservation créée avec succès.",
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
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(reservations);
  } catch (error) {
    console.error("Erreur getMyReservations :", error.message);
    console.error("MYSQL ERROR :", error.parent?.sqlMessage);

    return res.status(500).json({
      message: error.parent?.sqlMessage || error.message,
    });
  }
};

// =========================
// USER - Réservation par ID
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
    console.error("MYSQL ERROR :", error.parent?.sqlMessage);

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
    console.error("MYSQL ERROR :", error.parent?.sqlMessage);

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
          attributes: ["id", "name", "address", "city", "status"],
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
    console.error("MYSQL ERROR :", error.parent?.sqlMessage);

    return res.status(500).json({
      message: error.parent?.sqlMessage || error.message,
    });
  }
};

// =========================
// OWNER - Confirmer réservation
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
    await reservation.save();

    return res.status(200).json({
      message: "Réservation confirmée avec succès.",
      reservation,
    });
  } catch (error) {
    console.error("Erreur confirmReservationByOwner :", error.message);
    console.error("MYSQL ERROR :", error.parent?.sqlMessage);

    return res.status(500).json({
      message: error.parent?.sqlMessage || error.message,
    });
  }
};

// =========================
// OWNER - Annuler réservation
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
    await reservation.save();

    return res.status(200).json({
      message: "Réservation annulée par le propriétaire avec succès.",
      reservation,
    });
  } catch (error) {
    console.error("Erreur cancelReservationByOwner :", error.message);
    console.error("MYSQL ERROR :", error.parent?.sqlMessage);

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