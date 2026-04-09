import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  BatteryCharging,
  CalendarDays,
  Clock3,
  Filter,
  Search,
  User,
  Zap,
  LogOut,
} from "lucide-react";

type SessionStatus = "Active" | "Terminée";

type ChargingSession = {
  id: number;
  userName: string;
  station: string;
  startTime: string;
  endTime: string;
  energy: string;
  cost: string;
  source: string;
  status: SessionStatus;
};

const sessions: ChargingSession[] = [
  {
    id: 1,
    userName: "Mariem Chamekh",
    station: "Solar Station Tunis 01",
    startTime: "09:00",
    endTime: "09:45",
    energy: "14.2 kWh",
    cost: "8.500 DT",
    source: "Solaire",
    status: "Terminée",
  },
  {
    id: 2,
    userName: "Ahmed Ben Ali",
    station: "Solar Station Sfax 02",
    startTime: "10:30",
    endTime: "--",
    energy: "7.8 kWh",
    cost: "4.200 DT",
    source: "Batterie",
    status: "Active",
  },
  {
    id: 3,
    userName: "Sara Trabelsi",
    station: "Solar Station Sousse 03",
    startTime: "13:15",
    endTime: "14:05",
    energy: "18.4 kWh",
    cost: "10.900 DT",
    source: "Réseau",
    status: "Terminée",
  },
  {
    id: 4,
    userName: "Youssef Gharbi",
    station: "Solar Station Nabeul 04",
    startTime: "15:10",
    endTime: "--",
    energy: "5.1 kWh",
    cost: "2.900 DT",
    source: "Solaire + Batterie",
    status: "Active",
  },
];

function getStatusClass(status: SessionStatus) {
  if (status === "Active") return "bg-emerald-50 text-emerald-600";
  return "bg-slate-100 text-slate-600";
}

function getSourceClass(source: string) {
  if (source.includes("Solaire")) return "bg-amber-50 text-amber-700";
  if (source.includes("Batterie")) return "bg-emerald-50 text-emerald-700";
  return "bg-sky-50 text-sky-700";
}

function SessionCard({ session }: { session: ChargingSession }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">
              {session.userName}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                session.status
              )}`}
            >
              {session.status}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${getSourceClass(
                session.source
              )}`}
            >
              {session.source}
            </span>
          </div>

          <div className="mt-4 grid gap-3 text-sm text-slate-500 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-2">
              <BatteryCharging size={15} />
              <span>{session.station}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3 size={15} />
              <span>Début : {session.startTime}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3 size={15} />
              <span>Fin : {session.endTime}</span>
            </div>

            <div className="flex items-center gap-2">
              <Zap size={15} />
              <span>{session.energy}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={15} />
              <span>Coût : {session.cost}</span>
            </div>

            <div className="flex items-center gap-2">
              <User size={15} />
              <span>ID session : #{session.id}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Voir détail
          </button>

          <button className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">
            Exporter
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChargingSessionsManagement() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/owner/login");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Activity size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900">
                Sessions de charge
              </h1>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">
                Espace propriétaire
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/owner/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Retour dashboard
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
        {/* Intro */}
        <section className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Sessions réelles de charge
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Suivez l’exploitation réelle des bornes, l’énergie consommée et la
              source énergétique utilisée.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            9 sessions actives • 37 terminées aujourd’hui
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="relative lg:col-span-2">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Rechercher par utilisateur ou station..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-300 focus:bg-white"
              />
            </div>

            <input
              type="date"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
            />

            <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Filter size={16} />
              Filtrer
            </button>
          </div>
        </section>

        {/* Sessions list */}
        <section className="grid gap-6">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </section>
      </main>
    </div>
  );
}