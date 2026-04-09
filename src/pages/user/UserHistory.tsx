import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  History,
  CalendarDays,
  MapPin,
  Bolt,
  Clock3,
  Wallet,
  CheckCircle2,
  XCircle,
  LogOut,
} from "lucide-react";

type HistoryItem = {
  id: string;
  stationName: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  energy: string;
  cost: string;
  type: "Réservation" | "Session";
  status: "Terminée" | "Annulée" | "Confirmée";
};

const HISTORY_DATA: HistoryItem[] = [
  {
    id: "1",
    stationName: "SolarPlug - Station Centre",
    location: "Sfax Centre",
    date: "06/03/2026",
    time: "14:30",
    duration: "01h20",
    energy: "12.5 kWh",
    cost: "4.37 DT",
    type: "Session",
    status: "Terminée",
  },
  {
    id: "2",
    stationName: "SolarPlug - Station Sfax Sud",
    location: "Sfax Sud",
    date: "05/03/2026",
    time: "10:00",
    duration: "00h45",
    energy: "7.8 kWh",
    cost: "2.73 DT",
    type: "Réservation",
    status: "Confirmée",
  },
  {
    id: "3",
    stationName: "SolarPlug - Station Route Tunis",
    location: "Route Tunis - Sfax",
    date: "03/03/2026",
    time: "18:15",
    duration: "00h00",
    energy: "0 kWh",
    cost: "0 DT",
    type: "Réservation",
    status: "Annulée",
  },
];

function statusBadge(status: HistoryItem["status"]) {
  if (status === "Terminée") return "bg-emerald-100 text-emerald-700";
  if (status === "Confirmée") return "bg-blue-100 text-blue-700";
  return "bg-rose-100 text-rose-700";
}

function typeBadge(type: HistoryItem["type"]) {
  if (type === "Session") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

export default function UserHistory() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/user/login");
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
              <div className="text-sm font-bold text-slate-900">Historique utilisateur</div>
              <div className="text-xs text-slate-500">
                Réservations et sessions précédentes
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              <History size={14} />
              Historique
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
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">Mes activités</h1>
          <p className="mt-2 text-sm text-slate-500">
            Consultez vos réservations et vos sessions de charge précédentes.
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          {HISTORY_DATA.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-black text-slate-900">{item.stationName}</h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${typeBadge(item.type)}`}
                    >
                      {item.type}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadge(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={15} />
                    {item.location}
                  </div>
                </div>

                <div className="flex gap-2">
                  {item.status === "Terminée" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 size={14} />
                      Session terminée
                    </span>
                  )}

                  {item.status === "Annulée" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                      <XCircle size={14} />
                      Réservation annulée
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <InfoBox
                  icon={<CalendarDays size={16} />}
                  label="Date"
                  value={`${item.date} • ${item.time}`}
                />
                <InfoBox
                  icon={<Clock3 size={16} />}
                  label="Durée"
                  value={item.duration}
                />
                <InfoBox
                  icon={<Bolt size={16} />}
                  label="Énergie"
                  value={item.energy}
                />
                <InfoBox
                  icon={<Wallet size={16} />}
                  label="Coût"
                  value={item.cost}
                />
                <InfoBox
                  icon={<History size={16} />}
                  label="Statut"
                  value={item.status}
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-sm font-black text-slate-900">{value}</div>
    </div>
  );
}