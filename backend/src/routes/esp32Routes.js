// =====================================================
// src/routes/esp32Routes.js
// Routes API pour les données ESP32-S3
// =====================================================

const express = require("express");
const router  = express.Router();
const { commanderRelais, getDerniereDonnee } = require("../mqtt");

// GET /api/esp32/live — dernière mesure en temps réel
router.get("/live", (req, res) => {
  const data = getDerniereDonnee();
  if (!data) {
    return res.status(404).json({ message: "Aucune donnée ESP32 disponible" });
  }
  res.json(data);
});

// POST /api/esp32/relais — commande relais depuis React
// Body: { "activer": true } ou { "activer": false }
router.post("/relais", (req, res) => {
  const { activer } = req.body;
  if (typeof activer !== "boolean") {
    return res.status(400).json({ error: "Paramètre 'activer' booléen requis" });
  }
  commanderRelais(activer);
  res.json({ success: true, relais: activer });
});

module.exports = router;