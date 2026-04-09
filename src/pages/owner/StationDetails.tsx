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

type StationStatus = "Disponible" | "Occupée" | "Maintenance";

type Station = {
  id: string;
  name: string;
  location: string;
  status: StationStatus;
  power: string;
  connector: string;
  battery: string;
  energySource: string;
  solarProduction: string;
  reservations: number;
  sessions: number;
};

const stations: Record<string, Station> = {
  "1": {
    id: "1",
    name: "Solar Station Tunis 01",
    location: "Tunis Centre",
    status: "Disponible",
    power: "22 kW",
    connector: "Type 2 / CCS",
    battery: "84%",
    energySource: "Solaire + Batterie",
    solarProduction: "58 kWh",
    reservations: 12,
    sessions: 48,
  },
  "2": {
    id: "2",
    name: "Solar Station Sfax 02",
    location: "Route de l’Aéroport",
    status: "Occupée",
    power: "50 kW",
    connector: "CCS",
    battery: "67%",
    energySource: "Solaire + Réseau",
    solarProduction: "74 kWh",
    reservations: 18,
    sessions: 73,
  },
  "3": {
    id: "3",
    name: "Solar Station Sousse 03",
    location: "Zone Touristique",
    status: "Maintenance",
    power: "22 kW",
    connector: "Type 2",
    battery: "41%",
    energySource: "Batterie + Réseau",
    solarProduction: "31 kWh",
    reservations: 7,
    sessions: 29,
  },
  "4": {
    id: "4",
    name: "Solar Station Nabeul 04",
    location: "Nabeul Ville",
    status: "Disponible",
    power: "43 kW",
    connector: "CCS / Type 2",
    battery: "92%",
    energySource: "Solaire",
    solarProduction: "81 kWh",
    reservations: 20,
    sessions: 95,
  },
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
  const navigate = useNavigate();
  const { id } = useParams();
  const station = id ? stations[id] : undefined;

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/owner/login");
  };

  if (!station) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">
            Station introuvable
          </h1>
          <p className="mt-3 text-slate-500">
            La borne demandée n’existe pas ou n’est plus disponible.
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

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
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

          <div className="flex items-center gap-3">
            <Link
              to="/owner/stations"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Retour bornes
            </Link>

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

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Top intro */}
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
            <button className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100">
              <Wrench size={16} />
              Maintenance
            </button>

            <button className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100">
              <Power size={16} />
              Désactiver
            </button>
          </div>
        </section>

        {/* Main grid */}
        <section className="grid gap-8 lg:grid-cols-3">
          {/* Left content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Technical details */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Fiche technique
              </h3>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <InfoCard
                  icon={<Zap size={18} />}
                  title="Puissance"
                  value={station.power}
                />
                <InfoCard
                  icon={<PlugZap size={18} />}
                  title="Connecteur"
                  value={station.connector}
                />
                <InfoCard
                  icon={<BatteryCharging size={18} />}
                  title="Batterie"
                  value={station.battery}
                />
                <InfoCard
                  icon={<BarChart3 size={18} />}
                  title="Source énergie"
                  value={station.energySource}
                />
                <InfoCard
                  icon={<Sun size={18} />}
                  title="Production solaire"
                  value={station.solarProduction}
                />
                <InfoCard
                  icon={<MapPin size={18} />}
                  title="Localisation"
                  value={station.location}
                />
              </div>
            </div>

            {/* Activity history */}
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
                  title="Session terminée — 14.2 kWh"
                  time="Aujourd’hui • 10:42"
                  type="Session"
                />
                <HistoryItem
                  title="Réservation confirmée"
                  time="Aujourd’hui • 09:15"
                  type="Réservation"
                />
                <HistoryItem
                  title="Contrôle batterie effectué"
                  time="Hier • 17:30"
                  type="Maintenance"
                />
              </div>
            </div>
          </div>

          {/* Right sidebar */}
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
                    {station.reservations}
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
                    {station.sessions}
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
                    {station.battery}
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
                intégration solaire active.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">Source dominante</span>
                  <span className="text-sm font-bold text-emerald-300">
                    Solaire
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">Mode EMS</span>
                  <span className="text-sm font-bold text-amber-300">ECO</span>
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