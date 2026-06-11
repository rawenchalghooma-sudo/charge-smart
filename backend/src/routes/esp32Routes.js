// =====================================================
// src/routes/esp32Routes.js
// Routes API pour les données ESP32-S3
// =====================================================

// Importation d’Express
const express = require("express");

// Création d’un routeur Express
const router  = express.Router();

// Importation des fonctions depuis le fichier mqtt.js
// commanderRelais : envoyer une commande au relais via MQTT
// getDerniereDonnee : récupérer la dernière donnée reçue de l’ESP32
const { commanderRelais, getDerniereDonnee } = require("../mqtt");

// Route GET pour récupérer la dernière mesure ESP32
// URL : GET /api/esp32/live
router.get("/live", (req, res) => {
  const data = getDerniereDonnee();

  // Si aucune donnée n’est encore disponible
  if (!data) {
    return res.status(404).json({ message: "Aucune donnée ESP32 disponible" });
  }

  // Envoie les dernières données ESP32 au frontend
  res.json(data);
});

// Route POST pour commander le relais depuis React
// URL : POST /api/esp32/relais
// Exemple Body : { "activer": true } ou { "activer": false }
router.post("/relais", (req, res) => {
  const { activer } = req.body;

  // Vérifie que le paramètre activer est bien un booléen
  if (typeof activer !== "boolean") {
    return res.status(400).json({ error: "Paramètre 'activer' booléen requis" });
  }

  // Envoie la commande au relais via MQTT
  commanderRelais(activer);

  // Réponse envoyée au frontend
  res.json({ success: true, relais: activer });
});

// Exportation du routeur pour l’utiliser dans app.js
module.exports = router;