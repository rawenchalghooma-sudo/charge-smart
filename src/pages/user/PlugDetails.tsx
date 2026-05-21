import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BatteryCharging,
  MapPin,
  PlugZap,
  ShieldCheck,
  Bolt,
  CircleCheck,
  CircleX,
  Navigation,
  Loader2,
  LogOut,
} from "lucide-react";

type Station = {
  id: number;
  name: string;
  location: string;
  lat: number;
  lng: number;
  power_kw: number;
  status: "Disponible" | "Occupée" | "Hors ligne";
  station_battery: number;
  price_per_kwh?: number;
};

type ChargingPoint = {
  id: string;
  label: string;
  connectorType: string;
  powerKw: number;
  status: "Disponible" | "Occupée";
};

function connectorFromPower(powerKw?: number) {
  return powerKw && powerKw >= 50 ? "CCS Combo" : "Type 2";
}

export default function PlugDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChargingPointId, setSelectedChargingPointId] =
    useState<string>("cp1");

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/user/login");
  };

  useEffect(() => {
    async function fetchStation() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://localhost:5000/api/stations/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Impossible de charger la station.");
          setStation(null);
          return;
        }

        setStation(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de contacter le serveur.");
        setStation(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchStation();
  }, [id]);

  const distanceKm = "—";
  const connector = connectorFromPower(station?.power_kw);
  const price = `${station?.price_per_kwh ?? 0.35} DT / kWh`;

  const chargingPoints: ChargingPoint[] = station
    ? [
        {
          id: "cp1",
          label: "Borne 1",
          connectorType: connector,
          powerKw: station.power_kw || 22,
          status: "Disponible",
        },
        {
          id: "cp2",
          label: "Borne 2",
          connectorType: connector,
          powerKw: station.power_kw || 22,
          status: station.status === "Occupée" ? "Occupée" : "Disponible",
        },
      ]
    : [];

  const selectedChargingPoint =
    chargingPoints.find((point) => point.id === selectedChargingPointId) ||
    null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto flex max-w-4xl items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="flex items-center gap-3 text-slate-700">
            <Loader2 className="h-5 w-5 animate-spin" />
            Chargement des détails de la station...
          </div>
        </div>
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">
            Station introuvable
          </h1>

          <p className="mt-2 text-slate-600">
            {error || "La station demandée n’existe pas ou n’est pas disponible."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/user/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              <ArrowLeft size={16} />
              Retour dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleContinueReservation = () => {
    if (!selectedChargingPoint) return;

    if (selectedChargingPoint.status !== "Disponible") {
      alert("Cette borne n’est pas disponible.");
      return;
    }

    navigate(`/user/reserve/${station.id}`);
  };

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
              <div className="text-sm font-bold text-slate-900">
                Détails de la station
              </div>
              <div className="text-xs text-slate-500">
                ID : <span className="font-semibold">{station.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              <ShieldCheck size={14} />
              Informations de la station
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
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                  {station.name}
                </h1>

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                    station.status === "Disponible"
                      ? "bg-emerald-100 text-emerald-700"
                      : station.status === "Occupée"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {station.status === "Disponible" ? (
                    <CircleCheck size={14} />
                  ) : (
                    <CircleX size={14} />
                  )}
                  {station.status}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <MapPin size={16} className="text-slate-400" />
                {station.location}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={<Bolt size={18} />}
                  title="Puissance station"
                  value={`${station.power_kw} kW`}
                  color="amber"
                />

                <InfoCard
                  icon={<Navigation size={18} />}
                  title="Distance"
                  value={`${distanceKm} km`}
                  color="blue"
                />

                <InfoCard
                  icon={<PlugZap size={18} />}
                  title="Connecteur principal"
                  value={connector}
                  color="slate"
                />

                <InfoCard
                  icon={<BatteryCharging size={18} />}
                  title="Batterie station"
                  value={`${station.station_battery}%`}
                  color="emerald"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-bold text-slate-900">
                Résumé rapide
              </div>

              <div className="mt-4 space-y-3">
                <Row label="Nom" value={station.name} />
                <Row label="Statut station" value={station.status} />
                <Row label="Tarif estimé" value={price} />
                <Row label="Distance" value={`${distanceKm} km`} />
                <Row
                  label="Bornes disponibles"
                  value={`${
                    chargingPoints.filter(
                      (point) => point.status === "Disponible"
                    ).length
                  } / ${chargingPoints.length}`}
                />
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Batterie station</span>
                  <span className="font-bold text-slate-900">
                    {station.station_battery}%
                  </span>
                </div>

                <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200">
                  <div
                    className="h-2.5 rounded-full bg-emerald-500"
                    style={{ width: `${station.station_battery}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-slate-900">
                Informations détaillées
              </div>

              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-100 text-blue-700">
                <MapPin size={18} />
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <Row label="Nom de la station" value={station.name} />
              <Row label="Localisation" value={station.location} />
              <Row label="Latitude" value={Number(station.lat).toFixed(4)} />
              <Row label="Longitude" value={Number(station.lng).toFixed(4)} />
              <Row label="Puissance station" value={`${station.power_kw} kW`} />
              <Row label="Connecteur principal" value={connector} />
              <Row label="Tarification" value={price} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-bold text-slate-900">
              Choix de borne
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
              Consulte les bornes disponibles de cette station, choisis celle
              qui convient à ton besoin, puis continue vers la page de
              réservation.
            </div>

            <div className="mt-5 space-y-3">
              {chargingPoints.map((point) => {
                const isSelected = point.id === selectedChargingPointId;

                return (
                  <button
                    key={point.id}
                    type="button"
                    onClick={() => setSelectedChargingPointId(point.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 ring-4 ring-emerald-500/10"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-base font-black text-slate-900">
                            {point.label}
                          </div>

                          {isSelected && (
                            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                              Sélectionnée
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-4 text-sm">
                          <span className="font-semibold text-blue-600">
                            {point.connectorType}
                          </span>

                          <span className="font-semibold text-amber-600">
                            {point.powerKw} kW
                          </span>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          point.status === "Disponible"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {point.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                disabled={
                  !selectedChargingPoint ||
                  selectedChargingPoint.status !== "Disponible"
                }
                onClick={handleContinueReservation}
                className="flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                Continuer vers la réservation
              </button>

              <Link
                to="/user/dashboard"
                className="flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Retour dashboard
              </Link>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
              La réservation se fait uniquement dans{" "}
              <span className="font-bold">ReservationPage</span>. Ici,
              l’utilisateur choisit seulement la borne qui lui convient.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-bold text-slate-900">{value}</span>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: "amber" | "blue" | "slate" | "emerald";
}) {
  const styles = {
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    slate: "bg-slate-50 text-slate-700 border-slate-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[color]}`}>
      <div className="flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </div>

      <div className="mt-3 text-lg font-black">{value}</div>
    </div>
  );
}