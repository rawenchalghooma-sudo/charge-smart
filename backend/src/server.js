// Charge les variables d’environnement depuis le fichier .env
require("dotenv").config();

// Importe l’application Express
const app = require("./app");

// Importe la configuration de la base de données Sequelize
const sequelize = require("./config/db");

// Importe tous les modèles Sequelize et leurs relations
require("./models");

// Démarre le module MQTT + WebSocket
// MQTT reçoit les données ESP32
// WebSocket envoie les données en temps réel vers React
require("./mqtt");  // démarre MQTT + WebSocket sur le port 3002

// Définit le port du serveur backend
// Si PORT existe dans .env, on l’utilise, sinon port 5000
const PORT = process.env.PORT || 5000;

// Fonction principale pour démarrer le serveur
const startServer = async () => {
  try {
    // Teste la connexion avec MySQL
    await sequelize.authenticate();
    console.log("MySQL connected successfully");

    // Synchronise les modèles Sequelize avec la base de données
    await sequelize.sync();
    console.log("Database synchronized");

    // Lance le serveur Express
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    // Affiche l’erreur si la connexion à la base échoue
    console.error("Database connection error:", error.message);
  }
};

// Appel de la fonction pour démarrer le backend
startServer();