// =====================================================
// src/mqtt.js
// Service MQTT + WebSocket
// Reçoit les données ESP32-S3 et les envoie à React
// =====================================================

const mqtt      = require("mqtt");
const WebSocket = require("ws");

// ─── Dernière donnée reçue ───────────────────────────
let derniereDonnee = null;

// ─── Topics MQTT ────────────────────────────────────
const TOPIC_DATA   = "chargesmart/station/data";   // ESP32 → Backend
const TOPIC_RELAIS = "chargesmart/station/relais";  // Backend → ESP32
const TOPIC_STATUS = "chargesmart/station/status";  // statut connexion

// ====================================================
// WEBSOCKET — port 3002
// ====================================================
const wss = new WebSocket.Server({ port: 3002 });

wss.on("connection", (ws) => {
  console.log("🔌 Client WebSocket connecté (React)");
  // Envoyer la dernière donnée dès la connexion
  if (derniereDonnee) {
    ws.send(JSON.stringify(derniereDonnee));
  }
  ws.on("close", () => console.log("🔌 Client WebSocket déconnecté"));
});

function diffuserWebSocket(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// ====================================================
// CLIENT MQTT
// ====================================================
const MQTT_BROKER = process.env.MQTT_BROKER || "localhost";
const mqttClient  = mqtt.connect(`mqtt://${MQTT_BROKER}:1883`);

mqttClient.on("connect", () => {
  console.log("✅ Connecté au broker MQTT");
  mqttClient.subscribe(TOPIC_DATA,   { qos: 0 });
  mqttClient.subscribe(TOPIC_STATUS, { qos: 0 });
});

mqttClient.on("message", (topic, payload) => {
  try {
    const data = JSON.parse(payload.toString());

    // ── Données capteurs ESP32 ───────────────────────
    if (topic === TOPIC_DATA) {
      derniereDonnee = {
        ...data,
        timestamp: new Date().toISOString(),
        type: "data",
      };
      console.log("📡 Données ESP32 reçues :", derniereDonnee);
      // Envoyer en temps réel à React
      diffuserWebSocket(derniereDonnee);
    }

    // ── Statut connexion ESP32 ───────────────────────
    if (topic === TOPIC_STATUS) {
      console.log("📶 Statut ESP32 :", data);
      diffuserWebSocket({ type: "status", ...data });
    }

  } catch (err) {
    console.error("❌ Erreur message MQTT :", err.message);
  }
});

mqttClient.on("error", (err) => {
  console.error("❌ Erreur MQTT :", err.message);
});

// ====================================================
// FONCTIONS EXPORTÉES
// ====================================================

// Commande relais vers ESP32
function commanderRelais(activer) {
  const payload = JSON.stringify({ relais: activer });
  mqttClient.publish(TOPIC_RELAIS, payload, { qos: 1 });
  console.log(`🔘 Commande relais : ${activer ? "ON" : "OFF"}`);
}

// Dernière donnée reçue
function getDerniereDonnee() {
  return derniereDonnee;
}

module.exports = { commanderRelais, getDerniereDonnee };