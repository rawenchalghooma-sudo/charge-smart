import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BatteryCharging,
  Bolt,
  Clock,
  Leaf,
  PlugZap,
  ShieldCheck,
  MapPin,
  Navigation,
  TimerReset,
  CheckCircle2,
  CircleDashed,
  LogOut,
} from "lucide-react";

type EnergySource = "Solaire" | "Batterie" | "Réseau";

type Station = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  powerKw: number;
  status: "Disponible" | "Occupée";
};

const MOCK_STATIONS: Station[] = [
  {
    id: "1",
    name: "SolarPlug - Station Centre",
    lat: 34.7406,
    lng: 10.7603,
    powerKw: 22,
    status: "Disponible",
  },
  {
    id: "2",
    name: "SolarPlug - Station Sfax Sud",
    lat: 34.7,
    lng: 10.72,
    powerKw: 50,
    status: "Disponible",
  },
  {
    id: "3",
    name: "SolarPlug - Station Route Tunis",
    lat: 34.78,
    lng: 10.77,
    powerKw: 11,
    status: "Occupée",
  },
];

function formatTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function sourceBadge(source: EnergySource) {
  if (source === "Solaire")
    return "bg-amber-100 text-amber-700 border-amber-200";
  if (source === "Batterie")
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function sourceIcon(source: EnergySource) {
  if (source === "Solaire")
    return <Leaf className="text-amber-600" size={18} />;
  if (source === "Batterie")
    return <BatteryCharging className="text-emerald-600" size={18} />;
  return <PlugZap className="text-slate-600" size={18} />;
}

function toRad(x: number) {
  return (x * Math.PI) / 180;
}

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const s1 = Math.sin(dLat / 2) ** 2;
  const s2 =
    Math.cos(toRad(a.lat)) *
    Math.cos(toRad(b.lat)) *
    Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(s1 + s2));
}

export default function ChargingSession() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [running, setRunning] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [kwh, setKwh] = useState(0);
  const [stationBattery, setStationBattery] = useState(86);
  const [source, setSource] = useState<EnergySource>("Solaire");
  const [series, setSeries] = useState<number[]>([0, 0.1, 0.12, 0.18, 0.22, 0.3, 0.35]);

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  const estimatedCost = useMemo(() => (kwh * 0.35).toFixed(2), [kwh]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/user/login");
  };

  useEffect(() => {
    if (!running) return;

    const t = setInterval(() => {
      setSeconds((s) => s + 1);
      setKwh((v) => +(v + 0.012).toFixed(3));
      setStationBattery((b) => Math.max(0, b - 0.02));

      setSeries((arr) => {
        const last = arr[arr.length - 1] ?? 0;
        const next = +(last + 0.012).toFixed(3);
        const newArr = [...arr, next];
        return newArr.length > 26 ? newArr.slice(-26) : newArr;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (stationBattery < 25) setSource("Réseau");
    else if (seconds > 180 && stationBattery < 60) setSource("Batterie");
    else setSource("Solaire");
  }, [seconds, stationBattery]);

  function endSession() {
    setRunning(false);
    alert("✅ Session terminée (simulation).");
  }

  const availableStations = useMemo(() => {
    if (!userPos) return [];

    return MOCK_STATIONS.map((st) => ({
      ...st,
      distance: distanceKm(userPos, { lat: st.lat, lng: st.lng }),
    })).sort((a, b) => a.distance - b.distance);
  }, [userPos]);

  const nearestStation = useMemo(() => {
    return availableStations.find((s) => s.status === "Disponible") ?? null;
  }, [availableStations]);

  function requestGps() {
    setGpsError(null);

    if (!("geolocation" in navigator)) {
      setGpsError("Votre navigateur ne supporte pas la géolocalisation.");
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED) setGpsError("Permission GPS refusée.");
        else if (err.code === err.POSITION_UNAVAILABLE) setGpsError("Position indisponible.");
        else if (err.code === err.TIMEOUT) setGpsError("Timeout GPS. Réessaie.");
        else setGpsError("Impossible de récupérer votre position.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[12%] -left-[10%] h-[40%] w-[40%] rounded-full bg-amber-200/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[12%] h-[40%] w-[40%] rounded-full bg-emerald-200/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[35%] h-[40%] w-[40%] rounded-full bg-blue-200/20 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/user/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Retour dashboard
            </Link>

            <div>
              <div className="text-sm font-bold text-slate-900">Session de charge</div>
              <div className="text-xs text-slate-500">
                ID : <span className="font-semibold">{id ?? "—"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              <ShieldCheck size={14} />
              Données temps réel (simulation)
            </span>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-slate-900">Session</div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-700">
                <Clock size={18} />
              </div>
            </div>

            <div className="mt-4 text-3xl font-black tracking-tight text-slate-900">
              {formatTime(seconds)}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                  running
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {running ? <CheckCircle2 size={14} /> : <CircleDashed size={14} />}
                {running ? "En cours" : "En pause"}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                <TimerReset size={14} />
                Temps réel
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-slate-900">Consommation</div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-100 text-amber-700">
                <Bolt size={18} />
              </div>
            </div>

            <div className="mt-4 flex items-end gap-2">
              <div className="text-3xl font-black tracking-tight text-slate-900">
                {kwh.toFixed(2)}
              </div>
              <div className="pb-1 text-sm font-semibold text-slate-500">kWh</div>
            </div>

            <div className="mt-4 h-12 w-full overflow-hidden rounded-2xl bg-slate-50">
              <svg viewBox="0 0 260 60" className="h-full w-full">
                <path
                  d={sparkPath(series, 260, 60, 6)}
                  fill="none"
                  stroke="currentColor"
                  className="text-emerald-600"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-500">Coût estimé</span>
              <span className="font-bold text-slate-900">{estimatedCost} DT</span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-slate-900">Borne active</div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                <BatteryCharging size={18} />
              </div>
            </div>

            <div className="mt-4 text-lg font-black text-slate-900">
              Borne #{id ?? "—"}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-bold ${sourceBadge(
                  source
                )}`}
              >
                {sourceIcon(source)}
                {source}
              </span>

              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                22 kW
              </span>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Batterie station</span>
                <span className="font-bold text-slate-900">
                  {Math.round(stationBattery)}%
                </span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: `${Math.max(0, Math.min(100, stationBattery))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            💡 Le mode IA peut changer automatiquement la source d’énergie.
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setRunning((v) => !v)}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50"
            >
              {running ? "Mettre en pause" : "Reprendre"}
            </button>

            <button
              onClick={endSession}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              Terminer la session
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-lg font-black text-slate-900">
                Localisation & bornes proches
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Détecte ta position pour afficher la borne disponible la plus proche.
              </div>
            </div>

            <button
              type="button"
              onClick={requestGps}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              <Navigation size={16} />
              {gpsLoading ? "Localisation..." : "Activer GPS"}
            </button>
          </div>

          {gpsError && (
            <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
              {gpsError}
            </div>
          )}

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" />
                <span className="text-sm font-bold text-slate-900">Zone GPS</span>
              </div>

              {!userPos ? (
                <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white text-center">
                  <div>
                    <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-600">
                      <Navigation size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      Active le GPS pour détecter ta position
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Ensuite on affiche la borne recommandée.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="min-h-[260px] rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-5">
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        Position détectée
                      </div>
                      <div className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                        <MapPin size={16} className="text-blue-600" />
                        {userPos.lat.toFixed(5)}, {userPos.lng.toFixed(5)}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center">
                      <div className="relative h-36 w-full max-w-sm rounded-3xl border border-white/70 bg-white/70 shadow-inner">
                        <div className="absolute left-[18%] top-[25%] h-3 w-3 rounded-full bg-slate-400" />
                        <div className="absolute left-[58%] top-[30%] h-3 w-3 rounded-full bg-slate-400" />
                        <div className="absolute left-[72%] top-[58%] h-3 w-3 rounded-full bg-slate-400" />

                        <div className="absolute left-[48%] top-[50%] -translate-x-1/2 -translate-y-1/2">
                          <div className="relative">
                            <div className="absolute -inset-3 animate-ping rounded-full bg-blue-300/50" />
                            <div className="relative grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white shadow-lg">
                              <Navigation size={18} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 text-xs text-slate-500">
                      Carte visuelle simulée. Plus tard tu peux intégrer une vraie map.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-bold text-slate-900">Votre position</div>
                {!userPos ? (
                  <div className="mt-3 text-sm text-slate-500">Position non détectée.</div>
                ) : (
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Latitude</span>
                      <span className="font-bold text-slate-900">
                        {userPos.lat.toFixed(5)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Longitude</span>
                      <span className="font-bold text-slate-900">
                        {userPos.lng.toFixed(5)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="text-sm font-bold text-emerald-900">
                  Borne recommandée
                </div>

                {!userPos ? (
                  <div className="mt-3 text-sm text-emerald-800">
                    Active le GPS pour obtenir une recommandation.
                  </div>
                ) : !nearestStation ? (
                  <div className="mt-3 text-sm font-semibold text-amber-800">
                    Aucune borne disponible proche.
                  </div>
                ) : (
                  <>
                    <div className="mt-3 text-lg font-black text-slate-900">
                      {nearestStation.name}
                    </div>

                    <div className="mt-3 space-y-2 text-sm">
                      <InfoLine label="Distance" value={`${nearestStation.distance.toFixed(2)} km`} />
                      <InfoLine label="Puissance" value={`${nearestStation.powerKw} kW`} />
                      <InfoLine label="Statut" value={nearestStation.status} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        to={`/user/reserve/${nearestStation.id}`}
                        className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                      >
                        Réserver cette borne
                      </Link>

                      <Link
                        to={`/user/session/${nearestStation.id}`}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50"
                      >
                        Ouvrir la session
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {userPos && (
            <div className="mt-6">
              <div className="mb-3 text-sm font-bold text-slate-900">
                Bornes proches
              </div>

              <div className="grid gap-3">
                {availableStations.map((station) => (
                  <div
                    key={station.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{station.name}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {station.distance.toFixed(2)} km • {station.powerKw} kW
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          station.status === "Disponible"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {station.status}
                      </span>

                      {station.status === "Disponible" ? (
                        <div className="flex gap-2">
                          <Link
                            to={`/user/plug/${station.id}`}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50"
                          >
                            Voir détails
                          </Link>

                          <Link
                            to={`/user/reserve/${station.id}`}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                          >
                            Réserver
                          </Link>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="cursor-not-allowed rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-400"
                        >
                          Indisponible
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-slate-900">Détails de la charge</div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-100 text-blue-700">
                <PlugZap size={18} />
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <Row label="Puissance (simulation)" value="22 kW" />
              <Row
                label="Mode IA (simulation)"
                value={
                  source === "Solaire"
                    ? "ECO"
                    : source === "Batterie"
                    ? "WAIT"
                    : "BOOST"
                }
              />
              <Row label="Station" value={`Borne #${id ?? "—"}`} />
              <Row label="Statut" value={running ? "Actif" : "En pause"} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-slate-900">Notes</div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-100 text-amber-700">
                <Leaf size={18} />
              </div>
            </div>

            <div className="mt-4 leading-relaxed text-sm text-slate-600">
              Cette page affiche la session active, la consommation d’énergie et
              la recommandation GPS de borne proche.
              <br />
              <span className="font-semibold text-slate-800">Prochain step backend</span> :
              connecter les vraies données via API et WebSocket.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function sparkPath(arr: number[], w: number, h: number, pad: number) {
  if (!arr.length) return "";
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = Math.max(0.0001, max - min);
  const step = (w - pad * 2) / Math.max(1, arr.length - 1);

  const points = arr.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (h - pad * 2) * (1 - (v - min) / range);
    return { x, y };
  });

  return points.reduce(
    (d, p, i) => d + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`),
    ""
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-600">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}