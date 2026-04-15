import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  BatteryCharging,
  Zap,
  Wrench,
  BarChart3,
  CalendarDays,
  Activity,
  PlugZap,
  Power,
  Sun,
  LogOut,
} from "lucide-react";

type StationStatus = "Disponible" | "Occupée" | "Hors ligne" | "Inconnu";

type Station = {
  id: number;
  name: string;
  location: string;
  status: StationStatus;
  power_kw: number | string;
  energy_source: string;
  station_battery: number | string;
  price_per_kwh?: number;
  is_active?: boolean;
  connector?: string;
  solar_production?: number;
  energy_battery_level?: number;
  grid_usage?: number;
  consumption?: number;
  ems_mode?: string;
  reservations?: number;
  sessions?: number;
  last_recorded_at?: string | null;
};

function getStatusClass(status: StationStatus) {
  if (status === "Disponible") return "bg-emerald-50 text-emerald-600";
  if (status === "Occupée") return "bg-amber-50 text-amber-600";
  return "bg-rose-50 text-rose-600";
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
        {icon}
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function HistoryItem({
  title,
  time,
  type,
}: {
  title: string;
  time: string;
  type: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="mt-1 text-xs text-slate-400">{time}</p>
      </div>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
        {type}
      </span>
    </div>
  );
}

export default function StationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/owner/login");
  };

  useEffect(() => {
    const fetchStation = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`http://localhost:5000/api/stations/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Station introuvable");
          }
          throw new Error("Erreur lors du chargement de la station");
        }

        const data = await response.json();
        setStation(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Impossible de charger la station.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStation();
    } else {
      setError("Identifiant de station invalide.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">
            Chargement de la station...
          </h1>
        </div>
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">
            Station introuvable
          </h1>
          <p className="mt-3 text-slate-500">
            {error || "La borne demandée n’existe pas ou n’est plus disponible."}
          </p>
          <Link
            to="/owner/stations"
            className="mt-6 inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  const connector = station.connector || "Non renseigné";
  const solarProduction = `${station.solar_production ?? 0} kWh`;
  const reservations = station.reservations ?? 0;
  const sessions = station.sessions ?? 0;
  const batteryValue = `${station.station_battery}%`;
  const powerValue = `${station.power_kw} kW`;
  const emsMode = station.ems_mode || "Non défini";
  const gridUsage = `${station.grid_usage ?? 0} kWh`;
  const consumption = `${station.consumption ?? 0} kWh`;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <PlugZap size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900">
                Détail de la borne
              </h1>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">
                Espace propriétaire
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/owner/stations")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Retour bornes
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                {station.name}
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                  station.status
                )}`}
              >
                {station.status}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={16} />
              <span>{station.location}</span>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
              Vue détaillée de la station avec ses caractéristiques techniques,
              son état actuel, ses indicateurs énergétiques et son historique
              d’utilisation.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100"
            >
              <Wrench size={16} />
              Maintenance
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100"
            >
              <Power size={16} />
              Désactiver
            </button>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Fiche technique
              </h3>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <InfoCard
                  icon={<Zap size={18} />}
                  title="Puissance"
                  value={powerValue}
                />
                <InfoCard
                  icon={<PlugZap size={18} />}
                  title="Connecteur"
                  value={connector}
                />
                <InfoCard
                  icon={<BatteryCharging size={18} />}
                  title="Batterie"
                  value={batteryValue}
                />
                <InfoCard
                  icon={<BarChart3 size={18} />}
                  title="Source énergie"
                  value={station.energy_source}
                />
                <InfoCard
                  icon={<Sun size={18} />}
                  title="Production solaire"
                  value={solarProduction}
                />
                <InfoCard
                  icon={<MapPin size={18} />}
                  title="Localisation"
                  value={station.location}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Historique récent
                </h3>
                <Link
                  to="/owner/sessions"
                  className="text-sm font-bold text-emerald-600 hover:underline"
                >
                  Voir sessions
                </Link>
              </div>

              <div className="space-y-4">
                <HistoryItem
                  title={`Réservations enregistrées : ${reservations}`}
                  time="Compteur synchronisé avec le backend"
                  type="Réservation"
                />
                <HistoryItem
                  title={`Sessions enregistrées : ${sessions}`}
                  time="Compteur synchronisé avec le backend"
                  type="Session"
                />
                <HistoryItem
                  title={`Dernier mode EMS : ${emsMode}`}
                  time={
                    station.last_recorded_at
                      ? new Date(station.last_recorded_at).toLocaleString()
                      : "Aucune métrique récente"
                  }
                  type="Énergie"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Indicateurs clés
              </h3>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-emerald-700">
                    <CalendarDays size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Réservations
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">
                    {reservations}
                  </p>
                </div>

                <div className="rounded-2xl bg-sky-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sky-700">
                    <Activity size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Sessions
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">
                    {sessions}
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-amber-700">
                    <BatteryCharging size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Batterie
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">
                    {batteryValue}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-slate-900">
                <Zap size={20} />
              </div>

              <h3 className="text-lg font-bold">État énergétique</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                La borne fonctionne avec une gestion énergétique optimisée et une
                intégration de la source d’énergie configurée dans le backend.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">Source dominante</span>
                  <span className="text-sm font-bold text-emerald-300">
                    {station.energy_source}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">Mode EMS</span>
                  <span className="text-sm font-bold text-amber-300">
                    {emsMode}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">Utilisation réseau</span>
                  <span className="text-sm font-bold text-white">
                    {gridUsage}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">Consommation</span>
                  <span className="text-sm font-bold text-white">
                    {consumption}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">Disponibilité</span>
                  <span className="text-sm font-bold text-white">
                    {station.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}