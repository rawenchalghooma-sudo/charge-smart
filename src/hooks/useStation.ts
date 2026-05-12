// src/hooks/useStation.ts
import { useState, useEffect, useCallback, useRef } from "react";

const WS_URL  = "ws://localhost:3002";
const API_URL = "http://localhost:5000/api/esp32";

interface StationData {
  tension:    number;
  courant:    number;
  puissance:  number;
  luminosite: number;
  relais:     boolean;
  recharge:   boolean;
  wifi_rssi:  number;
  timestamp:  string;
  type:       string;
}

export default function useStation() {
  const [donnees,       setDonnees]       = useState<StationData | null>(null);
  const [stationOnline, setStationOnline] = useState(false);
  const [connecte,      setConnecte]      = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    function connecterWS() {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnecte(true);
        console.log("✅ WebSocket connecté");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "status") {
            setStationOnline(data.online);
          } else {
            setDonnees(data);
          }
        } catch (err) {
          console.error("Erreur parsing WebSocket:", err);
        }
      };

      ws.onerror = () => setConnecte(false);

      ws.onclose = () => {
        setConnecte(false);
        // Reconnexion automatique après 3 secondes
        setTimeout(connecterWS, 3000);
      };
    }

    connecterWS();
    return () => wsRef.current?.close();
  }, []);

  const commanderRelais = useCallback(async (activer: boolean) => {
    try {
      const res = await fetch(`${API_URL}/relais`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ activer }),
      });
      return await res.json();
    } catch (err) {
      console.error("Erreur commande relais:", err);
    }
  }, []);

  return {
    donnees,          // données temps réel ESP32
    stationOnline,    // ESP32 connecté ou non
    connecte,         // WebSocket connecté ou non
    commanderRelais,  // fonction pour activer/désactiver le relais
  };
}