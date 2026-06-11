import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BatteryCharging,
  Zap,
  Wallet,
  Activity,
  Sun,
  Battery,
  Factory,
  MapPin,
  Building2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

type ChargeSource = "Panneau solaire" | "Batterie" | "STEG";
type ChargeType = "AC" | "DC";

interface ChargeData {
  time: string;
  energy: number;
  cost: number;
}

interface StationInfo {
  name: string;
  city: string;
  address: string;
  powerKw: number;
  pricePerKwh: number;
}

const WS_URL = "ws://10.240.5.215:3002";

export default function LiveChargingPage() {
  const navigate = useNavigate();

  const [chargeType, setChargeType] = useState<ChargeType>("DC");
  const [source, setSource] = useState<ChargeSource>("Panneau solaire");
  const [status] = useState("Charge en cours");
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [cost, setCost] = useState(0);
  const [wsConnecte, setWsConnecte] = useState(false);

  const energyRef = useRef(0);
  const pricePerKwhRef = useRef(0.45);

  const [station, setStation] = useState<StationInfo>({
    name: "",
    city: "",
    address: "",
    powerKw: 0,
    pricePerKwh: 0.45,
  });

  const [data, setData] = useState<ChargeData[]>([]);

  useEffect(() => {
    const fetchLiveReservation = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/reservations/live-access",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const result = await response.json();

        if (result?.hasAccess && result?.reservation?.Station) {
          const s = result.reservation.Station;
          const prix = s.pricePerKwh || 0.45;

          pricePerKwhRef.current = prix;

          setStation({
            name: s.name || "Station",
            city: s.city || "",
            address: s.address || "",
            powerKw: s.powerKw || 0,
            pricePerKwh: prix,
          });
        } else {
          navigate("/user/profile");
        }
      } catch (error) {
        console.error("Erreur récupération station live :", error);
        navigate("/user/profile");
      }
    };

    fetchLiveReservation();
  }, [navigate]);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connectWS = () => {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log("✅ WebSocket connecté à ESP32");
        setWsConnecte(true);
      };

      ws.onmessage = (event) => {
        try {
          const esp = JSON.parse(event.data);
          console.log("📡 Données ESP32 :", esp);

          if (esp.soc !== undefined) {
            setBatteryLevel(Math.round(Number(esp.soc)));
          }

          if (
            esp.charging === false &&
            esp.decision === "STOP" &&
            energyRef.current > 0
          ) {
            setEnergy(0);
            setCost(0);
            setData([]);
            energyRef.current = 0;
            setSource("Panneau solaire");
            setChargeType("DC");
            return;
          }

          if (esp.source) {
            const sourceMap: Record<string, ChargeSource> = {
              "PANNEAU SOLAIRE": "Panneau solaire",
              "BATTERIE STATION": "Batterie",
              STEG: "STEG",
              AUCUNE: "Panneau solaire",
            };

            setSource(sourceMap[esp.source] || "Panneau solaire");
            setChargeType(esp.source === "PANNEAU SOLAIRE" ? "DC" : "AC");
          }

          const puissance = Number(esp.p_recharge || esp.p_pv || 0);

          if (puissance > 0 && esp.charging === true) {
            const delta = puissance * (5 / 3600);

            const newEnergy = Number((energyRef.current + delta).toFixed(4));
            const newCost = Number(
              (newEnergy * pricePerKwhRef.current).toFixed(2)
            );

            energyRef.current = newEnergy;
            setEnergy(newEnergy);
            setCost(newCost);

            const now = new Date().toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

            setData((prev) =>
              [...prev, { time: now, energy: newEnergy, cost: newCost }].slice(
                -12
              )
            );
          }
        } catch (err) {
          console.error("Erreur parsing WebSocket :", err);
        }
      };

      ws.onerror = () => {
        console.error("❌ WebSocket erreur");
        setWsConnecte(false);
      };

      ws.onclose = () => {
        console.log("🔌 WebSocket fermé — reconnexion dans 3s");
        setWsConnecte(false);
        reconnectTimer = setTimeout(connectWS, 3000);
      };
    };

    connectWS();

    return () => {
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, []);

  const getSourceIcon = () => {
    if (source === "Panneau solaire") return <Sun size={22} />;
    if (source === "Batterie") return <Battery size={22} />;
    return <Factory size={22} />;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft size={18} />
              Retour
            </button>

            <div>
              <h1 className="text-xl font-black text-slate-900">
                Suivi de charge en temps réel
              </h1>
              <p className="text-sm text-slate-500">
                Courbes énergie, coût et décision intelligente de la carte
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${
                wsConnecte
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  wsConnecte ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {wsConnecte ? "ESP32 connecté" : "ESP32 déconnecté"}
            </div>

            <button
              onClick={() => navigate("/user/dashboard")}
              className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
            >
              Retour dashboard
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl p-6">
        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <Building2 size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Station suivie</p>
                <h2 className="text-lg font-black text-slate-900">
                  {station.name || "Chargement..."}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Localisation</p>
                <h2 className="text-lg font-black text-slate-900">
                  {station.city || "—"}
                </h2>
                <p className="text-sm text-slate-500">
                  {station.address || "Adresse non disponible"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Puissance / Prix</p>
              <h2 className="text-lg font-black text-slate-900">
                {station.powerKw} kW · {station.pricePerKwh} TND/kWh
              </h2>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <InfoCard
            icon={<BatteryCharging size={24} />}
            title="Statut"
            value={status}
            subtitle={`Batterie actuelle : ${batteryLevel}%`}
            color="green"
          />

          <InfoCard
            icon={<Zap size={24} />}
            title="Type de charge"
            value={`Charge ${chargeType}`}
            subtitle="AC ou DC envoyé par la carte"
            color="blue"
          />

          <InfoCard
            icon={getSourceIcon()}
            title="Source choisie par IA"
            value={source}
            subtitle="Panneau solaire, batterie ou STEG"
            color="yellow"
          />

          <InfoCard
            icon={<Activity size={24} />}
            title="Énergie chargée"
            value={`${energy.toFixed(3)} kWh`}
            subtitle="Énergie consommée en direct"
            color="purple"
          />

          <InfoCard
            icon={<Wallet size={24} />}
            title="Argent dépensé"
            value={`${cost.toFixed(2)} TND`}
            subtitle="Calculé selon le prix/kWh"
            color="orange"
          />

          <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Décision intelligente</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between rounded-xl bg-slate-800 p-3">
                <span>Type</span>
                <span className="font-bold text-green-400">{chargeType}</span>
              </div>
              <div className="flex justify-between rounded-xl bg-slate-800 p-3">
                <span>Source</span>
                <span className="font-bold text-yellow-400">{source}</span>
              </div>
              <div className="flex justify-between rounded-xl bg-slate-800 p-3">
                <span>Station</span>
                <span className="font-bold text-blue-400">
                  {station.name || "—"}
                </span>
              </div>
            </div>
          </div>

          <ChartCard
            title="Courbe 1 : énergie chargée en temps réel"
            subtitle="Axe X = temps, Axe Y = énergie chargée en kWh"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis unit=" kWh" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="energy"
                  strokeWidth={3}
                  name="Énergie chargée"
                  unit=" kWh"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Courbe 2 : argent dépensé en temps réel"
            subtitle="Axe X = temps, Axe Y = coût total en TND"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis unit=" TND" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="cost"
                  strokeWidth={3}
                  name="Coût"
                  unit=" TND"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Courbe 3 : charge en fonction de l'argent"
            subtitle="Axe X = argent dépensé, Axe Y = énergie chargée"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="cost"
                  type="number"
                  unit=" TND"
                  domain={["dataMin", "dataMax"]}
                />
                <YAxis
                  dataKey="energy"
                  type="number"
                  unit=" kWh"
                  domain={["dataMin", "dataMax"]}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="energy"
                  strokeWidth={3}
                  dot
                  name="Énergie selon coût"
                  unit=" kWh"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>
      </main>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: "green" | "blue" | "yellow" | "purple" | "orange";
}) {
  const colors = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-3 ${colors[color]}`}>{icon}</div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h2 className="text-lg font-bold text-slate-900">{value}</h2>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
      <h2 className="text-lg font-black text-slate-900">{title}</h2>
      <p className="mb-6 mt-1 text-sm text-slate-500">{subtitle}</p>
      <div className="h-80">{children}</div>
    </div>
  );
}