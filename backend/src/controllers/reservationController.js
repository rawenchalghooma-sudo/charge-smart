const { Reservation, Station, User } = require("../models");

const createReservation = async (req, res) => {
  try {
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
      estimatedKwh,
      estimatedCost,
      vehicleType,
      status: "pending",
    });

    reservation.qrCodeId = `SP-USER-${userId}-RES-${reservation.id}-${Date.now()}`;
    await reservation.save();

    return res.status(201).json({
      message: "Réservation créée avec succès.",
      reservation,
    });
  } catch (error) {
    console.error("Erreur createReservation :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la création de la réservation.",
    });
  }
};

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
    console.error("Erreur getMyReservations :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des réservations.",
    });
  }
};

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
    console.error("Erreur getReservationById :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération de la réservation.",
    });
  }
};

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
    console.error("Erreur cancelReservation :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de l'annulation de la réservation.",
    });
  }
};

// =========================
// OWNER
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
    console.error("Erreur getOwnerReservations :", error);
    return res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des réservations du propriétaire.",
    });
  }
};

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
    console.error("Erreur confirmReservationByOwner :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la confirmation de la réservation.",
    });
  }
};

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
    console.error("Erreur cancelReservationByOwner :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de l'annulation de la réservation.",
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