// Importation de la bibliothèque MQTT
const mqtt = require("mqtt");

// Importation de la bibliothèque WebSocket
const WebSocket = require("ws");

// Variable pour garder la dernière donnée reçue de l’ESP32
let derniereDonnee = null;

// Topics MQTT utilisés
const TOPIC_DATA = "chargesmart/station/data";       // Données envoyées par l’ESP32
const TOPIC_RELAIS = "chargesmart/station/relais";   // Commande du relais
const TOPIC_STATUS = "chargesmart/station/status";   // État de connexion de l’ESP32

// Création du serveur WebSocket sur le port 3002
const wss = new WebSocket.Server({ port: 3002 });

// Quand React se connecte au WebSocket
wss.on("connection", (ws) => {
  console.log("🔌 Client WebSocket connecté (React)");

  // Envoie la dernière donnée connue au client React
  if (derniereDonnee) {
    ws.send(JSON.stringify(derniereDonnee));
  }

  // Quand React se déconnecte
  ws.on("close", () => {
    console.log("🔌 Client WebSocket déconnecté");
  });
});

// Fonction pour envoyer les données à tous les clients React connectés
function diffuserWebSocket(data) {
  const message = JSON.stringify(data);

  wss.clients.forEach((client) => {
    // Vérifie si le client WebSocket est encore connecté
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Adresse du broker MQTT
const MQTT_BROKER = process.env.MQTT_BROKER || "localhost";

// Port du broker MQTT
const MQTT_PORT = process.env.MQTT_PORT || 1884;

// Création de l’URL MQTT
const mqttUrl = `mqtt://${MQTT_BROKER}:${MQTT_PORT}`;

console.log("🔎 MQTT URL utilisée:", mqttUrl);

// Connexion au broker MQTT
const mqttClient = mqtt.connect(mqttUrl);

// Quand Node.js est connecté au broker MQTT
mqttClient.on("connect", () => {
  console.log("✅ Connecté au broker MQTT");

  // Abonnement au topic des données ESP32
  mqttClient.subscribe(TOPIC_DATA, { qos: 0 }, (err) => {
    if (err) {
      console.log("❌ Erreur subscribe DATA:", err.message);
    } else {
      console.log("✅ Abonné au topic:", TOPIC_DATA);
    }
  });

  // Abonnement au topic du statut ESP32
  mqttClient.subscribe(TOPIC_STATUS, { qos: 0 }, (err) => {
    if (err) {
      console.log("❌ Erreur subscribe STATUS:", err.message);
    } else {
      console.log("✅ Abonné au topic:", TOPIC_STATUS);
    }
  });
});

// Quand un message MQTT est reçu
mqttClient.on("message", (topic, payload) => {
  console.log("📩 Message MQTT brut:", topic, payload.toString());

  try {
    // Conversion du message JSON en objet JavaScript
    const data = JSON.parse(payload.toString());

    // Si le message vient du topic des données ESP32
    if (topic === TOPIC_DATA) {
      // On ajoute un timestamp et un type au message
      derniereDonnee = {
        ...data,
        timestamp: new Date().toISOString(),
        type: "data",
      };

      console.log("📡 Données ESP32 reçues:", derniereDonnee);

      // Envoie les données vers React via WebSocket
      diffuserWebSocket(derniereDonnee);
    }

    // Si le message vient du topic du statut ESP32
    if (topic === TOPIC_STATUS) {
      console.log("📶 Statut ESP32:", data);

      // Envoie le statut vers React via WebSocket
      diffuserWebSocket({ type: "status", ...data });
    }
  } catch (err) {
    console.error("❌ Erreur message MQTT:", err.message);
  }
});

// Gestion des erreurs MQTT
mqttClient.on("error", (err) => {
  console.error("❌ Erreur MQTT:", err.message);
});

// Fonction pour commander le relais de l’ESP32
function commanderRelais(activer) {
  // Préparation du message à envoyer à l’ESP32
  const payload = JSON.stringify({ relais: activer });

  // Publication de la commande sur le topic relais
  mqttClient.publish(TOPIC_RELAIS, payload, { qos: 1 });

  console.log(`🔘 Commande relais: ${activer ? "ON" : "OFF"}`);
}

// Fonction qui retourne la dernière donnée reçue
function getDerniereDonnee() {
  return derniereDonnee;
}

// Exportation des fonctions pour les utiliser dans d’autres fichiers
module.exports = { commanderRelais, getDerniereDonnee };